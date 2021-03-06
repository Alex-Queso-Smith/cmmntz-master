source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.1'


# required to allow external access to features (widget)
gem 'rack-cors', require: 'rack/cors'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.1'
# Use postgreSQL as the database for Active Record
gem 'pg'
# Use Puma as the app server
gem 'puma', '~> 3.11'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'webpacker', '~> 3.3'
gem 'sprockets-rails'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# add haml
gem 'haml'

# CRUD authorization via cancancan
gem 'cancancan'

# use useragent to detect information about the logged int user's devive
gem 'useragent'

# new relic APM Tracking
# gem 'newrelic_rpm'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

gem 'authlogic', '~> 4.4.2'
gem 'bootstrap', '~> 4.1.3'
gem 'jquery-rails'
gem 'react-rails'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'pry-rails'
  gem 'rspec-rails'
  gem 'database_cleaner'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'guard'
  gem 'guard-rspec'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  # Easy installation and use of chromedriver to run system tests with Chrome
  gem 'chromedriver-helper'
  gem 'factory_bot'
  gem 'factory_bot_rails'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# allow for mass import data, saves in inserts for optimal loads
gem 'activerecord-import'

# add pagination
gem 'will_paginate'
gem 'scenic'

# background queue handling
gem 'sidekiq'

# foreman to load all processes from a single procfile
gem 'foreman'

# storage hookup
gem 'carrierwave'
gem "azure-storage"
gem 'fog-azure-rm'

###### for newspaper mock
gem 'fae-rails'
gem 'will_paginate-bootstrap4'
gem 'redcarpet'
