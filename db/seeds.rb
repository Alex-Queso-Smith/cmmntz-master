# set the number of rando-users we want in this pass
num_users = 1000

# set the number of articles we want in this pass
num_articles = 2
time_start = Process.clock_gettime(Process::CLOCK_MONOTONIC)

puts "Starting process at #{Time.now}"

# generate staff accounts
puts "generating staff accounts"
jesse = User.create(
  user_name: "Jesse",
  email: "jesse@classifilter.com",
  password: "password",
  password_confirmation: "password",
  base_image: "butterfly"
)

alex = User.create(
  user_name: "Alex",
  email: "aj@classifilter.com",
  password: "password",
  password_confirmation: "password",
  base_image: "gi"
)

aj = User.create(
  user_name: "AJ",
  email: "alex@classifilter.com",
  password: "password",
  password_confirmation: "password",
  base_image: "boxing-glove"
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
    base_image: AVATARS.sample
  )
  x += 1
end
User.import users, validate: false
users = User.all

# generate some followigs for the users
puts "generating followings for users"
users.each do |user|
  rand(-5..15).times do
    user.followings.create(following: (users - [user]).sample)
  end
end

# generate desired number of articles
puts "generating #{num_articles} articles"
iter = 1
num_articles.times do
  puts "article #{iter}"
  time = Time.now - rand(150000..10000000)
  article_one = Article.create(
    title: "Demo Article #{iter}",
    text: RANDOM_TEXT.sample,
    created_at: time,
    updated_at: time
  )

  time += rand(100..1000)

  # generate a random number of comments
  num_comments = rand(30..75)
  puts "generating #{num_comments} comments"
  num_comments.times do
    comment = Comment.create(
      user: users.sample,
      art_id: article_one.id,
      art_type: "article",
      text: RANDOM_TEXT.sample,
      created_at: time,
      updated_at: time,
      anonymous: [false, true].sample
    )

    #generate random number of replies
    num_replies = rand(-7..10)
    if num_replies > 0
      puts "generating #{num_replies} replies"
      num_replies.times do
        Comment.create(
          user: users.sample,
          art_id: article_one.id,
          art_type: "article",
          text: RANDOM_TEXT.sample,
          created_at: time,
          updated_at: time,
          anonymous: [false, true].sample,
          parent_id: comment.id
        )
      end
    end

    # generate a random number of votes
    num_votes = rand(50)
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
    most_comment_tab = CommentVoteTabulation.filter_and_sort(article_one.id, "article", filter_opts, 1).first

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
