FactoryBot.define do
  factory :vote do
    association :user, factory: :user, user_name: "NewUser"
    association :comment, factory: :comment, text: "Hahahahah ahahah"
    vote_type { "top" }
  end
end
