require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  let(:valid_attributes) {
    FactoryBot.attributes_for(:user)
  }

  let(:invalid_attributes) {
    FactoryBot.attributes_for(:user)
  }

  describe "While not authenticated do" do
    let(:valid_session) { {} }

    describe "POST #create" do
      context "with valid params" do
        it "creates a new User" do
          expect {
            post :create, format: :json, params: {user: valid_attributes}, session: valid_session
          }.to change(User, :count).by(1)
        end

        it "it responds successfull" do
          post :create, format: :json, params: {user: valid_attributes}, session: valid_session
          expect(response).to be_successful
        end
      end

      context "with invalid params" do
        it "returns a success response (i.e. to display the 'new' template)" do
          post :create, format: :json, params: {user: invalid_attributes}, session: valid_session
          expect(response).to be_successful
        end
      end
    end
  end

  describe 'While authenticated do' do
    setup :activate_authlogic
    before(:each) do
      @user = FactoryBot.create(:user)
    end

    let(:valid_session) { {} }

    describe "GET #index" do
      it "returns a success response" do
        User.create! valid_attributes
        get :index, format: :json, params: {}, session: valid_session
        expect(response).to be_successful
      end
    end

    describe "PUT #update" do
      context "with valid params" do

        let(:new_attributes) {
          FactoryBot.attributes_for(:user, user_id: @user.id, user_name: "IamATeapot")
        }

        it "updates the requested user" do
          user = @user
          put :update, format: :json, params: {id: user.to_param, user: new_attributes}, session: valid_session
          user.reload
          expect(user.user_name).to eq(new_attributes[:user_name])
        end

        it "redirects to the index" do
          user = @user
          put :update, format: :json, params: {id: user.to_param, user: valid_attributes}, session: valid_session
          expect(response).to be_successful
        end
      end

      context "with invalid params" do
        it "returns a success response (i.e. to display the 'edit' template)" do
          user = @user
          put :update, format: :json, params: {id: user.to_param, user: invalid_attributes}, session: valid_session
          expect(response).to be_successful
        end
      end
    end

    describe "DELETE #destroy" do
      it "destroys the requested user" do
        user = @user
        expect {
          delete :destroy, format: :json, params: {id: user.to_param}, session: valid_session
        }.to change(User, :count).by(-1)
      end

      it "redirects to the users list" do
        user = @user
        delete :destroy, format: :json, params: {id: user.to_param}, session: valid_session
        expect(response).to be_successful
      end
    end
  end
end
