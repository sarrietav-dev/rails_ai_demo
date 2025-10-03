class Message < ApplicationRecord
  acts_as_message
  has_many_attached :attachments
  broadcasts_to ->(message) { "chat_#{message.chat_id}" }

  def broadcast_append_chunk(chunk_content)
    broadcast_append_to "chat_#{chat_id}",
      target: "message_#{id}_content",
      html: chunk_content
  end
end
