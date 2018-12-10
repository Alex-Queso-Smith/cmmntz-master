class AddArtTypeToArts < ActiveRecord::Migration[5.2]
  def change
    add_column :arts, :art_type, :string
  end
end
