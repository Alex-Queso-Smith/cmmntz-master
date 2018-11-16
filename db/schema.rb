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

ActiveRecord::Schema.define(version: 2018_11_16_155230) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "admin_mails", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "customer_user_id"
    t.uuid "user_id"
    t.string "subject"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_user_id"], name: "index_admin_mails_on_customer_user_id"
    t.index ["user_id"], name: "index_admin_mails_on_user_id"
  end

  create_table "articles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.text "text"
    t.string "author_name"
    t.uuid "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "arts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "url"
    t.datetime "last_interaction_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["last_interaction_at"], name: "index_arts_on_last_interaction_at"
    t.index ["url"], name: "index_arts_on_url"
  end

  create_table "blockings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blocker_id"
    t.uuid "blocking_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blocker_id"], name: "index_blockings_on_blocker_id"
    t.index ["blocking_id"], name: "index_blockings_on_blocking_id"
  end

  create_table "comment_interactions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "comment_id"
    t.uuid "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "comment_id"], name: "index_comment_interactions_on_user_id_and_comment_id"
  end

  create_table "comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "art_id"
    t.string "art_type"
    t.text "text"
    t.boolean "anonymous"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "interactions_count", default: 0
    t.uuid "parent_id"
    t.index ["art_id", "art_type"], name: "index_comments_on_art_id_and_art_type"
    t.index ["interactions_count"], name: "index_comments_on_interactions_count"
    t.index ["parent_id"], name: "index_comments_on_parent_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "email_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.string "email_name"
    t.datetime "created_at"
    t.index ["user_id", "email_name", "created_at"], name: "index_email_logs_on_user_id_and_email_name_and_created_at"
  end

  create_table "followings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "follower_id"
    t.uuid "following_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["follower_id"], name: "index_followings_on_follower_id"
    t.index ["following_id"], name: "index_followings_on_following_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "user_name", null: false
    t.string "crypted_password"
    t.string "password_salt"
    t.string "persistence_token"
    t.integer "age_range", limit: 2
    t.float "latitude"
    t.float "longitude"
    t.text "avatar"
    t.integer "gender", limit: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.text "settings"
    t.index ["age_range"], name: "index_users_on_age_range"
    t.index ["gender"], name: "index_users_on_gender"
    t.index ["latitude", "longitude"], name: "index_users_on_latitude_and_longitude"
    t.index ["user_name"], name: "index_users_on_user_name", unique: true
  end

  create_table "votes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "comment_id"
    t.string "vote_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_votes_on_comment_id"
    t.index ["user_id"], name: "index_votes_on_user_id"
  end


  create_view "comment_vote_tabulations",  sql_definition: <<-SQL
      SELECT comments.id,
      comments.user_id,
      comments.art_id,
      comments.art_type,
      comments.text,
      comments.anonymous,
      comments.created_at,
      comments.updated_at,
      comments.interactions_count,
      comments.parent_id,
      char_length(comments.text) AS comment_length,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'top'::text) THEN 1
              ELSE 0
          END) AS top_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'love'::text) THEN 1
              ELSE 0
          END) AS love_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'like_a_lot'::text) THEN 1
              ELSE 0
          END) AS like_a_lot_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'like'::text) THEN 1
              ELSE 0
          END) AS like_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'indifferent'::text) THEN 1
              ELSE 0
          END) AS indifferent_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'dislike'::text) THEN 1
              ELSE 0
          END) AS dislike_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'dislike_a_lot'::text) THEN 1
              ELSE 0
          END) AS dislike_a_lot_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'trash'::text) THEN 1
              ELSE 0
          END) AS trash_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'warn'::text) THEN 1
              ELSE 0
          END) AS warn_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'smart'::text) THEN 1
              ELSE 0
          END) AS smart_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'funny'::text) THEN 1
              ELSE 0
          END) AS funny_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'happy'::text) THEN 1
              ELSE 0
          END) AS happy_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'shocked'::text) THEN 1
              ELSE 0
          END) AS shocked_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'sad'::text) THEN 1
              ELSE 0
          END) AS sad_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'boring'::text) THEN 1
              ELSE 0
          END) AS boring_count,
      sum(
          CASE
              WHEN ((votes.vote_type)::text = 'angry'::text) THEN 1
              ELSE 0
          END) AS angry_count,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'top'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS top_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'love'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS love_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'like_a_lot'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS like_a_lot_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'like'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS like_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'indifferent'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS indifferent_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'dislike'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS dislike_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'dislike_a_lot'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS dislike_a_lot_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'trash'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS trash_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'warn'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS warn_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'smart'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS smart_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'funny'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS funny_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'happy'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS happy_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'shocked'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS shocked_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'sad'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS sad_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'boring'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS boring_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'angry'::text) THEN 1
                  ELSE 0
              END))::numeric / (comments.interactions_count)::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS angry_percent,
      (
          CASE
              WHEN (comments.interactions_count > 0) THEN (((((((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'like_a_lot'::text) THEN 1
                  ELSE 0
              END))::numeric * (2)::numeric) + ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'like'::text) THEN 1
                  ELSE 0
              END))::numeric * (1)::numeric)) + ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'indifferent'::text) THEN 1
                  ELSE 0
              END))::numeric * (0)::numeric)) - ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'dislike'::text) THEN 1
                  ELSE 0
              END))::numeric * 0.5)) - ((sum(
              CASE
                  WHEN ((votes.vote_type)::text = 'dislike_a_lot'::text) THEN 1
                  ELSE 0
              END))::numeric * (1)::numeric)) / ((2 * comments.interactions_count))::numeric)
              ELSE (0)::numeric
          END)::numeric(5,4) AS like_score
     FROM (comments
       LEFT JOIN votes ON ((votes.comment_id = comments.id)))
    WHERE (comments.parent_id IS NULL)
    GROUP BY comments.id;
  SQL

end
