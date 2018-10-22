class Vote < ApplicationRecord
  BASIC_VOTES = ['like', 'indifferent', 'dislike']
  EXCLUSIVE_VOTES = ['really_like'] + BASIC_VOTES + ['really_dislike']
  TYPES = ['top'] + Vote::EXCLUSIVE_VOTES + ['flag']

  belongs_to :user
  belongs_to :comment

  validates :vote_type, presence: true, inclusion: { in: TYPES }
  validates :vote_type, uniqueness: { scope: [:user_id, :comment_id, :vote_type]}
  # validate :vote_is_unique_from_exclusve_group

  scope :for_user_and_comment, lambda {|user_id, comment_id| where(user_id: user_id, comment_id: comment_id)}
  scope :of_vote_type, lambda {|vote_type| where(vote_type: vote_type)}

  private

  ### Custom validations

  def vote_is_unique_from_exclusve_group
    return true unless EXCLUSIVE_VOTES.include?(vote_type)
    prev_votes = Vote.for_user_and_comment(user_id, comment_id).of_vote_type(EXCLUSIVE_VOTES)
    errors.add(:base) << "can not be from the exclusive group of #{EXCLUSIVE_VOTES}" if prev_votes.any?
  end
end
