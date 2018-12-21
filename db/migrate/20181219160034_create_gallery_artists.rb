class CreateGalleryArtists < ActiveRecord::Migration[5.2]
  def change
    create_table :gallery_artists, id: :uuid do |t|
      t.string :artist_name
      t.index :artist_name
      t.uuid :gallery_id
      t.index :gallery_id
      t.uuid :customer_id
      t.index :customer_id

      t.timestamps
    end
  end
end
