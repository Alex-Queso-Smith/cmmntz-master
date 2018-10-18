class CreateVotes < ActiveRecord::Migration[5.2]
  def change
    create_table :votes, id: :uuid do |t|
      t.string :user_id
      t.string :comment_id
      t.string :vote_type

      t.timestamps

      t.index :user_id
      t.index :comment_id
    end
  end
end
