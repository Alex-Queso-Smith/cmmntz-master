class UpdateCommentVoteTabulationsToVersion2 < ActiveRecord::Migration[5.2]
  def change
    update_view :comment_vote_tabulations, version: 2, revert_to_version: 1
  end
end
