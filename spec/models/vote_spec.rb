require 'rails_helper'

RSpec.describe Vote, type: :model do
  describe "validation" do
    let!(:vote) { FactoryBot.build_stubbed(:vote) }

    it "should be valid with valid attributes" do
      expect(vote).to be_valid
    end

    it "should not be valid without a user" do
      vote.user = nil
      expect(vote).to_not be_valid
    end

    it "should not be valid without a comment" do
      vote.comment = nil
      expect(vote).to_not be_valid
    end

    it "should not be valid without a vote_type" do
      vote.vote_type = nil
      expect(vote).to_not be_valid
    end

    %w(these are 1 not 2 valid types).each do |type|
      it "should be invalid with a vote_type of #{type}" do
        vote.vote_type = type
        expect(vote).to_not be_valid
      end
    end

    Vote::TYPES.each do |type|
      it "should be valid with a vote_type of #{type}" do
        vote.vote_type = type
        expect(vote).to be_valid
      end
    end

  end
end
