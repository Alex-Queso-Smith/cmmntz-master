require 'rails_helper'

RSpec.describe User, type: :model do
  describe "validation" do
    let!(:user) { FactoryBot.build_stubbed(:user) }

    it "is valid with valid inputs" do
      expect(user).to be_valid
    end

    attrs = %w(user_name password_confirmation)

    attrs.each do |att|
      it "is invalid with #{att} blank" do
        user.send("#{att}=".to_sym, nil)
        expect(user).to_not be_valid
      end
    end

    describe "password validations" do
      # authlogic does not allow password to be blanked....
      it "is invalid with password blank" do
        user_no_password = FactoryBot.build_stubbed(:user, password: "")
        expect(user_no_password).to_not be_valid
      end

      it "should be invalid if password and password_confirmation do not match" do
        user.password = "123Abcd"
        user.password_confirmation = "123acbD"
        expect(user).to_not be_valid
      end

      it "is invalid with greater than 32 characters" do
        user.password = "Abc456789012345678901234567890123"
        user.password_confirmation = "Abc456789012345678901234567890123"
        expect(user).to_not be_valid
      end

      it "is invalid with less than 6 characters" do
        user.password = "Abc45"
        user.password_confirmation = "Abc45"
        expect(user).to_not be_valid
      end

      # Disabled for the MVP
      # it "should be invalid without at least 1 capital_letter" do
      #   user.password = "abc4567"
      #   user.password_confirmation = "abc4567"
      #   expect(user).to_not be_valid
      # end

      # Disabled for the MVP
      # it "should be invalid without at least 1 integer" do
      #   user.password = "abcdefg"
      #   user.password_confirmation = "abcdefg"
      #   expect(user).to_not be_valid
      # end

    end

    describe "gender validations" do
      User::GENDERS.each do |x|
        it "gender is valid with correct input #{x}" do
          user.gender = x
          expect(user).to be_valid
        end
      end

      invalid_gender_array = [3, "a", "b", "c"]

      invalid_gender_array.each do |x|
        it "should be invalid with invalid input #{x} for gender" do
          user.gender = x
          expect(user).to_not be_valid
        end
      end
    end

    describe "age validations" do
      User::AGES.each do |x|
        it "should be valid with valid input #{x} for age" do
          user.age_range = x
          expect(user).to be_valid
        end
      end

      invalid_age_array = [34, 567, 2, 99, 500, "a", "bif"]

      invalid_age_array.each do |x|
        it "should be invalid with invalid input #{x} for age" do
          user.age_range = x
          expect(user).to_not be_valid
        end
      end
    end

    describe "coordinate validations" do
      invalid_coordinates = { lat1: -198.00, long1: 340.56, lat2: 130.45, long2: 198.34, lat3: -193.00, long3: 25.98 }
      valid_coordinates =  { lat1: -178.00, long1: 40.56, lat2: 130.45, long2: 98.34, lat3: -13.00, long3: 25.98 }

      [1, 2, 3].each do |x|
        it "should be valid with set #{x}" do
          user.latitude = valid_coordinates["lat#{x}".to_sym]
          user.longitude = valid_coordinates["long#{x}".to_sym]

          expect(user).to be_valid
        end
      end

      it "should be invalid with just lat" do
        user.latitude = 123.45
        user.longitude = nil

        expect(user).to_not be_valid
      end

      it "should be invalid with just long" do
        user.latitude = nil
        user.longitude = 123.45

        expect(user).to_not be_valid
      end

      [1, 2, 3].each do |x|
        it "should be invalid with bad coordinates set #{x}" do
          user.latitude = invalid_coordinates["lat#{x}".to_sym]
          user.longitude = invalid_coordinates["long#{x}".to_sym]

          expect(user).to_not be_valid
        end
      end
    end

    describe "email validations" do
      it "should be invalid with invalid email" do
        user.email = "invalid"
        expect(user).to_not be_valid
      end
    end

    # pending "avatar validations"
  end

  describe "basic user gender functionality" do
    let!(:user) { FactoryBot.build_stubbed(:user) }

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
    let!(:user) { FactoryBot.build_stubbed(:user) }

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

  describe "user with comments" do
    # testing the factory
    it "should have 15 comments when asked for 15 comments" do
      user = create(:user_with_comments, comments_count: 15)
      expect(user.comments.size).to eq(15)
    end
  end

  describe "user with comments with votes" do
    # testing the factory
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
