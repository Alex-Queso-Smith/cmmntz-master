class CreateAdminMails < ActiveRecord::Migration[5.2]
  def change
    create_table :admin_mails, id: :uuid do |t|
      t.uuid :customer_user_id
      t.uuid :user_id
      t.string :subject
      t.text :content

      t.timestamps

      t.index :customer_user_id
      t.index :user_id
    end
  end
end
