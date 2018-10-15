json.extract! comment, :id, :user_id, :art_id, :art_type, :title, :text, :anonymous, :created_at, :updated_at
json.url comment_url(comment, format: :json)
