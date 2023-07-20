json.extract! post, :id, :title, :category_id, :body, :user_id, :created_at, :updated_at
json.url post_url(post, format: :json)
