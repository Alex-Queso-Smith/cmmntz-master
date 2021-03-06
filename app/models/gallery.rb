class Gallery < ApplicationRecord
  has_many :arts
  has_many :customers
  has_many :gallery_blacklistings
  has_many :blacklisted_users, through: :gallery_blacklistings, source: :user


  def super_admin
    customers.where(role: "super_admin").order(created_at: :desc).first
  end

  vstr 'settings', {
    comments_from: :string,
    filter_list: :array,
    not_filter_list: :array,
    sort_dir: :string,
    sort_type: :string,
    votes_from: :string,
    censor: :bool,
    default_art_thread_expiration_days: :integer,
    comment_approval_needed: :bool,
    guest_approval_needed: :bool,
    notify_on_comment_approval_needed: :bool,
    hide_anon_and_guest: :bool,
    notify_on_new_comment: :bool,
    gender_search: :string,
    age_range_search: :string
  }

  def checker_settings
    {
      comments_amount: 1,
      votes: {
        warn: 1,
        dislike: 1,
        dislike_a_lot: 1
      }
    }
  end

  def admin_user_account_ids
    customers.map(&:user_account_id).reject{|id| id.blank? }
  end
end
