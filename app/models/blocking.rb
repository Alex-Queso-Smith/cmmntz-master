class Blocking < ApplicationRecord
  belongs_to :blocker, class_name: 'User', foreign_key: :blocker_id
  belongs_to :blocking, class_name: 'User', foreign_key: :blocking_id

  validates :blocking_id, uniqueness: { scope: :blocker_id }

  after_create_commit :remove_previous_followings

  private

  def remove_previous_followings
    blocker.followed_users.delete(blocking) if blocker.followed_users.include?(blocking)
  end
  
end
