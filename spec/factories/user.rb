FactoryBot.define do
  factory :user do
    sequence(:user_name) { |u| "user#{u}" }
    sequence(:email) { |u| "user#{u}@test.com" }
    password { "Abc123456" }
    password_confirmation { "Abc123456" }
  end
end
