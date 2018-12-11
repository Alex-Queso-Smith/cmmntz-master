class ChangeAnonColComments < ActiveRecord::Migration[5.2]
  def up
    cs = Comment.where(anonymous: nil)
    if cs.present?
      cs.update_all(anonymous: false)
    end
    change_column_null :comments, :anonymous, false
    change_column_default :comments, :anonymous, false
  end

  def down
    change_column_null :comments, :anonymous, true
    change_column_default :comments, :anonymous, nil
  end
end
