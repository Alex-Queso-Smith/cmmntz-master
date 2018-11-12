require 'rails_helper'

RSpec.describe Api::V1::BlockingsController, type: :controller do
  describe "while authenticated do" do
    setup :activate_authlogic
    before(:each) do
      @user = FactoryBot.create(:user)
      @other_user = FactoryBot.create(:user)
    end

    # This should return the minimal set of attributes required to create a valid
    # Blocking. As youu add validations to Blocking, be sure to
    # adjust the attributes here as well
    let(:valid_attributes) {
      FactoryBot.attributes_for(:blocking, blocker_id: @user.id, blocking_id: @other_user.id)
    }

    let(:invalid_attributes) {
      FactoryBot.attributes_for(:blocking, blocker_id: @user.id, blocking_id: nil)
    }

    # This should return the minimal set of values that should be in the session
    # in order to pass any filters (e.g. authentication) defined in
    # BlockingsController. Be sure to keep this updated too.
    let(:valid_session) { {} }

    describe "POST #create" do
      context "with valid params" do
        it "creates a new Blocking" do
          expect {
            post :create, format: :json, params: { blocking: valid_attributes }, session: valid_session
          }.to change(Blocking, :count).by(1)
        end

        it "responds successfully" do
          post :create, format: :json, params: { blocking: valid_attributes }, session: valid_session
          expect(response).to be_successful
        end

        context "with invalid params" do
          it "returns a success response(i.e. to display the 'new' template)" do
            post :create, format: :json, params: { blocking: invalid_attributes }, session: valid_session
            expect(response).to be_successful
          end
        end
      end
    end
  end
end
