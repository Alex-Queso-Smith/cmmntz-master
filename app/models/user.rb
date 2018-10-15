class User < ApplicationRecord
  GENDERS = [nil, 0, 1, 2]
  AGES = [nil, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

  validates :user_name, presence: true, uniqueness: true
  validates :gender, numericality: true, inclusion: { in: GENDERS }, unless: Proc.new { |u| u.gender.nil? }
  validates :age_range, numericality: true, inclusion: { in: AGES }, unless: Proc.new { |u| u.age_range.nil? }
  validates :latitude, presence: true, if: Proc.new { |u| !u.longitude.nil? }
  validates :longitude, presence: true, if: Proc.new { |u| !u.latitude.nil? }

  validates :latitude, numericality: { greater_than_or_equal_to: -180.00, less_than_or_equal_to: 180.00 }, if: Proc.new { |u| !u.longitude.nil? }
  validates :longitude, numericality: { greater_than_or_equal_to: -180.00, less_than_or_equal_to: 180.00 }, if: Proc.new { |u| !u.latitude.nil? }

  validates_with EmailAddress::ActiveRecordValidator, field: :email
  validates :email, uniqueness: true

  acts_as_authentic do |c|
    c.login_field = :user_name
  end


  ### re gender
  # display gender
  def gender_display
    case gender
    when 0
      "male"
    when 1
      "other"
    when 2
      "female"
    else
      ""
    end
  end

  ### re age_range
  # display age_range
  def age_range_display
    return "" if age_range.nil?

    "#{age_range}-#{age_range + 4}"
  end
end
# t.string "user_name", null: false
# t.string "crypted_password"
# t.string "password_salt"
# t.string "persistence_token"
# t.integer "age_range", limit: 2
# t.point "location"
# t.string "avatar"
# t.integer "gender", limit: 2
# t.datetime "created_at", null: false
# t.datetime "updated_at", null: false
