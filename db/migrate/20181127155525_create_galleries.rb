class CreateGalleries < ActiveRecord::Migration[5.2]
  def change
    create_table :galleries, id: :uuid do |t|
      t.string :name
      t.text :settings

      t.timestamps
    end

    add_column :arts, :gallery_id, :uuid
    add_index :arts, :gallery_id
  end
end
