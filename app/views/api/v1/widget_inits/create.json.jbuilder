json.widget_init  do
  json.authorized true
  json.packUrl widget_js_url
  json.cssUrl widget_css_url
  json.artId @widget_init.art_id
  json.userId current_user.id
  json.userFont "cf-serif"
  json.userTheme "cf-light"
end
