module CommentBase
  extend ActiveSupport::Concern
  BAD_WORDS = ["fuck", "wombat", "happen"]
  MIN_FLAG_COUNT = 3
  MIN_FLAG_PERCENT = '.20'

  def render_anonymously?
    anonymous? || user.nil? || user.guest?
  end

  private

  def auto_flag_moderator_activate!
    # do not proceed if a mod has already allowed this comment
    return if approved_by == "mod"
    flagged_votes = flag_votes.size
    # do not proceed unless the comment has more than MIN_FLAG_COUNT
    return unless flagged_votes >= MIN_FLAG_COUNT
    # do not proceed unless the comment's flagged_percent is >= MIN_FLAG_PERCENT
    return unless (flagged_votes.to_f / comment_interactions.size.to_f) >= MIN_FLAG_PERCENT
    # if it has reached this point, force the comment into moderation
    self.update_columns(approved: false, approved_by: nil)
  end

end
