class AddGalleryArtistIdToArt < ActiveRecord::Migration[5.2]
  def change
    add_column :arts, :gallery_artist_id, :uuid
    add_index :arts, :gallery_artist_id
  end
end
