require 'rails_helper'

RSpec.describe Api::V1::VotesController, type: :controller do
  describe 'While authenticated do' do
    setup :activate_authlogic
    before(:each) do
      @user = FactoryBot.create(:user)
      @comment = FactoryBot.create(:comment)
    end


    # This should return the minimal set of attributes required to create a valid
    # Vote. As you add validations to Vote, be sure to
    # adjust the attributes here as well.
    let(:valid_attributes) {
      FactoryBot.attributes_for(:vote, user_id: @user.id, comment_id: @comment.id)
    }

    let(:invalid_attributes) {
      FactoryBot.attributes_for(:vote, user_id: @user.id, comment_id: @comment.id, vote_type: "bla")
    }

    # This should return the minimal set of values that should be in the session
    # in order to pass any filters (e.g. authentication) defined in
    # VotesController. Be sure to keep this updated too.
    let(:valid_session) { {} }

    describe "POST #create" do
      context "with valid params" do
        it "creates a new Vote" do
          expect {
            post :create, format: :json, params: {vote: valid_attributes}, session: valid_session
          }.to change(Vote, :count).by(1)
        end

        it "responds successfully" do
          post :create, format: :json, params: {vote: valid_attributes}, session: valid_session
          expect(response).to be_successful
        end

        it "includes the vote_id" do
          post :create, format: :json, params: {vote: valid_attributes}, session: valid_session
          expect(JSON.parse(response.body)["vote_id"]).to_not eq(nil)
        end

        it "includes the vote_type" do
          post :create, format: :json, params: {vote: valid_attributes}, session: valid_session
          expect(JSON.parse(response.body)["vote_type"]).to eq(valid_attributes[:vote_type])
        end
      end

      context "with invalid params" do
        it "returns a success response (i.e. to display the 'new' template)" do
          post :create, format: :json, params: {vote: invalid_attributes}, session: valid_session
          expect(response).to be_successful
        end
      end
    end

    describe "PUT #update" do
      context "with valid params" do
        let(:new_attributes) {
          FactoryBot.attributes_for(:vote, user_id: @user.id, comment_id: @comment.id, vote_type: "like")
        }

        it "updates the requested vote" do
          vote = Vote.create! valid_attributes
          put :update, format: :json, params: {id: vote.to_param, vote: new_attributes}, session: valid_session
          vote.reload
          expect(vote.vote_type).to eq(new_attributes[:vote_type])
        end

        it "responds successfull" do
          vote = Vote.create! valid_attributes
          put :update, format: :json, params: {id: vote.to_param, vote: valid_attributes}, session: valid_session
          expect(response).to be_successful
        end

        it "includes the vote_id" do
          vote = Vote.create! valid_attributes
          put :update, format: :json, params: {id: vote.to_param, vote: valid_attributes}, session: valid_session
          expect(JSON.parse(response.body)["vote_id"]).to eq(vote.id)
        end

        it "includes the vote_type" do
          vote = Vote.create! valid_attributes
          put :update, format: :json, params: {id: vote.to_param, vote: valid_attributes}, session: valid_session
          expect(JSON.parse(response.body)["vote_type"]).to eq(valid_attributes[:vote_type])
        end
      end

      context "with invalid params" do
        it "returns a success response (i.e. to display the 'edit' template)" do
          vote = Vote.create! valid_attributes
          put :update, format: :json, params: {id: vote.to_param, vote: invalid_attributes}, session: valid_session
          expect(response).to be_successful
        end
      end
    end

    describe "DELETE #destroy" do
      it "destroys the requested vote" do
        vote = Vote.create! valid_attributes
        expect {
          delete :destroy, format: :json, params: {id: vote.to_param}, session: valid_session
        }.to change(Vote, :count).by(-1)
      end

      it "redirects to the votes list" do
        vote = Vote.create! valid_attributes
        delete :destroy, format: :json, params: {id: vote.to_param}, session: valid_session
        expect(response).to be_successful
      end
    end
  end
end
