class AddEditedAtToComment < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :edited_at, :datetime
  end
end
