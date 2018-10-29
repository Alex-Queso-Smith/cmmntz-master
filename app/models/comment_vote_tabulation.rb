class CommentVoteTabulation < ApplicationRecord
  self.primary_key = "id"
  include CommentSearchs

  belongs_to :user
  has_many :votes, foreign_key: "comment_id"
  has_many :comment_interactions, foreign_key: "comment_id"

  belongs_to :parent, class_name: 'Comment', foreign_key: :parent_id, primary_key: :comment_id, optional: true
  has_many :replies, class_name: 'Comment', foreign_key: :parent_id
end
