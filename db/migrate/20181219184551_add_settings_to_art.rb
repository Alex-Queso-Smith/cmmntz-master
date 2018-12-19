class AddSettingsToArt < ActiveRecord::Migration[5.2]
  def change
    add_column :arts, :settings, :text
  end
end
