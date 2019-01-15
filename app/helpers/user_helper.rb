module UserHelper

  def user_font user
    user.font.blank? ? "serif" : user.font
  end

  def user_theme user
    user.color_theme.blank? ? "light" : user.color_theme
  end
  
end
