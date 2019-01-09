class AddMoreInfoToUserFeedbacks < ActiveRecord::Migration[5.2]
  def change
    add_column :user_feedbacks, :browser, :string
    add_column :user_feedbacks, :browser_version, :string
    add_column :user_feedbacks, :platform, :string
    add_column :user_feedbacks, :os, :string
  end
end
