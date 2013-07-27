if (not @boards.blank?)
  collection @boards
  attributes :id, :name
end

#end
#child(:user) { attributes :full_name }
#node(:read) { |post| post.read_by?(@user) }