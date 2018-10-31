module CommentsHelper
  def comment_user_user_name(comment)
    comment.render_anonymously? ? "" : comment.user.user_name
  end

  def comment_user_gender(comment)
    comment.render_anonymously? ? "" : comment.user.gender_display
  end

  def comment_user_age_range(comment)
    comment.render_anonymously? ? "" : comment.user.age_range_display
  end
end
