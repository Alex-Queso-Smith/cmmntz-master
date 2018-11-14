include ActionView::Helpers::SanitizeHelper
class AdminMail < ApplicationRecord
  attr_accessor :user_name
  belongs_to :user

  before_validation :strip_html_from_content_and_subject, :set_user_id

  validates :user_id, :subject, :content, presence: true
  validates :content, length: { in: 1..1000 }
  validates :subject, length: { in: 1..100 }

  after_create :send_mail

  private

  def strip_html_from_content_and_subject
    self.subject = strip_tags(subject)
    self.content = strip_tags(content)
  end

  def set_user_id
    user = User.find_by(user_name: user_name)
    self.user = user if user
  end

  def send_mail
    AdminEmailJob.perform_later(user.email, "Classifilter: #{subject}", content)
  end
end
