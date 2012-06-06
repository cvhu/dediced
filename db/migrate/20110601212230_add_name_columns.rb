class AddNameColumns < ActiveRecord::Migration
  def self.up
    add_column :users, :name, :string
    add_column :yums, :name, :string
  end

  def self.down
    remove_column :users, :name
    remove_column :yums, :name
  end
end
