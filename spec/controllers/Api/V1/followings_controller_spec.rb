require 'rails_helper'

RSpec.describe Api::V1::FollowingsController, type: :controller do
  describe 'While authenticated do' do
    setup :activate_authlogic
    before(:each) do
      @user = FactoryBot.create(:user)
      @other_user = FactoryBot.create(:user)
    end


    # This should return the minimal set of attributes required to create a valid
    # Following. As you add validations to Following, be sure to
    # adjust the attributes here as well.
    let(:valid_attributes) {
      FactoryBot.attributes_for(:following, follower_id: @user.id, following_id: @other_user.id)
    }

    let(:invalid_attributes) {
      FactoryBot.attributes_for(:following, follower_id: @user.id, following_id: nil)
    }

    # This should return the minimal set of values that should be in the session
    # in order to pass any filters (e.g. authentication) defined in
    # FollowingsController. Be sure to keep this updated too.
    let(:valid_session) { {} }

    describe "POST #create" do
      context "with valid params" do
        it "creates a new Following" do
          expect {
            post :create, format: :json, params: { following: valid_attributes }, session: valid_session
          }.to change(Following, :count).by(1)
        end

        it "responds successfully" do
          post :create, format: :json, params: { following: valid_attributes }, session: valid_session
          expect(response).to be_successful
        end
      end

      context "with invalid params" do
        it "returns a success response (i.e. to display the 'new' template)" do
          post :create, format: :json, params: { following: invalid_attributes }, session: valid_session
          expect(response).to be_successful
        end
      end
    end
  end
end
