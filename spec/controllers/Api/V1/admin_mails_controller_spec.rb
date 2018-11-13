require 'rails_helper'

RSpec.describe Api::V1::AdminMailsController, type: :controller do
  describe "while authenticated do" do
    setup :activate_authlogic
    before(:each) do
      @user = FactoryBot.create(:user)
      @other_user = FactoryBot.create(:user)
    end

    # This should return the minimal set of attributes required to create a valid
    # AdminMail. As you add validations to AdminMail, be sure to
    # adjust the attributes here as well
    let(:valid_attributes) {
      FactoryBot.attributes_for(:admin_mail, user_id: @other_user.id)
    }

    let(:invalid_attributes) {
      FactoryBot.attributes_for(:admin_mail, user_id: @other_user.id, subject: nil, content: nil)
    }

    # This should return the minimal set of values that should be in the session
    # in order to pass any filters (e.g. authentication) defined in
    # AdminMailsController. Be sure to keep this updated too.
    let(:valid_session) { {} }

    describe "POST #create" do
      context "with valid params" do
        it "creates a new AdminMail" do
          expect {
            post :create, format: :json, params: { admin_mail: valid_attributes }, session: valid_session
          }.to change(AdminMail, :count).by(1)
        end

        it "responds successfully" do
          post :create, format: :json, params: { admin_mail: valid_attributes }, session: valid_session
          expect(response).to be_successful
        end
        
        context "with invalid params" do
          it "returns a success response(i.e. to display the 'new' template)" do
            post :create, format: :json, params: { admin_mail: invalid_attributes }, session: valid_session
            expect(response).to be_successful
          end
        end
      end
    end
  end
end
