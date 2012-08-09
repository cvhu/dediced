class AddViewedNotification < ActiveRecord::Migration
  def self.up
    add_column :notifications, :viewed, :boolean, :default => false
  end

  def self.down
  end
end
