require 'rails_helper'

RSpec.describe "articles/index", type: :view do
  before(:each) do
    assign(:articles, [
      Article.create!(
        :title => "Title",
        :text => "MyText",
        :author_name => "Author Name",
        :author_id => "Author"
      ),
      Article.create!(
        :title => "Title",
        :text => "MyText",
        :author_name => "Author Name",
        :author_id => "Author"
      )
    ])
  end

  it "renders a list of articles" do
    render
    assert_select "tr>td", :text => "Title".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "Author Name".to_s, :count => 2
    assert_select "tr>td", :text => "Author".to_s, :count => 2
  end
end
