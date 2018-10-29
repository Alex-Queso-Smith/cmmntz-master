class User < ApplicationRecord
  include AuthlogicValidations

  GENDERS = [0, 1, 2]
  DISPLAY_GENDERS = ["male", "other", "female"]
  AGES = [nil, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]\

  has_many :comments
  has_many :votes
  has_many :comment_interactions
  has_many :comment_vote_tabulation, primary_key: 'id'

  validates :user_name, presence: true, uniqueness: true

  validates :gender, numericality: true, inclusion: { in: GENDERS }, unless: Proc.new { |u| u.gender.nil? }
  validates :age_range, numericality: true, inclusion: { in: AGES }, unless: Proc.new { |u| u.age_range.nil? }

  validates :latitude, presence: true, if: Proc.new { |u| !u.longitude.nil? }
  validates :longitude, presence: true, if: Proc.new { |u| !u.latitude.nil? }
  validates :latitude, numericality: { greater_than_or_equal_to: -180.00, less_than_or_equal_to: 180.00 }, if: Proc.new { |u| !u.longitude.nil? }
  validates :longitude, numericality: { greater_than_or_equal_to: -180.00, less_than_or_equal_to: 180.00 }, if: Proc.new { |u| !u.latitude.nil? }

  acts_as_authentic do |c|
    c.login_field = :user_name
    c.validate_email_field = false
    c.validate_login_field = false
    c.validate_password_field = false
  end


  ### re gender
  # display gender
  def gender_display
    return "" if gender.nil?
    DISPLAY_GENDERS[gender.to_i]
  end

  ### re age_range
  # display age_range
  def age_range_display
    return "" if age_range.nil?

    "#{age_range}-#{age_range + 4}"
  end
end
