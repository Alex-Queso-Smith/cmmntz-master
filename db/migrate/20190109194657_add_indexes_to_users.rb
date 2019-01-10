class AddIndexesToUsers < ActiveRecord::Migration[5.2]
  def change
    add_index :users, :created_at
    add_index :users, :login_count
    add_index :users, :last_request_at
    add_index :users, :last_login_at
  end
end
