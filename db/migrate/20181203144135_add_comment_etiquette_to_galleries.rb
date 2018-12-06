class AddCommentEtiquetteToGalleries < ActiveRecord::Migration[5.2]
  def change
    add_column :galleries, :comment_etiquette, :text
  end
end
