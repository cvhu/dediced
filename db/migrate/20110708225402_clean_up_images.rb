class CleanUpImages < ActiveRecord::Migration
  def self.up
    remove_column :imgs, :x
    remove_column :imgs, :y
    remove_column :imgs, :w
    remove_column :imgs, :h
    remove_column :users, :image
    remove_column :yums, :image
    add_column :users, :img_id, :integer
    add_column :imgs, :src, :string
  end

  def self.down
  end
end
