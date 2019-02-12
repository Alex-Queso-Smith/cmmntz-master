class Art < ApplicationRecord
  attr_accessor :artist_name

  vstr 'settings', {
    ignore_warning_checker: :bool
  }


  belongs_to :gallery
  delegate :checker_settings, :default_art_thread_expiration_days, to: :gallery

  has_many :art_topics
  has_many :topics, through: :art_topics

  has_many :comments
  has_many :pending_comments, -> { where(approved: false, deleted: false) }, class_name: "Comment", foreign_key: "art_id"
  has_many :deleted_comments, -> { where(deleted: true) }, class_name: "Comment", foreign_key: "art_id"
  has_many :approved_comments, -> { where(approved: true, deleted: false) }, class_name: "Comment", foreign_key: "art_id"

  has_many :art_interactions

  after_create_commit :find_or_create_artist_record!

  scope :for_url, -> (url) {
    where(url: url)
  }

  scope :with_activity_since, -> (datetime) {
    where(arel_table[:last_interaction_at].gteq(datetime))
  }

  ### accessor methods
  def self.find_or_create_for_url(url, gallery_id, article_topics, article_publish_date, article_artist_name, type)
    url = url.gsub('http://', "").gsub("https://", "")
    a = where(url: url).first_or_create do |art|
      art.gallery = Gallery.find(gallery_id)
      art.topics_list = article_topics
      art.published_at = article_publish_date
      art.art_type = type
      art.artist_name = article_artist_name
    end
    return a
  end

  def self.find_by_topic(topic)
    joins(:topics).where(topics: {name: topic})
  end

  ### General methods

  def grand_total_comments(user)
    scope = approved_comments.not_replies.for_non_blocked_users
    scope = scope.eliminate_blocked(scope, user)
    scope
  end

  def gallery_admin_user_account_ids
    gallery.admin_user_account_ids
  end

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
    !gallery.comment_approval_needed.blank? && gallery.comment_approval_needed == true
  end

  def comment_requires_guest_approval?(comment)
    !gallery.guest_approval_needed.blank? && gallery.guest_approval_needed == true && comment.user.guest?
  end

  def moderators_request_notification?(comment)
    return true if (gallery.notify_on_comment_approval_needed && !comment.approved?)
    return true if gallery.notify_on_new_comment
    false
  end

  def topics_list=(list)
    art_topics.destroy_all if art_topics
    list.split(",").each { |t| topics << Topic.find_or_create_by(name: t.strip) }
  end

  def topics_list
    topics.map(&:name).join(", ")
  end

  private

  ### Postprocessors

  def find_or_create_artist_record!
    ga = GalleryArtist.find_or_create_for_artist_name(artist_name, gallery_id)
    self.update_columns(gallery_artist_id: ga.id)
  end
end
