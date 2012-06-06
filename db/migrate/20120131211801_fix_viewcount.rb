class FixViewcount < ActiveRecord::Migration
  def self.up
    drop_table :viewcount
    add_column :viewcounts, :user_id, :integer
    add_column :viewcounts, :yum_id, :integer
  end

  def self.down
  end
end
