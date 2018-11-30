class Art < ApplicationRecord
  belongs_to :gallery
  delegate :checker_settings, :default_art_thread_expiration_days, to: :gallery

  has_many :art_topics
  has_many :topics, through: :art_topics

  scope :for_url, -> (url) {
    where(url: url)
  }

  scope :with_activity_since, -> (datetime) {
    where(arel_table[:last_interaction_at].gteq(datetime))
  }

  def moderator
    gallery.super_admin
  end

  def is_disabled?
    disabled? ? true : thread_expired? ? true : false
  end

  def thread_expired?
    return false unless default_art_thread_expiration_days.is_a? Integer
    Time.now > (published_at + default_art_thread_expiration_days.days)
  end

  def comment_requires_approval?
    gallery.comment_approval_needed
  end

  def topics_list=(list)
    art_topics.destroy_all if art_topics
    list.split(",").each { |t| topics << Topic.find_or_create_by(name: t.strip) }
  end

  def topics_list
    topics.map(&:name).join(", ")
  end
end
