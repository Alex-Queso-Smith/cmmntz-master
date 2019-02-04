class AddSubscribeNewsletterToCustomer < ActiveRecord::Migration[5.2]
  def change
    add_column :customers, :subscribe_newsletter, :boolean, default: false, null: false
    add_index :customers, :subscribe_newsletter
  end
end
