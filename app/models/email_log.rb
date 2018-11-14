class EmailLog < ApplicationRecord
  belongs_to :user

  validate :email_name, presence: true
  
  scope :for_user_email_on_or_after, -> (user_id, email_name, datetime) {
    where(user_id: user_id, email_name: email_name).where("created_at >= ?", datetime)
  }

end
