class CreateViewcount < ActiveRecord::Migration
  def self.up
    create_table :viewcount do |t|
      t.integer :user_id
      t.integer :yum_id      
      t.timestamps
    end
    
  end

  def self.down
  end
end
