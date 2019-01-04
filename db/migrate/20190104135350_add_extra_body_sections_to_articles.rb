class AddExtraBodySectionsToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :body_2, :text
    add_column :articles, :body_3, :text
  end
end
