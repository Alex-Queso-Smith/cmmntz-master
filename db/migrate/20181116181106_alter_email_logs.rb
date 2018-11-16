
class AlterEmailLogs < ActiveRecord::Migration[5.2]
  def up
    rename_table :email_logs, :check_logs
    add_column :check_logs, :checkable_type, :string
    rename_column :check_logs, :user_id, :checkable_id
    rename_column :check_logs, :email_name, :check_name
    add_index :check_logs, [:checkable_id, :checkable_type]
  end

  def down
    remove_index :check_logs, [:checkable_id, :checkable_type]
    rename_column :check_logs, :check_name, :email_name
    rename_column :check_logs, :checkable_id, :user_id
    remove_column :check_logs, :checkable_type
    rename_table :check_logs, :email_logs
  end
end
