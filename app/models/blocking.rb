class Blocking < ApplicationRecord
  belongs_to :blocker, class_name: 'User', foreign_key: :blocker_id
  belongs_to :blocking, class_name: 'User', foreign_key: :blocking_id

  validates :blocking_id, uniqueness: { scope: :blocking_id }
end
