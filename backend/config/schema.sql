-- schema.sql - VERSION CORRIGÉE

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,  
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE, 
    pseudo VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS missions (
    missions_id BIGINT PRIMARY KEY,
    employeId VARCHAR(255) NOT NULL,
    clientId VARCHAR(255) NOT NULL,
    adresseId VARCHAR(255) NOT NULL,
    status ENUM('attente', 'cours', 'fini') DEFAULT 'attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS missions_objects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    missions_id BIGINT NOT NULL,
    objects VARCHAR(255) NOT NULL,
    FOREIGN KEY (missions_id) REFERENCES missions(missions_id) ON DELETE CASCADE
);

INSERT INTO users (username, password, isAdmin, pseudo) 
VALUES ('aze', '$2b$10$vAHoKw7mhutW0cn4wjxQSe9KbSO4mQUkgwMlgbNNlcJKJONDiZB9q', TRUE, "aze")
ON DUPLICATE KEY UPDATE username=username;

CREATE INDEX idx_missions_employee ON missions(employeId);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_objects_mission ON missions_objects(missions_id);