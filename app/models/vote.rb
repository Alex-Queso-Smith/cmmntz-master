class Vote < ApplicationRecord
  TYPES = %w(top like really_like dislike really_dislike)

  belongs_to :user
  belongs_to :comment

  validates :vote_type, presence: true, inclusion: { in: TYPES }
end
