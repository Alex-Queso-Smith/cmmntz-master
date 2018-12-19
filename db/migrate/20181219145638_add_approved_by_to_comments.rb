class AddApprovedByToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :approved_by, :string

    Comment.update_all approved_by: "auto"
  end
end
