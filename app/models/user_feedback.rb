class UserFeedback < ApplicationRecord
  belongs_to :user

  validate :type, :category, :text, presence: true

  after_create :email_team


  private

  def email_team
    FeedbackMailer.email_team(self).deliver
  end
end
