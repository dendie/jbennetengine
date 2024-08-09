module.exports = {
    "up": "INSERT INTO users (name, email, phone, message) VALUES ('John Snow', 'john.snow@gmail.com', '0812212021', '')",
    "down": "DELETE FROM users WHERE name = 'John Snow'"
}
