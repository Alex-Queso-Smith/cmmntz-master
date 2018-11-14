class CreateEmailLogs < ActiveRecord::Migration[5.2]
  def change
    create_table :email_logs, id: :uuid do |t|
      t.uuid :user_id
      t.string :email_name

      t.datetime :created_at

      t.index [:user_id, :email_name, :created_at]
    end
  end
end
