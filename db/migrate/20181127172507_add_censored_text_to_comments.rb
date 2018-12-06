class AddCensoredTextToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :censored_text, :text
  end
end
