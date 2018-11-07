class Following < ApplicationRecord
  belongs_to :follower, class: :user
  belongs_to :following, class: :user
end
