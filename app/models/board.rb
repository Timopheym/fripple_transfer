# encoding: UTF-8
class Board
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  Mongoid::Attributes::Dynamic
  has_many :items, validate: false
  field :name, :type => String
end