class Topic < ApplicationRecord
  has_many :art_topics
  has_many :arts, through: :art_topics
end
