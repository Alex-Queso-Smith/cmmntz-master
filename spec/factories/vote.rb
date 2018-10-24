FactoryBot.define do
  factory :vote do
    association :user, factory: :user
    association :comment, factory: :comment, text: "Hahahahah ahahah"
    vote_type { "top" }
  end
end
