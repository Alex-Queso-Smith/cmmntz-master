module CommentBase
  extend ActiveSupport::Concern

  def render_anonymously?
    anonymous? || user.nil?
  end

end
