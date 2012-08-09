class AddImageToYums < ActiveRecord::Migration
  def self.up
    add_column :yums, :image, :string
  end

  def self.down
    remove_column :yums, :image
  end
end
