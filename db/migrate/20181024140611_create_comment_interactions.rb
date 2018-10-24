class CreateCommentInteractions < ActiveRecord::Migration[5.2]
  def change
    create_table :comment_interactions, id: :uuid do |t|
      t.string :comment_id
      t.string :user_id

      t.timestamps

      t.index [:user_id, :comment_id]
    end

    add_column :comments, :interactions_count, :integer, default: 0
    add_index :comments, :interactions_count
  end
end
