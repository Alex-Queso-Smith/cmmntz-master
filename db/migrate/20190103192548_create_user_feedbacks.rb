class CreateUserFeedbacks < ActiveRecord::Migration[5.2]
  def change
    create_table :user_feedbacks, id: :uuid do |t|
      t.uuid :user_id
      t.index :user_id
      t.string :type
      t.string :category
      t.text :text

      t.timestamps
    end
  end
end
