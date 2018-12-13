class GalleryBlacklisting < ApplicationRecord
  belongs_to :user
  belongs_to :gallery

  before_validation :set_expires_at_if_blank

  def ban_expires_at
    if expires_at > Date.today + 200.years
      "Never"
    else
      expires_at
    end
  end

  private

  def set_expires_at_if_blank
    return unless expires_at.blank?
    self.expires_at = Date.today + 2000.years
  end
end
