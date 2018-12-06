require_relative 'boot'

require 'rails/all'
# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ClassifilterMaster
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid
    end
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # use sidekiq as background processor
    config.active_job.queue_adapter = :sidekiq

    # use the default queue for mailers (for now)
    config.action_mailer.deliver_later_queue_name = 'default'

    # add image sub dirs to pipline
    Dir.glob("#{Rails.root}/app/assets/images/**/*").each do |path|
      config.assets.paths << path
    end
  end

end
