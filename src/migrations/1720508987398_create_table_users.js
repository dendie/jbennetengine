module.exports = {
    "up": "CREATE TABLE mysql_migrations_347ertt3e (user_id INT NOT NULL, UNIQUE KEY user_id (user_id), username TEXT, email TEXT, phone TEXT, message VARCHAR(255), createdAt DATE, updatedAt DATE )",
    "down": ""
}