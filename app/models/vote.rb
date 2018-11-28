include ActionView::Helpers::TextHelper
class Vote < ApplicationRecord
  include ActiveSupport::Inflector
  EXCLUSIVE_VOTES = ['like_a_lot', 'like', 'indifferent', 'dislike', 'dislike_a_lot']
  TYPES = ['top', 'love'] + Vote::EXCLUSIVE_VOTES + ['trash', 'warn', 'smart', 'funny', 'happy', 'shocked', 'sad', 'boring', 'angry']

  attr_accessor :force, :old_top_id


  belongs_to :user

  belongs_to :comment
  belongs_to :comment_vote_tabulation, primary_key: 'id', foreign_key: 'comment_id', optional: true

  delegate :art, to: :comment

  before_validation :normalize_vote_type

  validates :vote_type, presence: true, inclusion: { in: TYPES }
  validates :vote_type, uniqueness: { scope: [:user_id, :comment_id, :vote_type]}
  validate :vote_is_unique_from_exclusve_group, :art_is_not_disabled, :deal_with_duplicate_top_votes

  after_create_commit :add_comment_interaction_for_comment_and_user!, :update_last_interaction_at_for_art!

  before_destroy :art_is_not_disabled_for_destory

  scope :for_user_and_comment, lambda {|user_id, comment_id| where(user_id: user_id, comment_id: comment_id)}
  scope :of_vote_type, lambda {|vote_type| where(vote_type: vote_type)}

  scope :created_since, -> (datetime) {
    where(arel_table[:created_at].gteq(datetime))
  }

  private

  ### Custom validations

  def vote_is_unique_from_exclusve_group
    return true unless EXCLUSIVE_VOTES.include?(vote_type)
    prev_votes = Vote.for_user_and_comment(user_id, comment_id).of_vote_type(EXCLUSIVE_VOTES)
    prev_votes = prev_votes.where.not(id: id) if id
    errors.add(:base) << "can not be from the exclusive group of #{EXCLUSIVE_VOTES.join(', ')}" if prev_votes.any?
  end

  def art_is_not_disabled
    if art.deactivated?
      errors[:art] << "This Thread has been deactivated."
      errors[:art] << "deactivated"
    elsif art.disabled?
      errors[:art] << "This Thread has been disabled.\n\nPosting and replying to it has been deactivated."
      errors[:art] << "disabled"
    end
  end

  def art_is_not_disabled_for_destory
    art_is_not_disabled
    return true if errors.empty?
    throw(:abort)
  end

  def deal_with_duplicate_top_votes
    return unless comment
    return unless vote_type == "top"

    all_thread_comment_ids = Comment.select(:id).for_art_type_and_id(comment.art_type, comment.art_id).map(&:id)
    top_votes_for_user = Vote.for_user_and_comment(user_id, all_thread_comment_ids).of_vote_type('top')

    # if force flag passed or user is owner of prev comment:
    # delete prev top votes for user for thread
    comments_owned_by = top_votes_for_user.map(&:comment).flatten.map(&:user_id)

    if (self.force == true || self.force == 'true') || (comments_owned_by.any? && comments_owned_by.first == user_id)
      self.old_top_id = top_votes_for_user.first.comment.id if top_votes_for_user.first
      top_votes_for_user.destroy_all

      return
    end

    if top_votes_for_user.any?
      c = top_votes_for_user.first.comment
      errors.add(:top) << "You have already voted the following as top (A):\n\n#{truncate(c.text, length: 100)}\n\nWould you like to change your top vote for this thread to (B):\n\n#{truncate(comment.text, length: 100)}"
      errors.add(:top) << c.id
    end
  end

  ### Preprocessors

  def normalize_vote_type
    return unless !vote_type.blank?
    self.vote_type = vote_type.underscore
  end

  ### Postprocessors

  def add_comment_interaction_for_comment_and_user!
    CommentInteraction.create_for_user_and_comment(self.user_id, self.comment_id)
  end

  ### Postprocessors

  def update_last_interaction_at_for_art!
    Art.find(comment.art_id).update_attribute("last_interaction_at", Time.now())
  end


  ### searches

  def self.for_thread_since(thread, last_check)
    joins(:comment).created_since(last_check).where(comments: {art_type: 'art', art_id: thread.id})
  end
end
