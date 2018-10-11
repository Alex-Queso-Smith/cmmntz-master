# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_10_11_180532) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "articles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.text "text"
    t.string "author_name"
    t.string "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "user_name", null: false
    t.string "crypted_password"
    t.string "password_salt"
    t.string "persistence_token"
    t.integer "age_range", limit: 2
    t.float "latitude"
    t.float "longitude"
    t.string "avatar"
    t.integer "gender", limit: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.index ["age_range"], name: "index_users_on_age_range"
    t.index ["gender"], name: "index_users_on_gender"
    t.index ["latitude", "longitude"], name: "index_users_on_latitude_and_longitude"
    t.index ["user_name"], name: "index_users_on_user_name", unique: true
  end

end
