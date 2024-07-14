Table User {
  _id ObjectId [pk]
  name String
  username String [unique]
  email String [unique]
  password String
  profilePic String
  followers Array
  following Array
  bio String
  createdAt String
  updatedAt String 
}

Table Comment {
  _id ObjectId [pk]
  postedBy ObjectId [ref: > User._id]
  repliedPost ObjectId [ref: > Post._id]
  repliedComment ObjectId [ref: > Comment._id]
  likes Array [ref: > User._id]
  text String
  img String
  comments Array [ref: > Comment._id]
  username String
  userProfilePic String
  createdAt String
  updatedAt String 
}

Table Post {
  _id ObjectId [pk]
  postedBy ObjectId [ref: > User._id]
  text String
  img String
  likes Array [ref: > User._id]
  replies Array [ref: > Comment._id]
  createdAt String
  updatedAt String 
}

Table Conversation {
  _id ObjectId [pk]
  title String
  participants Array [ref: > User._id]
  lastMessage Object
  createdAt String
  updatedAt String 
}

Table Message {
  _id ObjectId [pk]
  conversationId ObjectId [ref: > Conversation._id]
  senderId ObjectId [ref: > User._id]
  content String
  type String [default: "text"]
  createdAt String
  updatedAt String 
}

Table Attachement {
  _id ObjectId [pk]
  messageId ObjectId [ref: > Message._id]
  fileName String
  fileUrl String
  fileType String
  createdAt String
  updatedAt String 
}