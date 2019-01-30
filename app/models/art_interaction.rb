class ArtInteraction < ApplicationRecord
  belongs_to :art, counter_cache: true
  belongs_to :user

  validates :art_id, :user_id, presence: true
  validates :art_id, uniqueness: { scope: :user_id }

  scope :for_user_and_art, lambda {|user_id, art_id| where(user_id: user_id, art_id: art_id)}

  def self.create_for_user_and_art(user_id, art_id)
    if self.for_user_and_art(user_id, art_id).size == 0
      create!(user_id: user_id, art_id: art_id)
    end
  rescue
    # the only way this should trip is if there is one already
    # in which case this is superfluous
    true
  end
end
