module.exports = {
  transformIgnorePatterns: [
    "node_modules/(?!(redux-persist-expo-securestore)/)",
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};