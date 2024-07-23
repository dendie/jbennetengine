const fs = require('fs');
const path = require('path');

module.exports = {
  up: (queryInterface) => {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8');
    const searchForm = JSON.parse(data);

    return queryInterface.bulkInsert('users', searchForm);
  },

  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};