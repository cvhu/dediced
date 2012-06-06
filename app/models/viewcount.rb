class Viewcount < ActiveRecord::Base
  belongs_to :yum
  belongs_to :user
  
end
