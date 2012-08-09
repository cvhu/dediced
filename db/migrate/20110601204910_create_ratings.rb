class CreateRatings < ActiveRecord::Migration
  def self.up
    create_table :ratings do |t|
      t.integer :user_id
      t.integer :yum_id
      t.decimal :value, :precision => 8, :scale => 2

      t.timestamps
    end
  end

  def self.down
    drop_table :ratings
  end
end
