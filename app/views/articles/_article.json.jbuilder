json.extract! article, :id, :title, :text, :author_name, :author_id, :created_at, :updated_at
json.url article_url(article, format: :json)
