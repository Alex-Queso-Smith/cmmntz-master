FactoryBot.define do
  factory :comment do
    association :user, factory: :user, user_name: "Writely"
    art_id {"ffff67f6f6f6-6f6f6f6f6f6-6f6f6f6f6f6-9f9f9"}
    art_type {"article"}
    title { "this is a title" }
    text { "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac finibus dolor. Mauris ut tempor metus. Sed scelerisque velit erat. Morbi dolor leo, tristique at vestibulum ac, sodales nec lacus. Cras eu varius ex, quis cursus urna." }
  end
end
