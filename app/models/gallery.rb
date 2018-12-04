class Gallery < ApplicationRecord
  has_many :arts
  has_many :customers

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
    notify_on_comment_approval_needed: :bool,
    notify_on_new_comment: :bool
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
