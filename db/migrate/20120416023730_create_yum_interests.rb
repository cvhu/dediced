class CreateYumInterests < ActiveRecord::Migration
  def change
    create_table :yum_interests do |t|
      t.integer :user_id
      t.integer :yum_id
      t.float :score

      t.timestamps
    end
  end
end
