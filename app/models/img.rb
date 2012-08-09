class Img < ActiveRecord::Base
  has_many :yums
  has_many :users
  
  attr_accessible :uri, :x, :y, :w, :h, :src, :remote_src_url
  # mount_uploader :src, SrcUploader
  
  
  after_initialize :init
  
  def init
    if self.uri.nil?
      self.uri = "/images/default.png"
    end
    if self.x.nil?
      self.x = 12
    end
    if self.y.nil?
      self.y = 17
    end
    if self.w.nil?
      self.w = 127
    end
    if self.h.nil?
      self.h = 127
    end
    # self.css ||= "width:127px;height:126px;margin-left:-12px;margin-top:-17px"
  end
  
  def css(px)
    r = px/100.0
    width = (self.w*r).to_i
    height = (self.h*r).to_i
    top = -(self.y*r).to_i
    left = -(self.x*r).to_i
    return "width:#{width}px;height:#{height}px;margin-top:#{top}px;margin-left:#{left}px;"
  end
  
end
