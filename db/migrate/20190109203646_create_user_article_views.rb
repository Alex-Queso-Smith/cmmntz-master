class CreateUserArticleViews < ActiveRecord::Migration[5.2]
  def change
    create_table :user_article_views, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :article_id
      t.index [:user_id, :article_id], unique: true
      t.index :user_id

      t.datetime :created_at
    end
  end
end
