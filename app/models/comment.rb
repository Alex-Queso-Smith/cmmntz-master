include ActionView::Helpers::SanitizeHelper
class Comment < ApplicationRecord
  include CommentBase

  attr_accessor :vote_types

  belongs_to :user
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :replies, class_name: 'Comment', foreign_key: :parent_id
  has_many :votes
  has_many :comment_interactions

  before_validation :sanitize_text

  validates :user_id, :text, presence: true

  validates :text, length: { in: 1..3000 }
  validate :text_does_not_have_html

  after_create_commit :parse_and_create_votes

  scope :for_art_type_and_id, lambda { |type, id| where(art_type: type, art_id: id ) }

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

    if vote_list.any?
      Vote.import vote_list
      self.comment_interactions.create!(user_id: user_id)
    end
  end
end
