# set the number of rando-users we want in this pass
num_users = 100

# set the number of articles we want in this pass
<<<<<<< HEAD
num_articles = 7
=======
num_articles = 2
>>>>>>> master
time_start = Process.clock_gettime(Process::CLOCK_MONOTONIC)

puts "Starting process at #{Time.now}"

# generate staff accounts
puts "generating staff accounts"
User.create(
  user_name: "Jesse",
  email: "jesse@classibridge.com",
  password: "password",
  password_confirmation: "password",
  base_image: "butterfly",
  longitude: -75,
  latitude: 40
)

Fae::User.create(
  email: "jesse@classibridge.com",
  password: "password",
  password_confirmation: "password",
  first_name: "Jesse",
  last_name: "Admin",
  role_id: 1,
  active: true
)

User.create(
  user_name: "Alex",
  email: "alex@classibridge.com",
  password: "password",
  password_confirmation: "password",
  base_image: "gi",
  longitude: -75,
  latitude: 40
)

Fae::User.create(
  email: "alex@classibridge.com",
  password: "password",
  password_confirmation: "password",
  first_name: "Alex",
  last_name: "Admin",
  role_id: 1,
  active: true
)

User.create(
  user_name: "AJ",
  email: "aj@classibridge.com",
  password: "password",
  password_confirmation: "password",
  base_image: "boxing-glove",
  longitude: -75,
  latitude: 40
)

User.create(
  user_name: "Renee",
  email: "renee@classibridge.com",
  password: "password",
  password_confirmation: "password",
  base_image: AVATARS.sample,
  longitude: -75,
  latitude: 40
)

User.create(
  user_name: "Jackie",
  email: "jackie@classibridge.com",
  password: "password",
  password_confirmation: "password",
  base_image: AVATARS.sample,
  longitude: -75,
  latitude: 40
)

User.create(
  user_name: "Dustin",
  email: "dustin@classibridge.com",
  password: "password",
  password_confirmation: "password",
  base_image: AVATARS.sample,
  longitude: -75,
  latitude: 40
)

User.create(
  user_name: "Anthony",
  email: "anthony@classibridge.com",
  password: "password",
  password_confirmation: "password",
  base_image: AVATARS.sample,
  longitude: -75,
  latitude: 40
)

User.create(
  user_name: "Mandie",
  email: "mandie@classibridge.com",
  password: "password",
  password_confirmation: "password",
  base_image: AVATARS.sample,
  longitude: -75,
  latitude: 40
)

# generate random users
puts "generating #{num_users} users"
x = 1
users = []
while x <= num_users do
  users << User.new(
    user_name: "User#{x}",
    password: "password",
    password_confirmation: "password",
    email: "User#{x}@gmail.com",
    age_range: User::AGES.sample,
    gender: User::GENDERS.sample,
    base_image: AVATARS.sample,
    longitude: (-75 + rand(-18..18)),
    latitude: (40 + rand(-18..18))
  )
  x += 1
end
User.import users, validate: false
users = User.all

# generate some followings for the users
puts "generating followings for users"
users.each do |user|
  rand(0..15).times do
    user.followings.create(following: (users - [user]).sample)
  end
end

# generate some blockings for the users
puts "generating blockings for users"
users.each do |user|
  rand(-5..3).times do
    user.blockings.create(blocking: (users - [user]).sample)
  end
end

["Alber Einstein", "Douglas Adams", "Lore", "Newt Scamander"].each do |a|
  Author.create(name: a)
end
authors = Author.all

["Cars", "Politics", "Weather", "Sports", "Science and Nature"].each do |c|
  ArticleCategory.create(name: c)
end

article_categories = ArticleCategory.all

gallery = Gallery.create(name: "Classibridge Times")

# generate desired number of articles
puts "generating #{num_articles} articles"
iter = 1
num_articles.times do
  puts "article #{iter}"
  time = Time.now - rand(150000..10000000)
  article_one = Article.create(
    title: "Demo Article #{iter}",
    slug: "demo-article-#{iter}",
    introduction: "This is demo article #{iter}. Read more to find out all about it!",
    author: authors.sample,
    article_category: article_categories.sample,
    body: RANDOM_TEXT.sample,
    publish_date: time,
    created_at: time,
    updated_at: time
  )
  art = Art.create(url: article_one.url, gallery: gallery, published_at: article_one.publish_date )

  time += rand(100..1000)

  # generate a random number of comments
  num_comments = rand(10..30)
  puts "generating #{num_comments} comments"
  num_comments.times do
    comment = Comment.create(
      user: users.sample,
      art_id: art.id,
      art_type: "art",
      text: RANDOM_TEXT.sample,
      created_at: time,
      updated_at: time,
      anonymous: [false, true, false, false, false].sample,
      approved: true
    )

    #generate random number of replies
    num_replies = rand(-5..5)
    if num_replies > 0
      puts "generating #{num_replies} replies"
      num_replies.times do
        reply = Comment.create(
          user: users.sample,
          art_id: art.id,
          art_type: "art",
          text: RANDOM_TEXT.sample,
          created_at: time,
          updated_at: time,
          anonymous: [false, true, false, false, false].sample,
          parent_id: comment.id,
          approved: true
        )

        num_votes = rand(20)
        puts "generating #{num_votes} reply votes"
        num_votes.times do
          # seed some Votes
          u = (users - [comment.user]).sample
          Vote.create(
            user: u,
            comment: reply,
            vote_type: Vote::EXCLUSIVE_VOTES.sample
          )
          rand(3).times do
            Vote.create(
              user: u,
              comment: reply,
              vote_type: (Vote::TYPES - Vote::EXCLUSIVE_VOTES).sample
            )
          end
        end

      end
    end

    # generate a random number of votes
    num_votes = rand(20)
    puts "generating #{num_votes} votes"
    num_votes.times do
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
    time += rand(5).minutes
  end
  # add some text to the most x comments based on counts
  SORTABLE_TYPES.each do |type|
    puts "Determining most #{type} comment for #{article_one.title}"
    filter_opts = {sort_dir: 'desc', sort_type: type}
    most_comment_tab = Comment.filter_and_sort(User.new, article_one.id, "article", filter_opts, 1).first

    if most_comment_tab
      most_comment = Comment.find(most_comment_tab.id)
      most_comment.text += " This is the comment with the highest #{type.titleize}."
      most_comment.save
    end

  end



  iter+=1
end
time_end = Process.clock_gettime(Process::CLOCK_MONOTONIC)
puts "Finishing process at #{Time.now}"

elapsed_time = (time_end - time_start)/60
puts "Total Time: #{elapsed_time} minutes"
