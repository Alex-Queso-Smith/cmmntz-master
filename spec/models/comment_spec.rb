require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe "validation" do
    describe "basic validation " do
      it "is valid with valid inputs" do
        comment = FactoryBot.build(:comment)
        expect(comment).to be_valid
      end
    end

    describe "title validations" do
      let!(:comment) { FactoryBot.build_stubbed(:comment) }

      it "must be less than 32 characters" do
        comment.title = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac finibus dolor. Mauris ut tempor metus. Sed scelerisque velit erat. Morbi dolor leo, tristique at vestibulum ac, sodales nec lacus. Cras eu varius ex, quis cursus urna."
        expect(comment).to_not be_valid
      end

      # it "must be at least 1 character" do
      #   @comment.title = ""
      #   expect(comment_no_title).to_not be_valid
      # end

      it "should sanitize from tags" do
        comment.title = "<p>text<p>"
        title_sanitized = sanitize(comment.title, tags: [])
        comment.valid?
        expect(comment.title).to eq(title_sanitized)
      end
    end

    describe "text validations" do
      let!(:comment) { FactoryBot.build_stubbed(:comment)}

      it "must be less than 512 characters" do
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
end
