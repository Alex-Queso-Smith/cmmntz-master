FactoryBot.define do
  factory :user do
    sequence(:user_name) { |u| "user#{u}" }
    sequence(:email) { |u| "user#{u}@test.com" }
    password { "password" }
    password_confirmation { "password" }
  end
end
