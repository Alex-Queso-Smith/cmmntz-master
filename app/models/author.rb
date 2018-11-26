class Author < ApplicationRecord
  include Fae::BaseModelConcern
  def fae_display_field
    name
  end

end
