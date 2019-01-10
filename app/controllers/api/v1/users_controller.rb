class Api::V1::UsersController < ApiController
  load_and_authorize_resource
  skip_before_action *ALL_FILTERS, only: [:create]
  before_action :require_no_user, only: [:create]
  # GET /users.json
  def show
    # load gallery for search settings determination
    @gallery = Gallery.find params[:gallery_id] if params[:gallery_id]
  end

  # POST /users.json
  def create
    attrs = current_user.attributes.merge(user_params)
    current_user.attributes = attrs
    @user = current_user

    if @user.save
      render json: { message: "Created successfully", user_id: @user.id }
    else
      render json: { errors: @user.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /users/1.json
  def update
    if @user.update(user_params)
      render json: { message: "Updated successfully" }
    else
      render json: { errors: @user.errors, status: :unprocessable_entity}
    end
  end

  # DELETE /users/1.json
  def destroy
    guest = User.create_guest_account
    guest.reset_persistence_token!
    @current_user_session = UserSession.create(guest)
    @current_user = @current_user_session && @current_user_session.user

    output_log_stream("activity.user.logout", cookies['cf-super-betatester-email'])
    render json: { message: "Destroy successfull", user_id: @current_user.id } if @user.destroy
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(
        :user_name,
        :password,
        :password_confirmation,
        :gender,
        :age_range,
        :latitude,
        :longitude,
        :email,
        :font,
        :color_theme,
        :base_image,
        :comments_from,
        :votes_from,
        :filter_list,
        :not_filter_list,
        :sort_dir,
        :sort_type,
        :votes_from,
        :censor,
        :show_censored_comments,
        :settings_updated,
        :hide_anon_and_guest
      )
    end
end
