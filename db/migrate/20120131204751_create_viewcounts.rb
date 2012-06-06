class CreateViewcounts < ActiveRecord::Migration
  def self.up
    create_table :viewcounts do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :viewcounts
  end
end
