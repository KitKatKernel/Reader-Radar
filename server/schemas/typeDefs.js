const typeDefs = `
  # User type: Represents a user in the system
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  # Book type: Represents a book that can be saved by a user
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  # Auth type: Used for authentication responses
  type Auth {
    token: ID!
    user: User
  }

  # Query type: Defines the available queries
  type Query {
    # Retrieves the currently logged-in user
    me: User
  }

  # Mutation type: Defines the available mutations
  type Mutation {
    # Logs in a user
    login(email: String!, password: String!): Auth

    # Adds a new user
    addUser(username: String!, email: String!, password: String!): Auth

    # Saves a book to the user's list
    saveBook(authors: [String], description: String!, title: String!, bookId: String!, image: String, link: String): User

    # Removes a book from the user's list
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;