module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  transform: {
    '^.+\/*.(ts|tsx)?$': 'ts-jest'
  }
};
