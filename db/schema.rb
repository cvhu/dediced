# encoding: UTF-8
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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120814023004) do

  create_table "authorities", :force => true do |t|
    t.integer  "user_id"
    t.integer  "tag_id"
    t.float    "score"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "up"
    t.integer  "down"
  end

  create_table "comment_ratings", :force => true do |t|
    t.integer  "comment_id"
    t.integer  "user_id"
    t.integer  "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", :force => true do |t|
    t.integer  "user_id"
    t.integer  "yum_id"
    t.string   "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "imgs", :force => true do |t|
    t.string   "uri"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "src"
    t.integer  "x"
    t.integer  "y"
    t.integer  "w"
    t.integer  "h"
  end

  create_table "indices", :force => true do |t|
    t.integer  "keyword_id"
    t.integer  "yum_id"
    t.integer  "position"
    t.integer  "section"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "interests", :force => true do |t|
    t.integer  "user_id"
    t.integer  "tag_id"
    t.float    "score"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "up"
    t.integer  "down"
  end

  create_table "keywords", :force => true do |t|
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "mobile_tokens", :force => true do |t|
    t.integer  "user_id"
    t.string   "token"
    t.string   "device_name"
    t.datetime "expire_on"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "notifications", :force => true do |t|
    t.integer  "user_id"
    t.string   "url"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "viewed",      :default => false
  end

  create_table "pre_users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "address"
    t.string   "token"
    t.float    "latitude"
    t.float    "longitude"
  end

  create_table "ratings", :force => true do |t|
    t.integer  "user_id"
    t.integer  "yum_id"
    t.decimal  "value",      :precision => 8, :scale => 2
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tag_yums", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "yum_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "password_hash"
    t.string   "password_salt"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.integer  "img_id"
    t.string   "address"
    t.float    "latitude"
    t.float    "longitude"
    t.string   "token"
    t.string   "fb_access_token"
    t.string   "signup_token"
    t.string   "login_salt"
    t.string   "first_name"
    t.string   "last_name"
    t.integer  "confirmed"
  end

  create_table "viewcounts", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "yum_id"
  end

  create_table "yum_interests", :force => true do |t|
    t.integer  "user_id"
    t.integer  "yum_id"
    t.float    "score"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "yums", :force => true do |t|
    t.integer  "user_id"
    t.string   "review"
    t.decimal  "value"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "url"
    t.integer  "img_id"
    t.string   "address"
    t.float    "latitude"
    t.float    "longitude"
    t.string   "token"
  end

end
