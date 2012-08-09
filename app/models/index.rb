class Index < ActiveRecord::Base
  belongs_to :yum
  belongs_to :keyword
  
  # Section = {
  #   1:title
  #   2:review
  #   3:page content
  #   4:area
  # }
  
end