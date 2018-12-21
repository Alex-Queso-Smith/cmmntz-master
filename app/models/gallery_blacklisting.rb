class GalleryBlacklisting < ApplicationRecord
  attr_accessor :dur
  belongs_to :user
  belongs_to :gallery

  before_validation :set_expires_at

  def ban_expires_at
    if expires_at > Date.today + 200.years
      "Never"
    else
      expires_at
    end
  end

  private

  def set_expires_at
    return unless expires_at.blank?
    self.expires_at = Date.today + (dur.blank? ? 2000.years : 1.send(dur))
  end
end
