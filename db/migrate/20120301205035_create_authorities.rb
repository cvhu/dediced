class CreateAuthorities < ActiveRecord::Migration
  def self.up
    create_table :authorities do |t|
      t.integer :user_id
      t.integer :tag_id
      t.float :score

      t.timestamps
    end
  end

  def self.down
    drop_table :authorities
  end
end
