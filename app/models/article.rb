class Article < ApplicationRecord
  include Fae::BaseModelConcern

  belongs_to :article_category
  belongs_to :author
  has_fae_file :banner

  before_validation :generate_slug!, on: :create

  validates :title, :publish_date, :body, :introduction, presence: true
  validates :slug, Fae.validation_helpers.slug

  def fae_display_field
    title
  end

  def url(request = {})
    if Rails.env.production?
      base_url = "classifilter-master.herokuapp.com"
    elsif request.blank?
      base_url = "localhost:3000"
    else
      base_url = "#{request.base_url.gsub("http://", "")}"
    end
    "#{base_url}/#{self.class.to_s.pluralize.downcase}/#{slug}"
  end

  private

  def generate_slug!
    return unless publish_date && title
    self.slug = "#{publish_date.strftime("%Y-%m-%d")}-#{title.downcase.gsub(/[^0-9A-Za-z\s]/, '').gsub(" ", "-")}"
  end
end
