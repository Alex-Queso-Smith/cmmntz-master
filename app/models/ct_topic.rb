class CtTopic < ApplicationRecord
  has_many :article_topics
  has_many :articles, through: :article_topics
end
