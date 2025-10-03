import { Controller } from "@hotwired/stimulus"

/**
 * Chat Controller
 *
 * Manages chat interface behavior, specifically auto-scrolling to show
 * the latest messages as they arrive via Turbo Streams.
 */
export default class extends Controller {
  static targets = ["messages"]

  connect() {
    // Scroll to bottom on initial load
    this.scrollToBottom()

    // Watch for new messages being added to the DOM
    this.observer = new MutationObserver(() => {
      this.scrollToBottom()
    })

    this.observer.observe(this.messagesTarget, {
      childList: true,  // Watch for new message elements
      subtree: true     // Also watch nested elements (for streaming chunks)
    })
  }

  disconnect() {
    // Clean up observer when controller is destroyed
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  /**
   * Scrolls the message container to the bottom to show latest message
   */
  scrollToBottom() {
    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight
  }

  /**
   * Called when message form is submitted
   * Adds slight delay to ensure new message is rendered before scrolling
   */
  messageSubmitted() {
    setTimeout(() => this.scrollToBottom(), 100)
  }
}
