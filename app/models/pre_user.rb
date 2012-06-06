class PreUser < ActiveRecord::Base
  geocoded_by :address
  after_validation :geocode, :if => :address_changed?
  
  validates :email, :presence => true, :uniqueness => true
  
  # validate :pre_user_is_not_registered
  
  scope :with_address, where("address IS NOT NULL")

  # 
  # private
  # 
  # def pre_user_is_not_registered
  #   if User.find_by_email(self.email)
  #     errors.add :email, 'is already registered' 
  #   end
  # end
end
