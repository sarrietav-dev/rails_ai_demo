import { Controller } from "@hotwired/stimulus"
import { parser, parser_write, parser_end, default_renderer } from "streaming-markdown"

export default class extends Controller {
  static values = {
    role: String
  }

  connect() {
    // Only process markdown for assistant messages
    if (this.roleValue !== 'assistant') {
      return
    }

    // Store the original text content and clear the element
    this.rawContent = this.element.textContent
    this.element.textContent = ""

    // Create a renderer that writes to this element
    const renderer = default_renderer(this.element)

    // Initialize streaming markdown parser
    this.parser = parser(renderer)

    // Process any existing content
    if (this.rawContent) {
      parser_write(this.parser, this.rawContent)
    }

    // Observe for new text nodes being added (from Turbo Stream chunks)
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
              const chunk = node.textContent
              node.remove() // Remove the raw text node
              parser_write(this.parser, chunk) // Parse and render it
            }
          }
        }
      }
    })

    this.observer.observe(this.element, {
      childList: true,
      subtree: false
    })
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.parser) {
      parser_end(this.parser)
    }
  }
}
