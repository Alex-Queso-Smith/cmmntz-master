class EmailLog < ApplicationRecord
  belongs_to :user

  validates :email_name, presence: true

  scope :for_user_email_on_or_after, -> (user_id, email_name, datetime) {
    where(user_id: user_id, email_name: email_name).where("created_at >= ?", datetime)
  }

  def self.add_log(user, email_name)
    create!(user: user, email_name: email_name)
  end

end
