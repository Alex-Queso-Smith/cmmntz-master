FactoryBot.define do
  factory :art do
    url {"www.url.com/1233"}
    association :gallery, factory: :gallery
  end
end
