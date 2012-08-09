class AddLocationToUserPreUserYum < ActiveRecord::Migration
  def self.up
    rename_column :pre_users, :zipcode, :address
    add_column :pre_users, :latitude, :float
    add_column :pre_users, :longitude, :float
    add_column :users, :address, :string
    add_column :users, :latitude, :float
    add_column :users, :longitude, :float
    add_column :yums, :address, :string
    add_column :yums, :latitude, :float
    add_column :yums, :longitude, :float
  end

  def self.down
  end
end
