class ArticleTopic < ApplicationRecord
  belongs_to :article
  belongs_to :ct_topic
end
