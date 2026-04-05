-- This sql query is used to update the students table by adding a new column called batch_name with a default value of 'web Dev 2026'.

ALTER TABLE students 
ADD COLUMN batch_name VARCHAR(50) DEFAULT 'web Dev 2026';

SELECT * FROM students;