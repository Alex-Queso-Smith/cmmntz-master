include ActionView::Helpers::SanitizeHelper
class Comment < ApplicationRecord
  include CommentBase

  attr_accessor :vote_types, :force, :old_top_id

  belongs_to :user
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :replies, class_name: 'Comment', foreign_key: :parent_id
  has_many :votes
  has_many :comment_interactions

  accepts_nested_attributes_for :votes

  before_validation :sanitize_text
  before_validation :parse_and_build_votes, on: :create
  validates :user_id, :text, presence: true

  validates :text, length: { in: 1..3000 }
  validate :text_does_not_have_html

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

  ### Preprocessors

  def parse_and_build_votes
    return if vote_types.blank?
    vote_types.split(',').each do |vote|
      next unless Vote::TYPES.include?(vote)
      v = self.votes.build(user_id: user_id, vote_type: vote, force: force)
      v.valid?
    end

    self.old_top_id = votes.map(&:old_top_id).first if votes.map(&:old_top_id).any?
  end
end
