FactoryBot.define do
  factory :blocking do
    association :blocker, factory: :user
    association :blocking, factory: :user
  end
end
