class AddYumToken < ActiveRecord::Migration
  def self.up
    add_column :yums, :token, :string
  end

  def self.down
  end
end
