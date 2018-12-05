class GalleryBlacklisting < ApplicationRecord
  belongs_to :user
  belongs_to :gallery
end
