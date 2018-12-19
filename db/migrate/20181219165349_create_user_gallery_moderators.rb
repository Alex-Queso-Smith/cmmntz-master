class CreateUserGalleryModerators < ActiveRecord::Migration[5.2]
  def change
    create_table :user_gallery_moderators, id: :uuid do |t|
      t.uuid :user_id
      t.index :user_id
      t.uuid :gallery_id
      t.index :gallery_id

      t.timestamps
    end
  end
end
