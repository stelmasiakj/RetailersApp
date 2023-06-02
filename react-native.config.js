module.exports = {
  assets: ['./src/assets/fonts'],
  getSourceExts() {
    return ['ts', 'tsx'];
  },
  dependencies: {
    ...(process.env.NO_FLIPPER
      ? {'react-native-flipper': {platforms: {ios: null}}}
      : {}),
  },
};
