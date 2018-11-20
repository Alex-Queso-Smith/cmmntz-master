require 'rails_helper'

RSpec.describe Blocking, type: :model do
  describe "validations" do
    let!(:block) { FactoryBot.build(:blocking) }

    it "should be valid with blocker and blocking" do
      expect(block).to be_valid
    end

    it "should be invalid without blocker" do
      block.blocker = nil
      expect(block).to_not be_valid
    end

    it "should be invalid without blocking" do
      block.blocking = nil
      expect(block).to_not be_valid
    end

    it "should not be valid if block is duplicate" do
      block_1 = FactoryBot.create(:blocking)
      block_2 = FactoryBot.build(:blocking, blocker: block_1.blocker, blocking: block_1.blocking)
      expect(block_2).to_not be_valid
    end
  end

  describe "callbacks" do
    context "user previously followed" do
      let(:user_1) { FactoryBot.create(:user) }
      let(:user_2) { FactoryBot.create(:user) }

      before do
        user_1.followed_users << user_2
      end

      it "should destroy previous following when following blocked" do
        expect {
          user_1.blocked_users << user_2
        }.to change(Following, :count).by(-1)
      end
    end
  end
end
