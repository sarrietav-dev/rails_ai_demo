import { Controller } from "@hotwired/stimulus"
import { parser, parser_write, parser_end, default_renderer } from "streaming-markdown"

/**
 * Markdown Controller
 *
 * Renders streaming markdown content progressively as chunks arrive.
 * Uses the streaming-markdown library to parse and format markdown incrementally
 * without re-parsing the entire content on each update.
 *
 * Only applies to assistant messages (user messages remain as plain text).
 */
export default class extends Controller {
  static values = {
    role: String  // Message role: 'user' or 'assistant'
  }

  connect() {
    // Only process markdown for assistant messages
    if (this.roleValue !== 'assistant') {
      return
    }

    // Store the original text content and clear the element
    this.rawContent = this.element.textContent
    this.element.textContent = ""

    // Create a renderer that writes formatted HTML to this element
    const renderer = default_renderer(this.element)

    // Initialize streaming markdown parser
    // This parser can handle incomplete markdown and formats incrementally
    this.parser = parser(renderer)

    // Process any existing content (for messages loaded from database)
    if (this.rawContent) {
      parser_write(this.parser, this.rawContent)
    }

    // Watch for new text chunks being added via Turbo Streams
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            // Only process raw text nodes
            if (node.nodeType === Node.TEXT_NODE) {
              const chunk = node.textContent
              node.remove()                    // Remove the raw text node
              parser_write(this.parser, chunk) // Parse and render as formatted HTML
            }
          }
        }
      }
    })

    this.observer.observe(this.element, {
      childList: true,  // Watch for new child nodes
      subtree: false    // Don't watch nested elements (just direct children)
    })
  }

  disconnect() {
    // Clean up when controller is destroyed
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.parser) {
      parser_end(this.parser)
    }
  }
}
