module.exports = {
    "up": "CREATE TABLE users (user_id INT NOT NULL AUTO_INCREMENT, UNIQUE KEY user_id (user_id), username TEXT, email TEXT, message VARCHAR(255), createdAt DATE, updatedAt DATE )",
    "down": "DROP TABLE users"
}