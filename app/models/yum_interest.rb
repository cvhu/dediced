class YumInterest < ActiveRecord::Base
  belongs_to :user
  belongs_to :yum
end
