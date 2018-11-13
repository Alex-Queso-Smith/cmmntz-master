class Api::V1::AdminMailsController < ApiController
  load_and_authorize_resource

  # POST /api/v1/admin_mails.json
  def create
    @admin_mail = AdminMail.new(admin_mail_params)
    if @admin_mail.save
      render json: { message: "Admin Mail Sent" }
    else
      render json: { errors: @admin_mail.errors.full_messages, status: :unprocessable_entity }
    end
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_mail_params
      params.require(:admin_mail).permit(:user_id, :subject, :content)
    end
end
