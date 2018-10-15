require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe "validation" do
    let!(:comment1) { FactoryBot.build(:comment) }

    it "is valid with valid inputs" do
      expect(comment1).to be_valid
    end

    describe "title validations" do
      let!(:comment_long_title) { FactoryBot.build(:comment, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac finibus dolor. Mauris ut tempor metus. Sed scelerisque velit erat. Morbi dolor leo, tristique at vestibulum ac, sodales nec lacus. Cras eu varius ex, quis cursus urna.") }
      let!(:comment_no_title) { FactoryBot.build(:comment, title: "") }
      let!(:comment_title_html) { FactoryBot.build(:comment, title: "<p>text<p>")}

      it "must be less than 32 characters" do
        expect(comment_long_title).to_not be_valid
      end

      it "must be at least 1 character" do
        expect(comment_no_title).to_not be_valid
      end

      it "should sanitize from tags" do
        title_sanitized = sanitize(comment_title_html.title, tags: [])
        comment_title_html.valid?
        expect(comment_title_html.title).to eq(title_sanitized)
      end
    end

    describe "text validations" do
      let!(:comment_long_text) { FactoryBot.build(:comment, text: "Vivamus eget urna accumsan, lobortis velit ac, porta ante. Ut ac nunc luctus, bibendum sapien in, consequat mauris. Nullam lobortis posuere gravida. Quisque efficitur ligula eget ex dapibus congue. Proin gravida gravida ante et tincidunt. Aliquam posuere dignissim pellentesque. Aliquam erat volutpat. Curabitur facilisis est eget facilisis accumsan. Sed consequat urna lorem, eu tincidunt risus tempor eget. Duis sit amet ipsum in velit fringilla efficitur id non lorem. Nam vitae ligula rutrum, molestie lacus in, rhoncus ipsum.

Aenean scelerisque, odio ut viverra iaculis, nunc magna placerat sem, eget viverra massa urna id lorem. Vivamus dignissim felis lacus, eu cursus ex congue at. Vivamus vitae dolor dui. Cras volutpat ante dolor, id facilisis erat lacinia id. Ut rhoncus nunc vel erat feugiat, ut blandit nibh euismod. Pellentesque orci eros, posuere ut tristique ac, mattis quis justo. Nunc finibus ipsum nec est euismod interdum. Vivamus imperdiet ipsum nec pulvinar venenatis. Fusce sed feugiat nisi, eget auctor sapien. Sed eget ipsum nec urna porttitor tristique ac nec mi. Praesent porttitor pellentesque eleifend.")}
      let!(:comment_no_text) { FactoryBot.build(:comment, text: "")}
      let!(:comment_text_html) { FactoryBot.build(:comment, text: "<p>text<p>")}

      it "must be less than 512 characters" do
        expect(comment_long_text).to_not be_valid
      end

      it "must have at least 1 character" do
        expect(comment_no_text).to_not be_valid
      end

      it "should sanitize from tags" do
        text_sanitized = sanitize(comment_text_html.text, tags: [])
        comment_text_html.valid?
        expect(comment_text_html.text).to eq(text_sanitized)
      end
    end

  end
end
