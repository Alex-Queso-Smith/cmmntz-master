FactoryBot.define do
  factory :comment_interaction do
    association :user, factory: :user
    association :comment, factory: :comment
  end
end
