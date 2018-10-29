class CommentVoteTabulation < ApplicationRecord
  self.primary_key = "id"
  include CommentSearchs

  belongs_to :user
  has_many :votes, foreign_key: "comment_id"
  has_many :comment_interactions, foreign_key: "comment_id"
end
