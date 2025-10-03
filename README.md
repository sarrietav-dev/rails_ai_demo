# Rails AI Demo: Streaming Chat with Hotwire

A demonstration of real-time AI chat streaming using Rails 8, Hotwire (Turbo Streams), and the [`ruby_llm`](https://github.com/crmne/ruby_llm) gem. This app showcases how to build a modern, reactive chat interface with progressive markdown rendering without writing a single line of WebSocket code.

## Overview

This project demonstrates:

- Real-time streaming of LLM responses using Turbo Streams
- Progressive markdown rendering as content streams in
- Background job processing for AI API calls
- Clean separation of concerns with Hotwire patterns

## Tech Stack

- **Rails 8.0** - Web framework
- **ruby_llm** - LLM integration gem (abstracts OpenAI, Anthropic, etc.)
- **Turbo Streams** - Real-time updates over Server-Sent Events (SSE)
- **Stimulus** - Minimal JavaScript for interactivity
- **SolidQueue** - Background job processing
- **streaming-markdown** - NPM package for incremental markdown rendering
- **Tailwind CSS** - Styling

## Setup

### Prerequisites

- Ruby 3.x
- Node.js (for asset pipeline)
- SQLite 3

### Installation

```bash
# Install dependencies
bundle install
npm install

# Setup database
rails db:create db:migrate

# Configure environment variables
cp .env.example .env
# Edit .env and add your LLM API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.)

# Start the server (includes SolidQueue background workers)
bin/dev
```

### Environment Variables

```env
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
# Add other LLM provider keys as needed
```

## How the Streaming Chat Works

This is the core technical flow of the application. Understanding this will help you build similar real-time streaming features in Rails.

### 1. Message Creation Flow

**Entry Point: User submits a message**

When a user types a message and clicks "Send", the flow begins:

```ruby
# app/controllers/messages_controller.rb:4-12
def create
  return unless content.present?

  ChatResponseJob.perform_later(@chat.id, content)

  respond_to do |format|
    format.turbo_stream  # Returns app/views/messages/create.turbo_stream.erb
    format.html { redirect_to @chat }
  end
end
```

**What happens:**

1. Controller immediately enqueues a background job (non-blocking)
2. Returns a Turbo Stream response that:
   - Appends both user and assistant messages to the DOM
   - Resets the form

```erb
<!-- app/views/messages/create.turbo_stream.erb:1-9 -->
<%= turbo_stream.append "messages" do %>
  <% @chat.messages.last(2).each do |message| %>
    <%= render message %>
  <% end %>
<% end %>

<%= turbo_stream.replace "new_message" do %>
  <%= render "messages/form", chat: @chat, message: @chat.messages.build %>
<% end %>
```

### 2. Background Job Processing

**The AI Response Generation**

```ruby
# app/jobs/chat_response_job.rb:2-11
def perform(chat_id, content)
  chat = Chat.find(chat_id)

  chat.ask(content) do |chunk|
    if chunk.content && !chunk.content.blank?
      message = chat.messages.last
      message.broadcast_append_chunk(chunk.content)
    end
  end
end
```

**Key Points:**

- `chat.ask(content)` is provided by `ruby_llm`'s `acts_as_chat` macro
- The block receives streaming chunks as they arrive from the LLM API
- Each chunk is immediately broadcast to connected clients

### 3. Broadcasting Chunks via Turbo Streams

**Real-time Delivery**

```ruby
# app/models/message.rb:8-19
broadcasts_to ->(message) { "chat_#{message.chat_id}" }

def broadcast_append_chunk(chunk_content)
  broadcast_append_to "chat_#{chat_id}",
    target: "message_#{id}_content",
    html: chunk_content
end
```

**How it works:**

1. Each message belongs to a Turbo Stream channel: `chat_#{chat_id}`
2. Clients subscribe via `<%= turbo_stream_from "chat_#{@chat.id}" %>` in the view
3. `broadcast_append_to` sends HTML over SSE to append text to the message div
4. No WebSockets needed - uses native Rails + Hotwire capabilities

### 4. Progressive Markdown Rendering

**The Client-Side Magic**

```javascript
// app/javascript/controllers/markdown_controller.js:18-38
connect() {
  if (this.roleValue !== 'assistant') return

  this.rawContent = this.element.textContent
  this.element.textContent = ""

  const renderer = default_renderer(this.element)
  this.parser = parser(renderer)

  if (this.rawContent) {
    parser_write(this.parser, this.rawContent)
  }

  // Watch for new text chunks being added via Turbo Streams
  this.observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            const chunk = node.textContent
            node.remove()
            parser_write(this.parser, chunk)  // Convert to formatted HTML
          }
        }
      }
    }
  })
```

**The Flow:**

1. Stimulus controller activates on each message div
2. Only processes assistant messages (user messages stay as plain text)
3. Uses `streaming-markdown` npm library for incremental parsing
4. MutationObserver watches for new text nodes added by Turbo Streams
5. Each raw text chunk is parsed and rendered as formatted HTML immediately
6. Supports partial markdown (e.g., incomplete code blocks)

### 5. Auto-scrolling

**Keeping Latest Messages Visible**

```javascript
// app/javascript/controllers/chat_controller.js:12-24
connect() {
  this.scrollToBottom()

  this.observer = new MutationObserver(() => {
    this.scrollToBottom()
  })

  this.observer.observe(this.messagesTarget, {
    childList: true,  // Watch for new message elements
    subtree: true     // Also watch nested elements (for streaming chunks)
  })
}
```

**Why this matters:**

- As chunks arrive and messages grow, the chat auto-scrolls
- MutationObserver detects both new messages and content changes within messages
- Provides smooth UX without manual scroll management

## Complete Data Flow Diagram

```
User Types Message
       ↓
[MessagesController#create]
       ├─→ Enqueue ChatResponseJob
       └─→ Return Turbo Stream (append user + empty assistant message)
              ↓
[Browser receives Turbo Stream]
       └─→ Appends messages to DOM
       └─→ Markdown controller initializes on assistant message
       └─→ Chat controller scrolls to bottom
              ↓
[ChatResponseJob executes in background]
       └─→ chat.ask(content) { |chunk| ... }
              ├─→ Calls LLM API (streaming)
              └─→ For each chunk:
                     └─→ message.broadcast_append_chunk(chunk)
                            ↓
[Browser receives chunk via Turbo Stream SSE]
       └─→ Appends text to message_#{id}_content div
              ↓
[Markdown Controller's MutationObserver fires]
       └─→ Detects new text node
       └─→ Removes raw text
       └─→ Parses as markdown
       └─→ Renders formatted HTML
              ↓
[Chat Controller's MutationObserver fires]
       └─→ Scrolls to show latest content
```

## Database Schema

```ruby
# Core tables (managed by ruby_llm gem)
chats        # Conversation containers
  - model_id

messages     # Individual chat messages
  - chat_id
  - role (user/assistant/system)
  - content
  - input_tokens, output_tokens

models       # LLM model registry
  - provider (openai, anthropic, etc.)
  - model_id
  - capabilities, pricing, etc.

tool_calls   # Function calling support
  - message_id
  - name, arguments
```

## Project Structure

```
app/
├── controllers/
│   ├── chats_controller.rb      # Chat CRUD
│   └── messages_controller.rb   # Message creation (triggers background job)
├── jobs/
│   └── chat_response_job.rb     # Streams LLM responses
├── models/
│   ├── chat.rb                  # acts_as_chat (ruby_llm)
│   ├── message.rb               # acts_as_message + broadcasting
│   └── model.rb                 # acts_as_model (ruby_llm)
├── views/
│   ├── chats/
│   │   └── show.html.erb        # Main chat interface
│   └── messages/
│       ├── _message.html.erb    # Message bubble (user/assistant)
│       └── create.turbo_stream.erb  # Turbo Stream response
└── javascript/controllers/
    ├── chat_controller.js       # Auto-scrolling
    └── markdown_controller.js   # Progressive markdown rendering
```

## Usage

1. Visit <http://localhost:3000>
2. Create a new chat and select a model
3. Type a message and watch it stream in real-time
4. Markdown formatting appears progressively as the AI responds

## Ruby LLM Integration

This project uses the `ruby_llm` gem which provides:

- `acts_as_chat` - Adds conversation management to Chat model
- `acts_as_message` - Adds message handling to Message model
- `acts_as_model` - Adds LLM model registry to Model model
- Unified API across multiple LLM providers
- Built-in streaming support
- Token counting and cost tracking

The gem abstracts away provider-specific code, allowing you to switch between OpenAI, Anthropic, Google, etc. by just changing the model selection.

## License

This is a demonstration project. Use it as a reference for building your own Hotwire + LLM applications.
