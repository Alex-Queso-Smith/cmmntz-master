require 'rails_helper'

RSpec.describe Vote, type: :model do
  describe "before validations take place " do
    it "should automatically underscoreize any camelcase vote_types" do
      vote = FactoryBot.build(:vote, vote_type: "likeALot")
      vote.valid?
      expect(vote.vote_type).to eq("like_a_lot")
    end
  end

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

    describe "vote_type validations" do
      let!(:user) { FactoryBot.create(:user) }
      let!(:comment) { FactoryBot.create(:comment) }
      let!(:vote_like) { FactoryBot.create(:vote, comment: comment, user: user, vote_type: "like") }

      it "should not allow a user to cast more than 1 vote of the exclusive set" do
        vote2 = FactoryBot.build_stubbed(:vote, comment: comment, user: user, vote_type: "dislike")
        expect(vote2).to_not be_valid
      end

      it "should not allow a user to cast more than 1 of the same vote for a comment" do
        vote1 = FactoryBot.create(:vote, comment: comment, user: user, vote_type: "warn")
        vote2 = FactoryBot.build_stubbed(:vote, comment: comment, user: user, vote_type: "warn")
        expect(vote1).to be_valid
        expect(vote2).to_not be_valid
      end

      it "should allow the user to cast multiple votes the are not exclusive not identical" do
        vote2 = FactoryBot.build_stubbed(:vote, comment: comment, user: user, vote_type: "warn")
        expect(vote2).to be_valid
      end
    end
  end

  describe "after create commit" do
    let!(:comment) { FactoryBot.create(:comment) }
    let!(:user) { FactoryBot.create(:user) }

    context "if the user has not interacted with the comment before" do
      it "should increment the interactions_count on comment" do
        expected_interactions_count = comment.interactions_count + 1
        vote = FactoryBot.create(:vote, comment: comment, user: user, vote_type: "like")
        comment.reload
        expect(comment.interactions_count).to eq(expected_interactions_count)
      end
    end

    context "if the user has interacted with the comment before" do
      it "should not increment the interactions_count on comment" do
        vote1 = FactoryBot.create(:vote, comment: comment, user: user, vote_type: "like")
        comment.reload
        expected_interactions_count = comment.interactions_count
        vote2 = FactoryBot.create(:vote, comment: comment, user: user, vote_type: "trash")
        comment.reload
        expect(comment.interactions_count).to eq(expected_interactions_count)
      end
    end
  end
end
