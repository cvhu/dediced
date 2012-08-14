class AddUsersConfirmed < ActiveRecord::Migration
  def up
    add_column :users, :confirmed, :integer
  end

  def down
  end
end
