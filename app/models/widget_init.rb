class WidgetInit < Tableless
  # expected_attrs
  attribute :gallery_id, :string
  attribute :url, :string
  attribute :article_topics, :string
  attribute :article_publish_date, :string
  attribute :article_artist_name, :string
  attribute :article_type, :string
  attribute :email, :string

  # returned attrs
  attribute :art_id, :string

  validates :gallery_id, :url, presence: true

  validate :gallery_exists_and_is_authorized?

  after_validation :get_art_id


  private

  def get_art_id
    art = Art.find_or_create_for_url(url, gallery_id, article_topics, article_publish_date, article_artist_name, article_type)
    self.art_id = art.id
  end

  def gallery_exists_and_is_authorized?
    if gallery_id.blank?
      errors.add(:base) << "gallery_not_provided"
      return false
    end
    ga = Gallery.find gallery_id
    errors.add(:base) << "gallery_does_not_exist" unless ga.present?
  end
end
