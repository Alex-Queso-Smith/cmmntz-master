class AdminMail < ApplicationRecord
  belongs_to :user

  validates :user_id, :subject, :content, presence: true

  after_create :send_mail

  private

  def send_mail
    to = user.email
    AdminMailer.send_mail(to, "Classifilter: #{subject}", content).deliver
  end
end
