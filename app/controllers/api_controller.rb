class ApiController < ApplicationController
  skip_before_action :require_user
  protect_from_forgery unless: -> { request.format.json? }

end
