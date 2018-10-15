require 'rails_helper'

RSpec.describe "comments/edit", type: :view do
  before(:each) do
    @comment = assign(:comment, Comment.create!(
      :user_id => "MyString",
      :art_id => "MyString",
      :art_type => "MyString",
      :title => "MyString",
      :text => "MyText",
      :anonymous => false
    ))
  end

  it "renders the edit comment form" do
    render

    assert_select "form[action=?][method=?]", comment_path(@comment), "post" do

      assert_select "input[name=?]", "comment[user_id]"

      assert_select "input[name=?]", "comment[art_id]"

      assert_select "input[name=?]", "comment[art_type]"

      assert_select "input[name=?]", "comment[title]"

      assert_select "textarea[name=?]", "comment[text]"

      assert_select "input[name=?]", "comment[anonymous]"
    end
  end
end
