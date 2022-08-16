INSERT INTO department (department_name)
VALUES ("Accounting"),
        ("Marketing"),
        ("IT"),
        ("Legal"),
        ("Research and Developement");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Accountant", 95000, 1),
        ("Social Media Intern", 25000, 2),
        ("Developer", 125000, 3),
        ("Counsel", 195000, 4),
        ("Researcher", 75000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Daniel', 'Banks', 2, null),
        (2,'Eddie', 'Kaplan', 3, null),
        (3,'Mars','Castillo', 4, 1),
        (4, 'Jake', 'Park', 3, 4),
        (5, 'Danny', 'Johnson', 4, 2),
        (6,'Stevie', 'Kish', 1, 5),
        (7,'Jeff', 'Johhanson', 5, 7);