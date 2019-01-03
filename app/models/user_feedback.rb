class UserFeedback < ApplicationRecord
  belongs_to :user

  validates :type, :category, :text, presence: true

  after_create :email_team


  private

  def email_team
    FeedbackMailer.email_team(self).deliver
  end
end
