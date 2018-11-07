require 'rails_helper'

# Specs in this file have access to a helper object that includes
# the CommentsHelper. For example:
#
# describe CommentsHelper do
#   describe "string concat" do
#     it "concats two strings with spaces" do
#       expect(helper.concat_strings("this","that")).to eq("this that")
#     end
#   end
# end
RSpec.describe CommentsHelper, type: :helper do
  context "When the user marks the comment as anonymous" do
    let!(:comment) {FactoryBot.build_stubbed(:comment, anonymous: true)}

    it "should not supply the user's user_name" do
      expect(comment_user_user_name(comment)).to eq("Anonymous")
    end
    it "should not supply the user's gender" do
      expect(comment_user_gender(comment)).to eq("")
    end
    it "should not supply the user's age_range" do
      expect(comment_user_age_range(comment)).to eq("")
    end
  end

  context "When the user does not mark the comment as anonymous" do
    let!(:comment) {FactoryBot.build_stubbed(:comment)}

    it "should supply the user's user_name" do
      expect(comment_user_user_name(comment)).to eq(comment.user.user_name)
    end


    context "when the user has supplied their gender" do
      let(:user) { FactoryBot.create(:user, :gender_female) }
      it "should supply the user's gender" do
        comment.user = user
        expect(comment_user_gender(comment)).to eq(comment.user.gender_display)
      end
    end

    context "when the user has not supplied their gender" do
      it "should return blank for gender" do
        expect(comment_user_gender(comment)).to eq(comment.user.gender_display)
      end
    end

    context "when the user has supplied their age_range" do
      let(:user) { FactoryBot.create(:user, :age_range_20) }
      it "should supply the user's age_range" do
        expect(comment_user_age_range(comment)).to eq(comment.user.age_range_display)
      end
    end

    context "when the user has not supplied their age_range" do
      it "should return blank for age_range" do
        expect(comment_user_age_range(comment)).to eq(comment.user.age_range_display)
      end
    end



  end

end
