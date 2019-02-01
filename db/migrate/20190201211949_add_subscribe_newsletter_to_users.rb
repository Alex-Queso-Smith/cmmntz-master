class AddSubscribeNewsletterToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :subscribe_newsletter, :boolean, default: false, null: false
    add_index :users, :subscribe_newsletter
  end
end
