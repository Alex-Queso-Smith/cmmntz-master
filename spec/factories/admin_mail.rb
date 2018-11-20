FactoryBot.define do
  factory :admin_mail do
    customer_user_id {'259c974b-8aba-4069-ac21-e12a6fb93f61'}
    association :user, factory: :user
    subject {"this is a test"}
    content {"here is some content"}
  end
end
