class UserGalleryModerator < ApplicationRecord
  belongs_to :user
  belongs_to :gallery

  scope :for_gallery, -> (gal_id) {
    where(gallery_id: gal_id)
  }
end
