class Article < ApplicationRecord
  include Fae::BaseModelConcern

  belongs_to :article_category
  belongs_to :author
  has_fae_file :banner

  validates :title, :publish_date, :body, :introduction, presence: true
  validates :slug, Fae.validation_helpers.slug

  def to_param
    slug
  end

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
    "#{base_url}/#{self.class.to_s.pluralize.downcase}/#{id}"
  end
end
