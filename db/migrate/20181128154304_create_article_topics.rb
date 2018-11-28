class CreateArticleTopics < ActiveRecord::Migration[5.2]
  def change
    create_table :article_topics, id: :uuid do |t|
      t.uuid :article_id
      t.uuid :ct_topic_id
      t.index [:article_id, :ct_topic_id]

      t.timestamps
    end
  end
end
