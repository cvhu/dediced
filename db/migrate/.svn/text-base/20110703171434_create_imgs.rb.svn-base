class CreateImgs < ActiveRecord::Migration
  def self.up
    create_table :imgs do |t|
      t.string :uri
      t.integer :x
      t.integer :y
      t.integer :w
      t.integer :h

      t.timestamps
    end
  end

  def self.down
    drop_table :imgs
  end
end
