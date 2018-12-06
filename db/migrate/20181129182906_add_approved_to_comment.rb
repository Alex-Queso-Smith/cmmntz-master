class AddApprovedToComment < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :approved, :boolean, null: false, default: false

    add_index :comments, :approved
  end
end
