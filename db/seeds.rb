# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

jesse = User.create(
  user_name: "Jesse",
  email: "J@gmail.com",
  password: "password",
  password_confirmation: "password"
)

matt = User.create(
  user_name: "Matt",
  email: "M@gmail.com",
  password: "password",
  password_confirmation: "password"
)

alex = User.create(
  user_name: "Alex",
  email: "A@gmail.com",
  password: "password",
  password_confirmation: "password"
)

aj = User.create(
  user_name: "AJ",
  email: "AJ@gmail.com",
  password: "password",
  password_confirmation: "password"
)

article_one = Article.create(
  title: "Demo Article",
  text: "Lorem ipsum dolor sit amet, ius dicat sanctus saperet ei. Disputando instructior mediocritatem an vim. Dictas nusquam fastidii ius ea, ne duo ocurreret adipiscing constituam, vis at modus summo. Est ne perfecto appellantur ullamcorper, liber saepe noluisse mei an. Commune vivendum usu et. No sit dico tota.",
)

x = 1

users = []

while x <= 100 do
  users << User.new(
    user_name: "User#{x}",
    password: "password",
    password_confirmation: "password",
    email: "User#{x}@gmail.com",
    age_range: User::AGES.sample,
    gender: User::GENDERS.sample
  )
  x += 1
end
User.import users, validate: false

users = User.all

time = Time.now
anonymous = [false, true]

500.times do
  comment = Comment.create(
    user: users.sample,
    art_id: article_one.id,
    art_type: "article",
    text: "Lorem ipsum dolor sit amet,
    ius dicat sanctus saperet ei. Disputando
    instructior mediocritatem an vim.
    Dictas nusquam fastidii ius ea, ne duo ocurreret adipiscing constituam,
    vis at modus summo. Est ne perfecto appellantur ullamcorper,
    liber saepe noluisse mei an. Commune vivendum usu et. No sit dico tota.",
    created_at: time,
    anonymous: anonymous.sample
  )

  rand(20).times do
    # seed some Votes
    u = (users - [comment.user]).sample
    Vote.create(
      user: u,
      comment: comment,
      vote_type: Vote::EXCLUSIVE_VOTES.sample
    )
    rand(3).times do
      Vote.create(
        user: u,
        comment: comment,
        vote_type: (Vote::TYPES - Vote::EXCLUSIVE_VOTES).sample
      )
    end
  end
  time += 1.minute
end
