class TagYum < ActiveRecord::Base
  attr_accessible :yum_id, :tag_id
  belongs_to :yum
  belongs_to :tag
end

