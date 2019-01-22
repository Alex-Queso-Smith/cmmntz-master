module CommentsHelper
  def comment_user_user_name(comment)
    comment.render_anonymously? ? "Anonymous" : (comment.guest? || comment.user.nil?) ? "Guest" : comment.user.user_name
  end

  def comment_user_gender(comment)
    comment.render_anonymously? ? "" : (comment.guest? || comment.user.nil?) ? "" : comment.user.gender_display
  end

  def comment_user_age_range(comment)
    comment.render_anonymously? ? "" : (comment.guest? || comment.user.nil?) ? "" : comment.user.age_range_display
  end

  def comment_user_base_image(comment)
    comment.render_anonymously? ? "" : (comment.guest? || comment.user.nil?) ? "" : comment.user.base_image
  end

  def comment_user_show_censored(comment)
    comment.render_anonymously? ? true : (comment.guest? || comment.user.nil?) ? true : comment.user.show_censored_comments
  end

  def comment_user_longitude(comment)
    comment.render_anonymously? ? "" : (comment.guest? || comment.user.nil?) ? "" : comment.user.longitude
  end

  def comment_user_latitude(comment)
    comment.render_anonymously? ? "" : (comment.guest? || comment.user.nil?) ? "" : comment.user.latitude
  end

end
