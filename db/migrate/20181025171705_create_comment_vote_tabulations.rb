class CreateCommentVoteTabulations < ActiveRecord::Migration[5.2]
  def change
    create_view :comment_vote_tabulations
  end
end
