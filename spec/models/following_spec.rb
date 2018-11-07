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

  end
end
