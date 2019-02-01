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

    describe "subject validations" do
      it "should not allow subject greater than 100 characters" do
        admin_mail.subject = "Vivamus eget urna accumsan, lobortis velit ac, porta ante. Ut ac nunc luctus, bibendum sapien in, consequat mauris. Nullam lobortis posuere gravida. Quisque efficitur ligula eget ex dapibus congue. Proin gravida gravida ante et tincidunt. Aliquam posuere dignissim pellentesque. Aliquam erat volutpat. Curabitur facilisis est eget facilisis accumsan. Sed consequat urna lorem, eu tincidunt risus tempor eget. Duis sit amet ipsum in velit fringilla efficitur id non lorem. Nam vitae ligula rutrum, molestie lacus in, rhoncus ipsum."
        expect(admin_mail).to_not be_valid
      end

      it "must have at least 1 character" do
        admin_mail.subject = ""
        expect(admin_mail).to_not be_valid
      end

      it "should sanitize from tags" do
        admin_mail.subject = "<p>text<p>"
        text_sanitized = "text"
        admin_mail.valid?
        expect(admin_mail.subject).to eq(text_sanitized)
      end
    end

    describe "content validations" do
      it "should not allow content greater than 1000 characters" do
        admin_mail.content = "Vivamus eget urna accumsan, lobortis velit ac, porta ante. Ut ac nunc luctus, bibendum sapien in, consequat mauris. Nullam lobortis posuere gravida. Quisque efficitur ligula eget ex dapibus congue. Proin gravida gravida ante et tincidunt. Aliquam posuere dignissim pellentesque. Aliquam erat volutpat. Curabitur facilisis est eget facilisis accumsan. Sed consequat urna lorem, eu tincidunt risus tempor eget. Duis sit amet ipsum in velit fringilla efficitur id non lorem. Nam vitae ligula rutrum, molestie lacus in, rhoncus ipsum.

        Aenean scelerisque, odio ut viverra iaculis, nunc magna placerat sem, eget viverra massa urna id lorem. Vivamus dignissim felis lacus, eu cursus ex congue at. Vivamus vitae dolor dui. Cras volutpat ante dolor, id facilisis erat lacinia id. Ut rhoncus nunc vel erat feugiat, ut blandit nibh euismod. Pellentesque orci eros, posuere ut tristique ac, mattis quis justo. Nunc finibus ipsum nec est euismod interdum. Vivamus imperdiet ipsum nec pulvinar venenatis. Fusce sed feugiat nisi, eget auctor sapien. Sed eget ipsum nec urna porttitor tristique ac nec mi. Praesent porttitor pellentesque eleifend."
        expect(admin_mail).to_not be_valid
      end

      it "must have at least 1 character" do
        admin_mail.content = ""
        expect(admin_mail).to_not be_valid
      end

      it "should sanitize from tags" do
        admin_mail.content = "<p>text<p>"
        text_sanitized = "text"
        admin_mail.valid?
        expect(admin_mail.content).to eq(text_sanitized)
      end
    end
  end

  describe "callbacks" do
    let!(:admin_mail) { FactoryBot.build(:admin_mail) }

    it "should send an email after create with valid attributes" do
      expect { admin_mail.save }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end
    it "should NOT send an email after create with invalid attributes" do
      admin_mail.user = nil
      expect { admin_mail.save }.to change { ActionMailer::Base.deliveries.count }.by(0)
    end
  end

  describe "resuting email" do
    let!(:admin_mail) { FactoryBot.create(:admin_mail) }
    before do
      @email = ActionMailer::Base.deliveries.last
    end

    it "should be sent to the proper use email" do
      expect(@email.to.first).to eq(admin_mail.user.email)
    end

    it "should have a subject matching protocol" do
      subject = "CMMNTZ: #{admin_mail.subject}"
      expect(@email.subject).to eq(subject)
    end
  end
end
