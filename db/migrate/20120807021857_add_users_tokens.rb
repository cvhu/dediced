class AddUsersTokens < ActiveRecord::Migration
  def up
    add_column :users, :fb_access_token, :string
    add_column :users, :signup_token, :string
    add_column :users, :login_salt, :string
  end

  def down
  end
end
