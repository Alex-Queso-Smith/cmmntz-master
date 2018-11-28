class Gallery < ApplicationRecord
  has_many :arts

  vstr 'settings', {
    comments_from: :string,
    filter_list: :array,
    not_filter_list: :array,
    sort_dir: :string,
    sort_type: :string,
    votes_from: :string,
    censor: :bool
  }

  def checker_settings
    {
      comments_amount: 1,
      votes: {
        warn: 1,
        dislike: 1,
        dislike_a_lot: 1
      }
    }
  end
end
