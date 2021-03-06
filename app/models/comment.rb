include ActionView::Helpers::SanitizeHelper
class Comment < ApplicationRecord
  include CommentBase
  include CommentSearchs

  attr_accessor :vote_types, :force, :old_top_id

  belongs_to :user, optional: true
  belongs_to :art
  belongs_to :gallery
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :replies, class_name: 'Comment', foreign_key: :parent_id
  has_many :votes
  has_many :flag_votes, -> { where(vote_type: "warn") }, class_name: "Vote", foreign_key: "comment_id"
  has_many :comment_interactions

  accepts_nested_attributes_for :votes

  before_validation :sanitize_text, :set_gallery_id
  before_validation :parse_and_build_votes, on: :create
  validates :user_id, :text, presence: true

  validates :text, length: { in: 1..3000 }
  validate :text_does_not_have_html, :art_is_not_disabled, :user_has_min_interactions

  scope :for_art_type_and_id, lambda { |type, id| where(art_type: type, art_id: id ) }

  before_create :set_guest!
  before_save :censor_text!, :set_approval!
  after_create_commit :add_art_interaction_for_art_and_user!, :update_last_interaction_at_for_art!
  after_commit :alert_admin_of_comment!

  def by_admin_of?(gallery_admin_ids)
    return false if anonymous?
    gallery_admin_ids.include?(user_id)
  end

  def edited?
    !edited_at.blank?
  end

  private

  ### Custom Validations be here

  def text_does_not_have_html
    text_hold = text
    errors[:text] << "HTML is not allowed in text" if strip_tags(text_hold) != text
  end

  def art_is_not_disabled
    if art.deactivated?
      errors[:art] << "This Thread has been deactivated."
      errors[:art] << "deactivated"
      errors[:art] << art.disabled_message if art.disabled_message
    elsif art.disabled?
      errors[:art] << "This Thread has been disabled.\n\nPosting and replying to it has been deactivated.\n\nYou action has been cancelled."
      errors[:art] << "disabled"
      errors[:art] << art.disabled_message if art.disabled_message
    end
  end

  def user_has_min_interactions
    return true # deactivate for now
    min_interactions = 0
    user_interactions = user.comment_interactions.limit(min_interactions).size
    errors[:user] << "You must have 5 votes to comment.\n\nPlease vote on #{min_interactions - user_interactions} more comments or replies. " unless user_interactions >= min_interactions
  end



  ### before_validations actions
  def set_gallery_id
    self.gallery_id = art.gallery_id
  end
  def sanitize_text
    self.text = sanitize(text, tags: []) unless text.blank?
  end

  ### Preprocessors

  def set_guest!
    self.guest = user.guest?
  end

  def censor_text!
    text_hold = text
    BAD_WORDS.each do |word|
      text_hold = text_hold.gsub(/#{word}/i, ("*" * word.length)) || text_hold
    end
    self.censored_text = text_hold
  end

  def set_approval!
    self.approved = !(art.comment_requires_approval? || art.comment_requires_guest_approval?(self))
    self.approved_by = "auto" if approved?
  end

  def parse_and_build_votes
    return if vote_types.blank?
    vote_types.split(',').each do |vote|
      next unless Vote::TYPES.include?(vote)
      v = self.votes.build(user_id: user_id, vote_type: vote, force: force)
      v.valid?
    end

    self.old_top_id = votes.map(&:old_top_id).first if votes.map(&:old_top_id).any?
  end

  ### Postprocessors
  def add_art_interaction_for_art_and_user!
    ArtInteraction.create_for_user_and_art(self.user_id, self.art_id)
  end

  def update_last_interaction_at_for_art!
    Art.find(art_id).update_attribute("last_interaction_at", Time.now())
  end

  def alert_admin_of_comment!
    return unless art.moderators_request_notification?(self)
    AdminMailer.notify_of_new_comment(art, self).deliver_later
  end
end
