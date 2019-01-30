class AddGalleryIdToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :gallery_id, :uuid
    add_index :comments, :gallery_id

    Comment.all.each do |c|
      c.gallery_id = c.art.gallery_id
      c.save
    end
  end
end
