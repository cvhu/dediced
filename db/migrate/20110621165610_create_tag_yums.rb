class CreateTagYums < ActiveRecord::Migration
  def self.up
    create_table :tag_yums do |t|
      t.integer :tag_id
      t.integer :yum_id

      t.timestamps
    end
  end

  def self.down
    drop_table :tag_yums
  end
end
