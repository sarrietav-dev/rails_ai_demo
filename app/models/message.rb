class Message < ApplicationRecord
  # RubyLLM integration - provides chat message functionality
  acts_as_message

  # ActiveStorage attachments for files/images in messages
  has_many_attached :attachments

  # Broadcast changes to the chat's Turbo Stream channel
  broadcasts_to ->(message) { "chat_#{message.chat_id}" }

  # Broadcasts a chunk of content to the message's content div
  # Used for progressive streaming of LLM responses
  #
  # @param chunk_content [String] The text chunk to append
  def broadcast_append_chunk(chunk_content)
    broadcast_append_to "chat_#{chat_id}",
      target: "message_#{id}_content",
      html: chunk_content
  end
end
