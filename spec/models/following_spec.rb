require 'rails_helper'

RSpec.describe Following, type: :model do
  describe "validations" do
    let!(:follow) { FactoryBot.build(:following) }

    it "should be valid with follower and following" do
      expect(follow).to be_valid
    end

    it "should be invalid without follower" do
      follow.follower = nil
      expect(follow).to_not be_valid
    end

    it "should be invalid without following" do
      follow.following = nil
      expect(follow).to_not be_valid
    end

    it "should not be valid if follow is duplicate" do
      follow_1 = FactoryBot.create(:following)
      follow_2 = FactoryBot.build(:following, follower: follow_1.follower, following: follow_1.following)
      expect(follow_2).to_not be_valid
    end
  end
end
