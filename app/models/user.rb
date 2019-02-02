class User < ApplicationRecord
  include AuthlogicValidations

  # avatar settings v-attrs
  vstr 'avatar', {
    base_image: :string,
    fg_color: :string,
    bg_color: :string
  }

  # general settings v-attrs
  vstr 'settings', {
    color_theme: :string,
    font: :string,
    comments_from: :string,
    filter_list: :array,
    not_filter_list: :array,
    sort_dir: :string,
    sort_type: :string,
    votes_from: :string,
    censor: :string,
    show_censored_comments: :bool,
    hide_anon_and_guest: :bool,
    settings_updated: :bool,
    age_range_search: :string,
    gender_search: :string
  }

  GENDERS = [0, 1, 2]
  DISPLAY_GENDERS = ["female", "other", "male"]
  AGES = [nil, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]

  has_many :comments
  has_many :votes
  has_many :comment_interactions
  has_many :comment_vote_tabulation, primary_key: 'id'

  # define  users that the user is following
  has_many :followings, foreign_key: "follower_id"
  has_many :followed_users, through: :followings, source: :following

  # define users that are following the users
  has_many :followers, class_name: 'Following', foreign_key: "following_id"
  has_many :follower_users, through: :followers, source: :follower

  # define  users that the user is blocking
  has_many :blockings, foreign_key: "blocker_id"
  has_many :blocked_users, through: :blockings, source: :blocking

  # define users that are blocking the users
  has_many :blockers, class_name: 'Blocking', foreign_key: "blocking_id"
  has_many :blocker_users, through: :blockers, source: :blocker

  # define galleries where the user has moderator status
  has_many :user_gallery_moderators

  # galleries where the user can not post
  has_many :gallery_blacklistings

  validates :user_name, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: 33 }

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

  scope :registered_gteq, -> (datetime) {
    where("users.created_at >= ?", datetime)
  }

  scope :where_check_does_not_exist, -> (datetime, check_name) {
    where( CheckLog.where("check_logs.checkable_id = users.id AND check_logs.checkable_type = 'user' AND check_logs.created_at >= ? AND check_logs.check_name = ?", datetime, check_name).exists.not )
  }

  def self.create_guest_account
    u = new
    u.save(validate: false)
    return u
  end

  def guest?
    user_name.blank? && email.blank?
  end

  ### Some Bool checks
  def post_eligible?
    min_interactions = 0
    comment_interactions.limit(min_interactions).size >= min_interactions
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

  def network
    ((followed_users + followed_users_of_followed_users) - blocked_users).uniq
  end

  def network_user_ids
    network.map(&:id)
  end

  def followed_users_of_followed_users
    followed_users.includes(:followed_users).map(&:followed_users).flatten
  end

  def quality_comment_settings
    {
      "top":        0.40,
      "love":       0.40,
      "like_a_lot": 0.40,
      "like":       0.40
    }
  end

  def self.ready_for_quality_thread_check(letter, last_check, check_name)
    scope = where(arel_table[:user_name].matches("#{letter}%"))
    scope = scope.where_check_does_not_exist(last_check, check_name)
    scope
  end

  def moderator_for?(gallery_id)
    customer_for?(gallery_id) || user_gallery_moderator_for?(gallery_id)
  end

  def customer_for?(gallery_id)
    Customer.account_for_gallery_and_user(gallery_id, id).size > 0
  end

  def user_gallery_moderator_for?(gallery_id)
    user_gallery_moderators.for_gallery(gallery_id).size > 0
  end

  def user_blacklisted_for?(gallery_id)
    gallery_blacklistings.not_expired.where(gallery_id: gallery_id).size > 0
  end
end
