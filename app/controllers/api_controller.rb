class ApiController < ApplicationController
  protect_from_forgery unless: -> { request.format.json? }

  # before_filter :create_guest_unless_logged_in ## for the future!

end
