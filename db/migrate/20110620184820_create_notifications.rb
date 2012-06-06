class CreateNotifications < ActiveRecord::Migration
  def self.up
    create_table :notifications do |t|
      t.integer :user_id
      t.string :url
      t.string :description

      t.timestamps
    end
  end

  def self.down
    drop_table :notifications
  end
end
