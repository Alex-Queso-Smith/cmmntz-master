module CommentsHelper
  def comment_user_user_name(comment)
    comment.anonymous? ? "" : comment.user.user_name
  end

  def comment_user_gender(comment)
    comment.anonymous? ? "" : comment.user.gender_display
  end

  def comment_user_age_range(comment)
    comment.anonymous? ? "" : comment.user.age_range_display
  end
end
