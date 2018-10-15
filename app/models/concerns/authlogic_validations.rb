module AuthlogicValidations
  extend ActiveSupport::Concern
  included do
    validates :email,
    format: {
      with: ::Authlogic::Regex::EMAIL,
      message: proc {
        ::Authlogic::I18n.t(
          "error_messages.email_invalid",
          default: "should look like an email address."
        )
      }
    },
    length: { maximum: 100 },
    uniqueness: {
      case_sensitive: false,
      if: :email_changed?
      }

    validates :password,
      confirmation: { if: :require_password? },
      length: {
        in: 6..32,
        if: :require_password?
      }
    validates :password_confirmation,
      length: {
        in: 6..32,
        if: :require_password?
    }
  end
end
