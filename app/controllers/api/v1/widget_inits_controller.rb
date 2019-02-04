class Api::V1::WidgetInitsController < ApiController
  skip_before_action :require_user, only: [:create] 
  def create
    @widget_init = WidgetInit.new(widget_init_params)

    if !@widget_init.valid?

      raise "#{@widget_init.errors.full_messages}"
      render json: { errors: @widget_init.errors, status: :unprocessable_entity }
    end
  end

  private

  def widget_init_params
    params.require(:widget_init).permit(
      :gallery_id,
      :url,
      :article_topics,
      :article_publish_date,
      :article_artist_name,
      :article_type,
      :email
    )
  end
end
