module.exports = {
    "up": "INSERT INTO users (username, email, message) VALUES ('John Snow', 'john.snow@gmail.com', '')",
    "down": "DELETE FROM users WHERE username = 'John Snow'"
}
