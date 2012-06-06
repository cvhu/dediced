class AddUpDownCount < ActiveRecord::Migration  
  def up
    add_column :authorities, :up, :integer
    add_column :authorities, :down, :integer
    add_column :interests, :up, :integer
    add_column :interests, :down, :integer
  end

  def down
  end
end
