class AddDisabledMessageToArt < ActiveRecord::Migration[5.2]
  def change
    add_column :arts, :disabled_message, :text
  end
end
