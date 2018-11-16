class Art < ApplicationRecord
  scope :for_url, -> (url) {
    where(url: url)
  }
end
