require 'rails_helper'

RSpec.describe Api::V1::UserSessionsController, type: :controller do
  describe "While Not authenticated do" do
    describe "loging in" do
      context "with valid credentials " do
        it "it should create a session"
        it "it should return successful"
      end

      context "with invalid credentials" do
        it "it should return errors"
      end
    end

  end

  describe "While authenticated do" do
    describe "logging out" do
      it "it should successfully log the user out"
    end
  end
end
