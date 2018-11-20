class CreateBlockings < ActiveRecord::Migration[5.2]
  def change
    create_table :blockings, id: :uuid do |t|
      t.uuid :blocker_id
      t.uuid :blocking_id

      t.timestamps

      t.index :blocker_id
      t.index :blocking_id
    end
  end
end
