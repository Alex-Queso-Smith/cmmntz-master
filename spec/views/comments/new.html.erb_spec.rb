require 'rails_helper'

RSpec.describe "comments/new", type: :view do
  before(:each) do
    assign(:comment, Comment.new(
      :user_id => "MyString",
      :art_id => "MyString",
      :art_type => "MyString",
      :title => "MyString",
      :text => "MyText",
      :anonymous => false
    ))
  end

  it "renders new comment form" do
    render

    assert_select "form[action=?][method=?]", comments_path, "post" do

      assert_select "input[name=?]", "comment[user_id]"

      assert_select "input[name=?]", "comment[art_id]"

      assert_select "input[name=?]", "comment[art_type]"

      assert_select "input[name=?]", "comment[title]"

      assert_select "textarea[name=?]", "comment[text]"

      assert_select "input[name=?]", "comment[anonymous]"
    end
  end
end
