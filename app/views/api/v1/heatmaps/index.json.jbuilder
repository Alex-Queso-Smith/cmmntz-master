json.geo_data @users do |user|
  json.lat user.latitude
  json.long user.longitude
end
