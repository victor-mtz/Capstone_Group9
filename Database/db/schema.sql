CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

CREATE TABLE user_images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    image_data TEXT,
    image_text TEXT
);