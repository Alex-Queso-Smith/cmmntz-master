class AddPublishedDateToArt < ActiveRecord::Migration[5.2]
  def change
    add_column :arts, :published_at, :datetime
  end
end
