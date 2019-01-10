class UserArticleView < ApplicationRecord
  belongs_to :user
  belongs_to :article

  def self.create_for_user_and_article(user_id, article_id)
    find_or_create_by(user_id: user_id, article_id: article_id)
  end

end
