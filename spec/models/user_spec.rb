require 'rails_helper'

RSpec.describe User, type: :model do
  describe "validation" do
    let!(:user1) { FactoryBot.build(:user) }
    let!(:user2) { FactoryBot.build(:user) }
    let!(:user3) { FactoryBot.build(:user, password: "") }
    let!(:user4) { FactoryBot.build(:user) }
    let!(:user5) { FactoryBot.build(:user, gender: 0) }
    let!(:user6) { FactoryBot.build(:user) }

    it "is valid with valid inputs" do
      expect(user1).to be_valid
    end

    attrs = %w(user_name password_confirmation)

    attrs.each do |att|
      it "is invalid with #{att} blank" do
        user2.send("#{att}=".to_sym, nil)
        expect(user2).to_not be_valid
      end
    end

    describe "password validations" do
      # authlogic does not allow password to be blanked....
      it "is invalid with password blank" do
        expect(user3).to_not be_valid
      end

      it "should be invalid if password and password_confirmation do not match" do
        user3.password = "123Abcd"
        user3.password_confirmation = "123acbD"
        expect(user3).to_not be_valid
      end

      it "is invalid with greater than 32 characters" do
        user3.password = "Abc456789012345678901234567890123"
        user3.password_confirmation = "Abc456789012345678901234567890123"
        expect(user3).to_not be_valid
      end

      it "is invalid with less than 6 characters" do
        user3.password = "Abc45"
        user3.password_confirmation = "Abc45"
        expect(user3).to_not be_valid
      end

      # Disabled for the MVP
      # it "should be invalid without at least 1 capital_letter" do
      #   user3.password = "abc4567"
      #   user3.password_confirmation = "abc4567"
      #   expect(user3).to_not be_valid
      # end

      # Disabled for the MVP
      # it "should be invalid without at least 1 integer" do
      #   user3.password = "abcdefg"
      #   user3.password_confirmation = "abcdefg"
      #   expect(user3).to_not be_valid
      # end

    end

    describe "gender validations" do
      User::GENDERS.each do |x|
        it "gender is valid with correct input #{x}" do
          user5.gender = x
          expect(user5).to be_valid
        end
      end

      invalid_gender_array = [3, "a", "b", "c"]

      invalid_gender_array.each do |x|
        it "should be invalid with invalid input #{x} for gender" do
          user5.gender = x
          expect(user5).to_not be_valid
        end
      end
    end

    describe "age validations" do
      User::AGES.each do |x|
        it "should be valid with valid input #{x} for age" do
          user1.age_range = x
          expect(user1).to be_valid
        end
      end

      invalid_age_array = [34, 567, 2, 99, 500, "a", "bif"]

      invalid_age_array.each do |x|
        it "should be invalid with invalid input #{x} for age" do
          user1.age_range = x
          expect(user1).to_not be_valid
        end
      end
    end

    describe "coordinate validations" do
      invalid_coordinates = { lat1: -198.00, long1: 340.56, lat2: 130.45, long2: 198.34, lat3: -193.00, long3: 25.98 }
      valid_coordinates =  { lat1: -178.00, long1: 40.56, lat2: 130.45, long2: 98.34, lat3: -13.00, long3: 25.98 }

      [1, 2, 3].each do |x|
        it "should be valid with set #{x}" do
          user4.latitude = valid_coordinates["lat#{x}".to_sym]
          user4.longitude = valid_coordinates["long#{x}".to_sym]

          expect(user4).to be_valid
        end
      end

      it "should be invalid with just lat" do
        user4.latitude = 123.45
        user4.longitude = nil

        expect(user4).to_not be_valid
      end

      it "should be invalid with just long" do
        user4.latitude = nil
        user4.longitude = 123.45

        expect(user4).to_not be_valid
      end

      [1, 2, 3].each do |x|
        it "should be invalid with bad coordinates set #{x}" do
          user4.latitude = invalid_coordinates["lat#{x}".to_sym]
          user4.longitude = invalid_coordinates["long#{x}".to_sym]

          expect(user4).to_not be_valid
        end
      end
    end

    describe "email validations" do
      it "should be invalid with invalid email" do
        user6.email = "invalid"
        expect(user6).to_not be_valid
      end
    end

    # pending "avatar validations"
  end

  describe "basic user gender functionality" do
    let!(:user) { FactoryBot.build(:user) }

    it "should return blank for unspecified" do
      expect(user.gender_display).to eq("")
    end

    it "should return male for value of 0" do
      user.gender = 0
      expect(user.gender_display).to eq("male")
    end

    it "should return other for value of 1" do
      user.gender = 1
      expect(user.gender_display).to eq("other")
    end

    it "should return female for value of 2" do
      user.gender = 2
      expect(user.gender_display).to eq("female")
    end
  end

  describe "basic age range functionality" do
    let!(:user) { FactoryBot.build(:user) }

    user_ages = User::AGES
    user_ages.shift

    it "should return blank for nil" do
      expect(user.age_range_display).to eq("")
    end

    user_ages.each do |age|
      it "should return proper range for #{age}" do
        user.age_range = age
        expect(user.age_range_display).to eq("#{age}-#{age + 4}")
      end
    end
  end

  describe "user_with comments" do
    before(:each) do
      @comments_count = 15
      @user = create(:user_with_comments, comments_count: @comments_count)
    end

    it "should have #{@comments_count} comments" do
      expect(@user.comments.size).to eq(@comments_count)
    end
  end

  describe "user with comments with votes" do
    it "should have 50 votes" do
      comments_count = 5
      votes_count = 10
      expected_votes = comments_count * votes_count
      user = create(:user_with_comments_with_votes, comments_count: comments_count, votes_count: votes_count)
      total_votes = user.comments.map(&:votes).flatten.size
      expect(total_votes).to eq(expected_votes)
    end
  end

end
