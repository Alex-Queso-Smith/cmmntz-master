FactoryBot.define do
  factory :comment do
    association :user, factory: :user
    association :art, factory: :art
    text { "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac finibus dolor. Mauris ut tempor metus. Sed scelerisque velit erat. Morbi dolor leo, tristique at vestibulum ac, sodales nec lacus. Cras eu varius ex, quis cursus urna." }

    factory :comment_with_votes do
      transient do
        votes_count { 30 }
      end

      after(:create) do |comment, evaluator|
        create_list(:vote, evaluator.votes_count, comment: comment)
      end
    end

    factory :comment_with_replies do
      transient do
        replies_count { 3 }
      end
      after(:create) do |comment, evaluator|
        create_list(:comment, evaluator.replies_count, parent: comment)
      end
    end
  end
end
