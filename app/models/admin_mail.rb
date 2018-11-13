include ActionView::Helpers::SanitizeHelper
class AdminMail < ApplicationRecord
  belongs_to :user

  before_validation :strip_html_from_content_and_subject

  validates :user_id, :subject, :content, presence: true
  validates :content, length: { in: 1..1000 }
  validates :subject, length: { in: 1..100 }

  after_create :send_mail

  private

  def strip_html_from_content_and_subject
    self.subject = strip_tags(subject)
    self.content = strip_tags(content)
  end

  def send_mail
    to = user.email
    AdminMailer.send_mail(to, "Classifilter: #{subject}", content).deliver
  end
end
