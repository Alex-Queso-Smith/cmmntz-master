module CommentsHelper
  def comment_user_user_name(comment)
    comment.render_anonymously? ? "Anonymous" : comment.user.user_name
  end

  def comment_user_gender(comment)
    comment.render_anonymously? ? "" : comment.user.gender_display
  end

  def comment_user_age_range(comment)
    comment.render_anonymously? ? "" : comment.user.age_range_display
  end

  def comment_user_base_image(comment)
    comment.render_anonymously? ? "" : comment.user.base_image
  end

  def comment_user_show_censored(comment)
    comment.render_anonymously? ? true : comment.user.show_censored_comments
  end
end
