class UserFeedback < ApplicationRecord
  belongs_to :user

  validates :type, :category, :first_name, :last_name, :text, presence: true

  after_create :email_team#, :email_user


  private

  def email_team
    FeedbackMailer.email_team(self).deliver
  end

  def email_user
    return if user.guest?
    email_type = "email_user_#{type.downcase}"

    FeedbackMailer.send(email_type ,self).deliver
  end
end
