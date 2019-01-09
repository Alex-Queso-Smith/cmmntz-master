class CreateUserVideoClicks < ActiveRecord::Migration[5.2]
  def change
    create_table :user_video_clicks, id: :uuid do |t|
      t.uuid :user_id
      t.index :user_id

      t.string :video_title
      t.index :video_title

      t.index [:user_id, :video_title], unique: true

      t.datetime :created_at
      t.index :created_at
    end
  end
end
