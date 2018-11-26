class CreateFaeArticles < ActiveRecord::Migration[5.2]
  def up
    drop_table :articles
    create_table :articles, id: :uuid do |t|
      t.string :title
      t.string :slug
      t.text :introduction
      t.text :body
      t.date :publish_date
      t.uuid :article_category_id
      t.uuid :author_id

      t.timestamps

      t.index :author_id
      t.index :article_category_id
      t.index :publish_date
      t.index :slug
    end
  end
  def down
    drop_table :articles
    create_table "articles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
      t.string "title"
      t.text "text"
      t.string "author_name"
      t.uuid "author_id"

      t.timestamps

      t.index :author_id
    end
  end
end
