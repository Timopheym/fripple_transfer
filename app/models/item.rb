class Item
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  belongs_to :board
  field :color, :type => String
  field :shape, :type => String
  field :type, :type => String
  field :index, :type => Integer
  field :radius, :type => Integer
  field :x, :type => Integer
  field :y, :type => Integer
end