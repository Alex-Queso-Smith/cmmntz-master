require 'rails_helper'

RSpec.describe Api::V1::CommentsController, type: :controller do
  describe 'While authenticated do' do
    setup :activate_authlogic
    before(:each) do
      @user = FactoryBot.create(:user)
    end


    # This should return the minimal set of attributes required to create a valid
    # Comment. As you add validations to Comment, be sure to
    # adjust the attributes here as well.
    let(:valid_attributes) {
      FactoryBot.attributes_for(:comment, user_id: @user.id)
    }

    let(:invalid_attributes) {
      FactoryBot.attributes_for(:comment, user_id: @user.id, text: "")
    }

    # This should return the minimal set of values that should be in the session
    # in order to pass any filters (e.g. authentication) defined in
    # CommentsController. Be sure to keep this updated too.
    let(:valid_session) { {} }

    describe "GET #index" do
      it "returns a success response" do
        Comment.create! valid_attributes
        get :index, format: :json, params: {}, session: valid_session
        expect(response).to be_successful
      end
    end

    describe "POST #create" do
      context "with valid params" do
        it "creates a new Comment" do
          expect {
            post :create, format: :json, params: {comment: valid_attributes}, session: valid_session
          }.to change(Comment, :count).by(1)
        end

        it "redirects to the inxdex" do
          post :create, format: :json, params: {comment: valid_attributes}, session: valid_session
          expect(response).to redirect_to(api_v1_comments_url(art_id: Comment.last.art_id, art_type: "article"))
        end
      end

      context "with invalid params" do
        it "returns a success response (i.e. to display the 'new' template)" do
          post :create, format: :json, params: {comment: invalid_attributes}, session: valid_session
          expect(response).to be_successful
        end
      end
    end

    describe "PUT #update" do
      context "with valid params" do
        let(:new_attributes) {
          FactoryBot.attributes_for(:comment, user_id: @user.id, text: "this is a changed in comment text")
        }

        it "updates the requested comment" do
          comment = Comment.create! valid_attributes
          put :update, format: :json, params: {id: comment.to_param, comment: new_attributes}, session: valid_session
          comment.reload
          expect(comment.text).to eq(new_attributes[:text])
        end

        it "redirects to the index" do
          comment = Comment.create! valid_attributes
          put :update, format: :json, params: {id: comment.to_param, comment: valid_attributes}, session: valid_session
          expect(response).to redirect_to(api_v1_comments_url(art_id: comment.art_id, art_type: "article"))
        end
      end

      context "with invalid params" do
        it "returns a success response (i.e. to display the 'edit' template)" do
          comment = Comment.create! valid_attributes
          put :update, format: :json, params: {id: comment.to_param, comment: invalid_attributes}, session: valid_session
          expect(response).to be_successful
        end
      end
    end

    describe "DELETE #destroy" do
      it "destroys the requested comment" do
        comment = Comment.create! valid_attributes
        expect {
          delete :destroy, format: :json, params: {id: comment.to_param}, session: valid_session
        }.to change(Comment, :count).by(-1)
      end

      it "redirects to the comments list" do
        comment = Comment.create! valid_attributes
        delete :destroy, format: :json, params: {id: comment.to_param}, session: valid_session
        expect(response).to be_successful
      end
    end
  end
end
