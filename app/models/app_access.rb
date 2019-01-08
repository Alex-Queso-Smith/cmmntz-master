class AppAccess < Tableless
  attribute :password, :string

  validates :password, presence: true
  validate :password_is_correct?, unless: Proc.new { |a| a.password.blank? }

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
