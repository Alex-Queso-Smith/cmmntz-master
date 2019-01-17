class AddYtUrlToArticle < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :youtube_url, :string
  end
end
