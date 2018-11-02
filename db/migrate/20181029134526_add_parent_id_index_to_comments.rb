class AddParentIdIndexToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :parent_id, :uuid
    add_index :comments, :parent_id
  end
end
