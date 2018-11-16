class Art < ApplicationRecord
  scope :for_url, -> (url) {
    where(url: url)
  }

  scope :with_activity_since, -> (datetime) {
    where(arel_table[:last_interaction_at].gteq(datetime))
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
end
