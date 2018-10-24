require 'rails_helper'

RSpec.describe CommentInteraction, type: :model do
  describe "validations" do
    let!(:comment_interaction) {FactoryBot.build(:comment_interaction)}
    it "should be valid with valid attributes" do
      expect(comment_interaction).to be_valid
    end

    it "should be invalid without a comment_id" do
      comment_interaction.comment = nil
      expect(comment_interaction).to_not be_valid
    end

    it "should be invalid without a user_id" do
      comment_interaction.user = nil
      expect(comment_interaction).to_not be_valid
    end

    it "should only allow 1 interaction per user/comment combo" do
      first_interaction = FactoryBot.create(:comment_interaction)
      second_interaction = FactoryBot.build(:comment_interaction, comment: first_interaction.comment, user: first_interaction.user)
      expect(second_interaction).to_not be_valid
    end

  end

  describe "counter caching" do
    it "should increment the interactions count on comment when it is created" do
      comment = FactoryBot.create(:comment)
      interaction = FactoryBot.create(:comment_interaction, comment: comment, user: comment.user)
      comment.reload
      expect(comment.interactions_count).to eq(1)
    end
  end
end
