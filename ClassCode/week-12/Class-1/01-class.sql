CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    email VARCHAR(322) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    age INT CHECK (age >= 0),
    current_status VARCHAR(20) DEFAULT 'active' CHECK (current_status IN ('active', 'inactive', 'graduated')),
    masterji_handle VARCHAR(50) UNIQUE,
    has_joined_masterji BOOLEAN DEFAULT FALSE,
    current_score INT DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 100),
    enrollment_date DATE DEFAULT CURRENT_DATE
);


