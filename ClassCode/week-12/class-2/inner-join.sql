-- Create the students and courses tables

CREATE TABLE students (
    id INT,
    name VARCHAR(50)
);

CREATE TABLE courses (
    id INT,
    course VARCHAR(50)
);


-- Insert some data into the students and courses tables

INSERT INTO students (id, name) VALUES
(1, 'Ram'),
(2, 'Shyam'),
(3, 'Mohan');

INSERT INTO courses (id, course) VALUES
(1, 'Math'),
(2, 'Science'),
(4, 'English');

-- Apply inner join 

SELECT students.name, courses.course
FROM students
INNER JOIN courses
ON students.id = courses.id;


/* -- Ouput --

name    | course
--------|--------
Ram     | Math
Shyam   | Science

*/