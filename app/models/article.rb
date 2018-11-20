class Article < ApplicationRecord
  def url(request = {})
    if Rails.env.production?
      base_url = "classifilter-master.herokuapp.com"
    elsif request.blank?
      base_url = "localhost:3000"
    else
      base_url = "#{request.base_url.gsub("http://", "")}"
    end
    "#{base_url}/#{self.class.to_s.pluralize.downcase}/#{id}"
  end
end
