class CreateComments < ActiveRecord::Migration[5.2]
  def change
    create_table :comments, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :art_id
      t.string :art_type
      t.text :text
      t.boolean :anonymous

      t.timestamps

      t.index :user_id
      t.index [:art_id, :art_type]
    end
  end
end
