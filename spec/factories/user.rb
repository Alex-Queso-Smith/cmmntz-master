FactoryBot.define do
  factory :user do
    sequence(:user_name) { |u| "user#{u}" }
    sequence(:email) { |u| "user#{u}@test.com" }
    password { "Abc123456" }
    password_confirmation { "Abc123456" }

    trait :gender_female do
      gender { 2 }
    end

    trait :age_range_20 do
      age_range { 20 }
    end

    factory :user_with_comments do
      transient do
        comments_count { 5 }
      end

      after(:create) do |user, evaluator|
        create_list(:comment, evaluator.comments_count, user: user)
      end
    end

    factory :user_with_comments_with_votes do
      transient do
        comments_count { 5 }
        votes_count { 15 }
      end

      after(:create) do |user, evaluator|
        create_list(:comment_with_votes, evaluator.comments_count, user: user, votes_count: evaluator.votes_count )
      end
    end
  end
end
