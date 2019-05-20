class CreateGalleryBlacklistings < ActiveRecord::Migration[5.2]
  def change
    create_table :gallery_blacklistings, id: :uuid do |t|
      t.uuid :gallery_id
      t.uuid :user_id

      t.timestamps

      t.index :gallery_id
      t.index [:gallery_id, :user_id]
    end
  end
end
