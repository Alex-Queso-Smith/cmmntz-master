class Customer < ApplicationRecord
  scope :account_for_gallery_and_user, -> (gallery_id, user_id) { where(gallery_id: gallery_id, user_account_id: user_id) }
end
