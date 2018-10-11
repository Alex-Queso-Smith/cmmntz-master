FactoryBot.define do
  factory :user do
    sequence(:user_name) { |u| "user#{u}" }
    password { "password" }
    password_confirmation { "password" }
  end
end
