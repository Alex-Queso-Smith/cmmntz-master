require 'rails_helper'

RSpec.describe AdminMail, type: :model do
  describe "validations" do
    let!(:admin_mail) { FactoryBot.build(:admin_mail) }

    it "should be valid with valid attributes" do
      expect(admin_mail).to be_valid
    end

    it "should be invalid without a user_id" do
      admin_mail.user = nil
      expect(admin_mail).to_not be_valid
    end

    it "should be invalid without a subject" do
      admin_mail.subject = nil
      expect(admin_mail).to_not be_valid
    end

    it "should be invalid witout content" do
      admin_mail.content = nil
      expect(admin_mail).to_not be_valid
    end
  end

  describe "callbacks" do
    let!(:admin_mail) { FactoryBot.build(:admin_mail) }
    
    it "should send an email after create" do
      expect { admin_mail.save }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end
  end
end
