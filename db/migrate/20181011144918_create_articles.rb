class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles, id: :uuid do |t|
      t.string :title
      t.text :text
      t.string :author_name
      t.string :author_id

      t.timestamps
    end
  end
end
