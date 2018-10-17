class Api::V1::UsersController < ApiController
  load_and_authorize_resource
  skip_before_action *ALL_FILTERS, only: [:new, :create]
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :require_no_user, only: [:new, :create]

  # GET /users
  # GET /users.json
  def index
    users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
    #render json: @user
  end

  # GET /users/new
  def new
    user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    if @user.save
      render json: { message: "Created successfully" }
    else
      render json: { errors: @user.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    if @user.update(user_params)
      render json: { message: "Updated successfully" }
    else
      render json: { errors: @user.errors, status: :unprocessable_entity}
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    render json: { message: "Destroy successfull" } if user.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:user_name, :password, :password_confirmation, :gender, :age_range, :latitude, :longitude, :email)
    end
end
