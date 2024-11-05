// Explicitly load the backend/.env file
require('dotenv').config({ path: './backend/.env' });

// Confirm if the variables are loaded correctly
console.log('Loaded from Jest setup:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
