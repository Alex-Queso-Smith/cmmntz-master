class CreateArtInteractions < ActiveRecord::Migration[5.2]
  def change
    create_table :art_interactions, id: :uuid do |t|
      t.uuid :art_id
      t.uuid :user_id

      t.index [:art_id, :user_id]
      t.datetime :created_at
      t.index :created_at
    end
    add_column :arts, :art_interactions_count, :integer, default: 0
    add_index :arts, :art_interactions_count
  end
end
