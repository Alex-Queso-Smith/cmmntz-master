class AddFieldsToUserFeedbacks < ActiveRecord::Migration[5.2]
  def change
    add_column :user_feedbacks, :email, :string
    add_column :user_feedbacks, :first_name, :string
    add_column :user_feedbacks, :last_name, :string
  end
end
