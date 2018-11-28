class CreateCtTopics < ActiveRecord::Migration[5.2]
  def change
    create_table :ct_topics, id: :uuid do |t|
      t.string :name

      t.timestamps
    end
  end
end
