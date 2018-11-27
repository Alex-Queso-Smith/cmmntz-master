FactoryBot.define do
  factory :gallery do
    sequence(:name) { |u| "Gallery #{u}" }
  end
end
