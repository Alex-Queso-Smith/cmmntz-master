class ChangeIdColsOnFaeAbles < ActiveRecord::Migration[5.2]
  def up
    remove_column :fae_files, :fileable_id
    add_column :fae_files, :fileable_id, :uuid

    remove_column :fae_images, :imageable_id
    add_column :fae_images, :imageable_id, :uuid
  end

  def down
    remove_column :fae_images, :imageable_id
    add_column :fae_images, :imageable_id, :integer

    remove_column :fae_files, :fileable_id
    add_column :fae_files, :fileable_id, :integer
  end
end
