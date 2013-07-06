collection @boards
attributes :id, :name
#child(:user) { attributes :full_name }
#node(:read) { |post| post.read_by?(@user) }