class CreateIndices < ActiveRecord::Migration
  def change
    create_table :indices do |t|
      t.integer :keyword_id
      t.integer :yum_id
      t.integer :position
      t.integer :section

      t.timestamps
    end
  end
end
