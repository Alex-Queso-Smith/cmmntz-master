class Following < ApplicationRecord
  belongs_to :follower, class_name: 'User', foreign_key: :follower_id
  belongs_to :following, class_name: 'User', foreign_key: :following_id

  validates :following_id, uniqueness: { scope: :follower_id }

  after_create_commit :remove_previous_blockings

  private

  def remove_previous_blockings
    follower.blocked_users.delete(following) if follower.blocked_users.include?(following)
  end
end
