class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users, id: :uuid do |t|
      t.string :user_name, null: false
      t.string :crypted_password
      t.string :password_salt
      t.string :persistence_token
      t.integer :age_range, limit: 1
      t.float :latitude
      t.float :longitude
      t.point :location
      t.string :avatar
      t.integer :gender, limit: 1

      t.timestamps

      t.index :user_name, unique: true
      t.index :age_range
      t.index :gender
      t.index [:latitude, :longitude]
    end
  end
end
