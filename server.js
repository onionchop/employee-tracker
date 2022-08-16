const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2');
const logo = require('asciiart-logo');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password123',
        database: 'company_db',
    },
    console.log(`Connected to the company_db database.`)
);

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const createDirectory = () => {

    console.log(
        logo({
            name: 'Employee Tracker',
            borderColor: 'white',
            logoColor: 'bold-white',
        })
            .render()
    );

    const directionQuestion = () => {
        inquirer
            .prompt(
                [{
                    type: 'list',
                    name: 'choice',
                    message: 'What would you like to do?',
                    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
                }

                ]
            )
            .then(answer => {
                switch (answer.choice) {
                    case 'View All Employees':
                        displayAllEmployees();
                        break;
                    case 'Add Employee':
                        createEmployee();
                        break;
                    case 'Update Employee Role':
                        updateEmployee();
                        break;
                    case 'View All Roles':
                        viewRoles();
                        break;
                    case 'Add Role':
                        addRole();
                        break;
                    case 'View All Departments':
                        viewDepartments();
                        break;
                    case 'Add Department':
                        addDepartment();
                        break;
                    case 'Quit':
                        break;
                }
            })
    }
    directionQuestion();
};


function createEmployee() {
    inquirer
        .prompt(
            [
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'input',
                    name: 'role_id',
                    message: "What is the employee's role id?",
                },
                {
                    type: 'confirm',
                    name: 'managerConfirm',
                    message: "Does this employee have a manager?",

                },
                {
                    type: 'input',
                    name: 'manager_id',
                    message: "What is the manager's name?",
                    when: (data) => {
                        if (data.managerConfirm === true) {
                            return true;
                        }
                    }
                },
            ])
            .then(data => {

                const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`;
                const values = [data.first_name, data.last_name, data.role_id, data.manager_id];
                db.query(sql, values, (err, res) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log('Added to database!')
                });
                createDirectory();
    
    
            });
    
    }


    function updateEmployee() {
        inquirer
            .prompt([
                {
                    type: 'number',
                    name: 'id',
                    message: "What is the employee's id?",
                },
                {
                    type: 'input',
                    name: 'role_id',
                    message: "What is the id of the employee's new role?",
    
    
                },
            ])
            .then(data => {
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                const values = [data.role_id, data.id];
    
                db.query(sql, values, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Role updated!")
                });
            
                createDirectory()
            });
    
    };


    function addRole() {

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: "What is the name of the new role?",
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: "What is the salary for this role?",
                },
                {
                    type: 'input',
                    name: 'department_id',
                    message: "What is the id of the department this role belongs to?",
                },
            ])
            .then(data => {
                const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`;
                const values = [data.title, data.salary, data.department_id];
                db.query(sql, values, (err, res) => {
                    if (err) {
                        console.error(err)
                    }
                    console.log("Role added!");
    
                });
                createDirectory()
            });
    
    
    };


    function addDepartment() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'department_name',
                    message: "What is the new department's name?",
                },
            ])
            .then(data => {
                const sql = `INSERT INTO department (department_name) VALUES (?);`;
                const value = data.department_name;
                db.query(sql, value, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Department Added!")
                });
    
                createDirectory();
            });
    
    };


    function displayAllEmployees() {
        const sql = `SELECT employee.id, 
            employee.first_name,
            employee.last_name, 
            roles.title, 
            roles.salary, 
            department.department_name, 
            CONCAT(manager.first_name, ' ', manager.last_name) 
            AS MANAGER
            FROM employee employee
            LEFT JOIN employee manager
            ON employee.manager_id = manager.id
            JOIN roles
            ON roles.id=employee.role_id
            JOIN department
            ON roles.department_id = department.id; `;
        db.query(sql, (err, res) => {
            console.table(res);
    
        });
        createDirectory()
    };


    function viewRoles() {
        const sql = ` SELECT 
            roles.title,
             roles.id, 
             roles.salary,
            department.department_name
            FROM roles
            RIGHT JOIN department
            ON roles.department_id = department.id
             ;`;
        db.query(sql, (err, res) => {
            try {
                if (res) {
                    console.table(res);
                }
            }
            catch (err) {
                console.error(err)
            };
        });
        createDirectory()
    };

    function viewDepartments() {
        const sql = `SELECT * FROM department;`;
        db.query(sql, (err, res) => {
            try {
                if (res) {
                    console.table(res);
                }
            } catch (err) {
                console.error(err)
            };
        });
        createDirectory()
    };


    function employeeUpdateQuery({ id, role }) {
        
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            const values = (role_id, id);
        
            db.query(sql, values, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("Role updated!")
            });
            createDirectory()
        };


        createDirectory();

