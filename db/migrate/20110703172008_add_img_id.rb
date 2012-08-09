class AddImgId < ActiveRecord::Migration
  def self.up
    add_column :yums, :img_id, :integer
  end

  def self.down
    remove_column :yums, :img_id
  end
end
