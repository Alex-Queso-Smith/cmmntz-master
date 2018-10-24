module ApplicationHelper
  def display_date date_time, time = true
    date_time.strftime(time ? "%Y-%m-%d %H:%M" : "%Y-%m-%d")
  end
end
