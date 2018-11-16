class CheckLog < ApplicationRecord
  belongs_to :checkable, polymorphic: true

  validates :check_name, presence: true

  scope :for_user_check_on_or_after, -> (checkable, check_name, datetime) {
    where(checkable: checkable, check_name: check_name).where("created_at >= ?", datetime)
  }

  def self.add_log(checkable, check_name)
    create!(checkable: checkable, check_name: check_name)
  end

end
