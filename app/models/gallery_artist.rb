class GalleryArtist < ApplicationRecord
  belongs_to :gallery
  belongs_to :customer, optional: true

  validates :artist_name, presence: true

  ### accessor methods

  def self.find_or_create_for_artist_name(name, gal_id)
    where(artist_name: name).first_or_create do |ga|
      ga.gallery_id = gal_id
    end
  end
end
