class AddExpiresAtToGalleryBlacklistings < ActiveRecord::Migration[5.2]
  def change
    add_column :gallery_blacklistings, :expires_at, :datetime

    add_index :gallery_blacklistings, :expires_at
  end
end
