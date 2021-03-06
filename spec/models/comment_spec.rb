require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe "validation" do
    describe "basic validation " do
      it "is valid with valid inputs" do
        comment = FactoryBot.build(:comment)
        expect(comment).to be_valid
      end
    end

    describe "text validations" do
      let!(:comment) { FactoryBot.build_stubbed(:comment)}

      it "must be less than 3000 characters" do
        comment.text = "Vivamus eget urna accumsan, lobortis velit ac, porta ante. Ut ac nunc luctus, bibendum sapien in, consequat mauris. Nullam lobortis posuere gravida. Quisque efficitur ligula eget ex dapibus congue. Proin gravida gravida ante et tincidunt. Aliquam posuere dignissim pellentesque. Aliquam erat volutpat. Curabitur facilisis est eget facilisis accumsan. Sed consequat urna lorem, eu tincidunt risus tempor eget. Duis sit amet ipsum in velit fringilla efficitur id non lorem. Nam vitae ligula rutrum, molestie lacus in, rhoncus ipsum.

  Aenean scelerisque, odio ut viverra iaculis, nunc magna placerat sem, eget viverra massa urna id lorem. Vivamus dignissim felis lacus, eu cursus ex congue at. Vivamus vitae dolor dui. Cras volutpat ante dolor, id facilisis erat lacinia id. Ut rhoncus nunc vel erat feugiat, ut blandit nibh euismod. Pellentesque orci eros, posuere ut tristique ac, mattis quis justo. Nunc finibus ipsum nec est euismod interdum. Vivamus imperdiet ipsum nec pulvinar venenatis. Fusce sed feugiat nisi, eget auctor sapien. Sed eget ipsum nec urna porttitor tristique ac nec mi. Praesent porttitor pellentesque eleifend."
        expect(comment).to_not be_valid
      end

      it "must have at least 1 character" do
        comment.text = ""
        expect(comment).to_not be_valid
      end

      it "should sanitize from tags" do
        comment.text = "<p>text<p>"
        text_sanitized = sanitize(comment.text, tags: [])
        comment.valid?
        expect(comment.text).to eq(text_sanitized)
      end
    end
  end

  describe "comment with votes" do
    # testing factory
    it "should have 5 votes when requested to have 5 votes" do
      comment = create(:comment_with_votes, votes_count: 5)
      expect(comment.votes.size).to eq(5)
    end
  end

  describe "parsing self-votes when provided" do
    let!(:comment) { FactoryBot.build(:comment) }
    it "should behave as normal when not provided votes" do
      expect{ comment.save }.to change(Comment, :count).by(1)
    end

    it "should create its votes" do
      comment.vote_types = "top,like_a_lot,smart,funny"
      expect{ comment.save }.to change(Vote, :count).by(4)
    end

    it "should ignore bad vote types when provided while still creating valid ones" do
      comment.vote_types = "top,booyah,smart,foo,bar"
      expect{ comment.save }.to change(Vote, :count).by(2)
    end

    it "should create a comment_interaction with valid votes" do
      comment.vote_types = "top,like_a_lot,smart,funny"
      expect{ comment.save }.to change(CommentInteraction, :count).by(1)
    end

    it "should not create a comment_interaction with invalid votes" do
      comment.vote_types = "foo,bar,ya,da"
      expect{ comment.save }.to change(CommentInteraction, :count).by(0)
    end

    it "should not create a comment_interaction with no votes" do
      expect{ comment.save }.to change(CommentInteraction, :count).by(0)
    end

    context "top votes not self owned previous comment" do
      let!(:comment2) { FactoryBot.create(:comment, art_id: comment.art_id) }
      let!(:prev_top_vote) { FactoryBot.create(:vote, comment: comment2, user: comment.user, vote_type: "top") }

      it "should not allow a duplicate top vote in the same thread without force" do
        comment.vote_types = "top"
        expect(comment).to_not be_valid
      end

      it "should allow a top vote in the same thread with force" do
        comment.vote_types = "top"
        comment.force = true
        expect(comment).to be_valid
      end
    end

    context "top votes self owned previous comment" do
      let!(:comment2) { FactoryBot.create(:comment, art_id: comment.art_id, user: comment.user) }
      let!(:prev_top_vote) { FactoryBot.create(:vote, comment: comment2, user: comment.user, vote_type: "top") }

      it "should allow a top vote in the same thread without force" do
        comment.vote_types = "top"
        expect(comment).to be_valid
      end
    end
  end

  describe "replies " do
    let!(:comment) { FactoryBot.create(:comment) }
    let!(:comment_with_replies) { FactoryBot.create(:comment_with_replies, replies_count: 4) }

    context "when it is a parent" do
      it "should return [] when it has no replies" do
        expect(comment.replies).to eq([])
      end

      it "should return its replies" do
        expect(comment_with_replies.replies.size).to eq(4)
      end
    end

    context "when it is a reply" do
      it "should return its parent" do
        reply1 = comment_with_replies.replies.first
        expect(reply1.parent_id).to eq(comment_with_replies.id)
      end
    end
  end

  describe "callbacks" do
    it "should censor its text appropriately when bad words are present" do
      comment = FactoryBot.create(:comment, text: "I am a fucking Wombat!")
      expect(comment.censored_text).to eq("I am a ****ing ******!")
    end

    it "should censor its text appropriately when bad words are present" do
      comment = FactoryBot.create(:comment, text: "I am a Horse!")
      expect(comment.censored_text).to eq("I am a Horse!")
    end
  end
end
