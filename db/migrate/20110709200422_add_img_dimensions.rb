class AddImgDimensions < ActiveRecord::Migration
  def self.up
    add_column :imgs, :x, :integer
    add_column :imgs, :y, :integer
    add_column :imgs, :w, :integer
    add_column :imgs, :h, :integer
    remove_column :imgs, :css
  end

  def self.down
  end
end
