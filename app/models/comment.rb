include ActionView::Helpers::SanitizeHelper

class Comment < ApplicationRecord
  belongs_to :user
  has_many :votes

  before_validation :sanitize_text_and_title

  validates :user_id, :art_id, :art_type, :text, presence: true

  validates :title, length: { in: 1..32 }
  validates :text, length: { in: 1..512 }
  validate :text_does_not_have_html, :title_does_not_have_html

  ### Scopes
  scope :for_art_type_and_id, lambda { |type, id| where(art_type: type, art_id: id ) }

  private

  ### Custom Validations be here

  def text_does_not_have_html
    text_hold = text
    errors[:text] << "HTML is not allowed in text" if strip_tags(text_hold) != text
  end

  def title_does_not_have_html
    title_hold = title
    errors[:text] << "HTML is not allowed in text" if strip_tags(title_hold) != title
  end

  ### before_validations actions

  def sanitize_text_and_title
    self.text = sanitize(text, tags: []) unless text.blank?
    self.title = sanitize(title, tags: []) unless title.blank?
  end
end
