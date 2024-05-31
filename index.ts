#! usr/bin/ env node
import * as readline from 'readline';
import inquirer from 'inquirer';

class Student {
    private static idCounter: number = 0;
    private studentID: string;
    private name: string;
    private courses: string[];
    private tuitionBalance: number;
    private static readonly courseCost: number = 500;

    constructor(name: string) {
        this.name = name;
        this.studentID = this.generateStudentID();
        this.courses = [];
        this.tuitionBalance = 0;
    }

    private generateStudentID(): string {
        Student.idCounter += 1;
        return Student.idCounter.toString().padStart(5, '0');
    }

    enroll(course: string): void {
        this.courses.push(course);
        this.tuitionBalance += Student.courseCost;
        console.log(`${this.name} has been enrolled in ${course}`);
    }

    viewBalance(): void {
        console.log(`The balance for ${this.name} (ID: ${this.studentID}) is $${this.tuitionBalance}`);
    }

    payTuition(amount: number): void {
        if (amount <= 0) {
            console.log('Payment amount must be positive.');
            return;
        }
        if (amount > this.tuitionBalance) {
            console.log(`Cannot pay more than the current balance of $${this.tuitionBalance}`);
            return;
        }
        this.tuitionBalance -= amount;
        console.log(`${this.name} has paid $${amount}. Current balance is $${this.tuitionBalance}`);
    }

    showStatus(): void {
        console.log(`\nStudent Name: ${this.name}`);
        console.log(`Student ID: ${this.studentID}`);
        console.log(`Courses Enrolled: ${this.courses.join(', ')}`);
        console.log(`Tuition Balance: $${this.tuitionBalance}`);
    }
}

class StudentManagementSystem {
    private students: Student[];

    constructor() {
        this.students = [];
    }

    addStudent(name: string): void {
        const student = new Student(name);
        this.students.push(student);
        console.log(`Student ${name} with ID ${student['studentID']} has been added.`);
    }

    getStudentByID(studentID: string): Student | undefined {
        return this.students.find(student => student['studentID'] === studentID);
    }

    enrollStudent(studentID: string, course: string): void {
        const student = this.getStudentByID(studentID);
        if (student) {
            student.enroll(course);
        } else {
            console.log(`Student with ID ${studentID} not found.`);
        }
    }

    viewStudentBalance(studentID: string): void {
        const student = this.getStudentByID(studentID);
        if (student) {
            student.viewBalance();
        } else {
            console.log(`Student with ID ${studentID} not found.`);
        }
    }

    payStudentTuition(studentID: string, amount: number): void {
        const student = this.getStudentByID(studentID);
        if (student) {
            student.payTuition(amount);
        } else {
            console.log(`Student with ID ${studentID} not found.`);
        }
    }

    showStudentStatus(studentID: string): void {
        const student = this.getStudentByID(studentID);
        if (student) {
            student.showStatus();
        } else {
            console.log(`Student with ID ${studentID} not found.`);
        }
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sms = new StudentManagementSystem();

async function main() {
    console.log('\nStudent Management System');
    while (true) {
        const { choice } = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: 'Options:',
            choices: [
                { name: '1. Add Student', value: '1' },
                { name: '2. Enroll in Course', value: '2' },
                { name: '3. View Balance', value: '3' },
                { name: '4. Pay Tuition', value: '4' },
                { name: '5. Show Status', value: '5' },
                { name: '6. Exit', value: '6' }
            ]
        });

        switch (choice) {
            case '1':
                const { name } = await inquirer.prompt({
                    type: 'input',
                    name: 'name',
                    message: 'Enter Student name: '
                });
                sms.addStudent(name);
                break;
            case '2':
                var { id: enrollId } = await inquirer.prompt({
                    type: 'input',
                    name: 'id',
                    message: 'Enter student id: '
                });
                const { course } = await inquirer.prompt({
                    type: 'input',
                    name: 'course',
                    message: 'Enter course name: '
                });
                sms.enrollStudent(enrollId, course);
                break;
            case '3':
                var { id: balanceId } = await inquirer.prompt({
                    type: 'input',
                    name: 'id',
                    message: 'Enter student id: '
                });
                sms.viewStudentBalance(balanceId);
                break;
            case '4':
                var { id: payId } = await inquirer.prompt({
                    type: 'input',
                    name: 'id',
                    message: 'Enter student id: '
                });
                var { amount } = await inquirer.prompt({
                    type: 'input',
                    name: 'amount',
                    message: 'Enter payment amount: ',
                    validate: input => {
                        if (isNaN(input) || Number(input) <= 0) {
                            return 'Please enter a valid positive number.';
                        }
                        return true;
                    }
                });
                sms.payStudentTuition(payId, Number(amount));
                break;
            case '5':
                var { id: statusId } = await inquirer.prompt({
                    type: 'input',
                    name: 'id',
                    message: 'Enter student id: '
                });
                sms.showStudentStatus(statusId);
                break;
            case '6':
                console.log('Exiting the program \n');
                rl.close();
                return;
            default:
                console.log("Invalid choice. Please select again.");
        }
    }
}

main();
