class CreateYums < ActiveRecord::Migration
  def self.up
    create_table :yums do |t|
      t.integer :user_id
      t.string :review
      t.decimal :value, :precision => 8, :scale => 2

      t.timestamps
    end
  end

  def self.down
    drop_table :yums
  end
end
