FactoryBot.define do
  factory :user do
    sequence(:user_name) { |u| "user#{u}" }
    sequence(:email) { |u| "user#{u}@test.com" }
    password { "Abc123456" }
    password_confirmation { "Abc123456" }

    factory :user_with_comments do
      transient do
        comments_count { 5 }
      end

      after(:create) do |user, evaluator|
        create_list(:comment, evaluator.comments_count, user: user)
      end
    end
  end
end
