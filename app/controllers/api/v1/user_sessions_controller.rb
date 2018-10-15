class Api::V1::UserSessionsController < ApplicationController
  skip_before_action *ALL_FILTERS, only: [:new, :create]
  before_action :require_no_user, only: [:new, :create]

  def new
    redirect_to(root_path) and return if current_user
    @user_session = UserSession.new
  end

  def create
    @user_session = UserSession.new(user_session_params)
    if @user_session.save
      render status: :ok, json: @user_session
    else
      render json: @user_session.errors, status: :unprocessable_entity
    end
  end

  def destroy
    current_user_session.destroy
    render status: :ok
  end

  private

  def user_session_params
    params.require(:user_session).permit(:user_name, :password)
  end
end
