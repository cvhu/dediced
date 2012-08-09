class CreateCommentRatings < ActiveRecord::Migration
  def self.up
    create_table :comment_ratings do |t|
      t.integer :comment_id
      t.integer :user_id
      t.integer :value

      t.timestamps
    end
  end

  def self.down
    drop_table :comment_ratings
  end
end
