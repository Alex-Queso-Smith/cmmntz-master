class CreateFollowings < ActiveRecord::Migration[5.2]
  def change
    create_table :followings, id: :uuid do |t|
      t.uuid :follower_id
      t.uuid :following_id

      t.timestamps

      t.index :follower_id
      t.index :following_id
    end
  end
end
