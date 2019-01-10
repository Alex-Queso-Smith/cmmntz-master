class AppAccess < Tableless
  attribute :password, :string
  attribute :email, :string

  validates :password, :email, presence: true
  validate :password_is_correct?, unless: Proc.new { |a| a.password.blank? }

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
  length: { maximum: 100 }

  private

  def password_is_correct?
    errors.add(:base) << "That is not the password!" unless password === app_passcode
  end

  def app_passcode
    if ENV['APPLICATION_PASSCODE']
      ENV['APPLICATION_PASSCODE']
    else
      "betatester"
    end
  end
end
