class UserFeedback < ApplicationRecord
  belongs_to :user

  validate :type, :category, :text, presence: true
end
