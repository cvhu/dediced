class AddImgCss < ActiveRecord::Migration
  def self.up
    add_column :imgs, :css, :string
  end

  def self.down
    remove_column :imgs, :css
  end
end
