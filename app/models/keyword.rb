class Keyword < ActiveRecord::Base
  has_many :indexes, :dependent => :destroy
  
  def self.search(search)
    where('value LIKE ?', "%#{search}%")
  end
  
end
