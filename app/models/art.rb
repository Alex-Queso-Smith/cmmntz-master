class Art < ApplicationRecord
  belongs_to :gallery
  delegate :checker_settings, to: :gallery

  scope :for_url, -> (url) {
    where(url: url)
  }

  scope :with_activity_since, -> (datetime) {
    where(arel_table[:last_interaction_at].gteq(datetime))
  }
end
