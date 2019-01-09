class AddIpToUserFeedbacks < ActiveRecord::Migration[5.2]
  def change
    add_column :user_feedbacks, :ip, :string
  end
end
