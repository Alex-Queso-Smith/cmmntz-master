include ActionView::Helpers::SanitizeHelper
class Comment < ApplicationRecord
  attr_accessor :vote_types

  belongs_to :user
  has_many :votes
  has_many :comment_interactions

  before_validation :sanitize_text

  validates :user_id, :text, presence: true

  validates :text, length: { in: 1..3000 }
  validate :text_does_not_have_html

  after_create_commit :parse_and_create_votes

  private


  ### Custom Validations be here

  def text_does_not_have_html
    text_hold = text
    errors[:text] << "HTML is not allowed in text" if strip_tags(text_hold) != text
  end

  ### before_validations actions

  def sanitize_text
    self.text = sanitize(text, tags: []) unless text.blank?
  end

  ### Postprocessors

  def parse_and_create_votes
    return if vote_types.blank?
    vote_list = []
    vote_types.split(',').each do |vote|
      v = self.votes.build(user_id: user_id, vote_type: vote)
      vote_list << v if v.valid?
    end

    Vote.import vote_list
  end
end
