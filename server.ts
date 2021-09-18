import app from './src/app';

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
