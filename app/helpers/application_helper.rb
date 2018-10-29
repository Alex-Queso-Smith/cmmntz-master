module ApplicationHelper
  def display_date date_time, time = true
    return "" if date_time.blank?
    date_time.strftime(time ? "%Y-%m-%d %H:%M" : "%Y-%m-%d")
  end

  def last_edit_date(object)
    return "" unless object.respond_to?(:updated_at) && object.respond_to?(:created_at)
    object.created_at != object.updated_at ? object.updated_at : ""
  end

end
