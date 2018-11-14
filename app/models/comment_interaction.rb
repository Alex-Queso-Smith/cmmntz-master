class CommentInteraction < ApplicationRecord
  belongs_to :comment, counter_cache: 'interactions_count'
  belongs_to :comment_vote_tabulation, primary_key: 'id', foreign_key: "comment_id", optional: true
  belongs_to :user

  validates :comment_id, :user_id, presence: true
  validates :comment_id, uniqueness: { scope: :user_id }

  scope :for_user_and_comment, lambda {|user_id, comment_id| where(user_id: user_id, comment_id: comment_id)}

  def self.create_for_user_and_comment(user, comment)
    if self.for_user_and_comment(user, comment).size == 0
      create!(user_id: user, comment_id: comment)
    end
  rescue
    # the only way this should trip is if there is one already
    # in which case this is superfluous
    true
  end
end
