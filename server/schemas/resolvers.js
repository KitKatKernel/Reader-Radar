const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // Resolver for the 'me' query
    me: async (parent, args, context) => {
      // Check if user is authenticated
      if (context.user) {
        // Find and return user data
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      // If not authenticated, throw an error
      throw AuthenticationError;
    },
  },

  Mutation: {
    // Resolver for the addUser mutation
    addUser: async (parent, { username, email, password }) => {
      // Create a new user
      const user = await User.create({ username, email, password });
      // Sign a token for the new user
      const token = signToken(user);
      // Return the token and user data
      return { token, user };
    },

    // Resolver for the login mutation
    login: async (parent, { email, password }) => {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      // Check if the password is correct
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      // Sign a token for the authenticated user
      const token = signToken(user);
      // Return the token and user data
      return { token, user };
    },

    // Resolver for the saveBook mutation
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        // Add the book to the user's savedBooks array
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
      }
      throw AuthenticationError;
    },

    // Resolver for the removeBook mutation
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        // Remove the book from the user's savedBooks array
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;