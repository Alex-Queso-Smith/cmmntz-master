require 'rails_helper'

RSpec.describe "comments/index", type: :view do
  before(:each) do
    assign(:comments, [
      Comment.create!(
        :user_id => "User",
        :art_id => "Art",
        :art_type => "Art Type",
        :title => "Title",
        :text => "MyText",
        :anonymous => false
      ),
      Comment.create!(
        :user_id => "User",
        :art_id => "Art",
        :art_type => "Art Type",
        :title => "Title",
        :text => "MyText",
        :anonymous => false
      )
    ])
  end

  it "renders a list of comments" do
    render
    assert_select "tr>td", :text => "User".to_s, :count => 2
    assert_select "tr>td", :text => "Art".to_s, :count => 2
    assert_select "tr>td", :text => "Art Type".to_s, :count => 2
    assert_select "tr>td", :text => "Title".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
  end
end
