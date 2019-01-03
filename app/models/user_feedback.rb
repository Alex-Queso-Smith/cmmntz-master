class UserFeedback < ApplicationRecord
  belongs_to :user

  validates :type, :category, :text, presence: true
end
