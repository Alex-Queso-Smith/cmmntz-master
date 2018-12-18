class AddIgnoreFlaggedToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :ignore_flagged, :boolean, null: false, default: false
    add_index :comments, :ignore_flagged
  end
end
