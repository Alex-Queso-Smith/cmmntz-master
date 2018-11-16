class CreateArts < ActiveRecord::Migration[5.2]
  def change
    create_table :arts, id: :uuid do |t|
      t.string :url
      t.datetime :last_interaction_at

      t.timestamps

      t.index :url
      t.index :last_interaction_at
    end
  end
end
