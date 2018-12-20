class AddGuestToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :guest, :boolean, null: false, default: false 
    add_index :comments, :guest
  end
end
