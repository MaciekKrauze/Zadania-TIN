

class Person {

    constructor(name, age, city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }


    greet() {
        return "Hello my name is " + this.name + " and I am "
            + this.age + " years old. I live in" + this.city;
    }

    canVote() {
        return this.age > 18;
    }
    changeCity(newCity){
        this.city = newCity;
    }
}

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    getArea(){
        return this.width * this.height;
    }
    getPerimeter(){
        return (2 * this.width) + (2 * this.height);
    }
    isSquare(){
        return this.width === this.height;
    }


}

class Library {

    constructor() {
        this.books = [];
    }

    addBook(title, author){
        let isAvailable = true;
        let book = {title, author, isAvailable}

        this.books.push(book);
    }
    borrowBook(title){
        let index = this.books.findIndex(book => book.title === title);
        if (this.books[index].isAvailable === true){
            this.books[index].isAvailable = false;
        }
        else {
            console.log("This book is currently not available.")
        }

    }
    returnBook(title){
        let index = this.books.findIndex(book => book.title === title);
        if (this.books[index].isAvailable === false){
            this.books[index].isAvailable = true;
        }
        else {
            console.log("This book is already in the library.")
        }

    }
}

const filterStringsByLength = function (strings, min){
    return strings.filter(string => string.length > min);
}

const calculateTotalPrice = function (products) {
    return products.reduce((total, product) => {
        return total + product.cena;
    }, 0);
}

const findMostExpensiveProduct = function(orders) {
    return orders.reduce((max, order) => {
        return order.cena > max.cena ? order : max;
    }, orders[0]);
};

class Animal{
    constructor(name) {
        this.name = name;
    }
    speak(){
        return  "Jestem zwierzęciem."
    }
}
class Dog extends Animal{

    fetch(item){
        return name + " aportuje " + item;
    }
}

class Employee {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }

    getDetails() {
        return `Pracownik: ${this.name}, Pensja: ${this.salary}`;
    }
}
class Manager extends Employee {
    constructor(name, salary, department) {
        super(name, salary);
        this.department = department;
    }

    getDetails() {
        return `Kierownik: ${this.name}, Pensja: ${this.salary}, Dział: ${this.department}`;
    }
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.introduce = function() {
    return `Cześć, jestem ${this.name}, mam ${this.age} lat.`;
};

function Student(name, age, major) {
    Person.call(this, name, age);
    this.major = major;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.study = function() {
    return `${this.name} studiuje ${this.major}.`;
};

function Teacher(name, age, subject) {
    Person.call(this, name, age); // wywołanie konstruktora Person
    this.subject = subject;
}

Teacher.prototype = Object.create(Person.prototype);
Teacher.prototype.constructor = Teacher;

Teacher.prototype.teach = function() {
    return `${this.name} uczy ${this.subject}.`;
};




function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    return this.name + ' makes a noise.';
};

function Mammal(name, furColor) {
    Animal.call(this, name);
    this.furColor = furColor;
}

Mammal.prototype = Object.create(Animal.prototype);
Mammal.prototype.constructor = Mammal;

function Dog(name, furColor) {
    Mammal.call(this, name, furColor);
}

Dog.prototype = Object.create(Mammal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.fetch = function() {
    return this.name + ' fetches.';
};

//Zadanie 1
// let person = new Person("Maciej", 20, "Reda");
// console.log(person.canVote());
// console.log(person.greet());
// person.changeCity("Rumia");
// console.log(person.city);

//Zadanie 2

//Zadanie 3

//Zadanie 4

//Zadanie 5

//Zadanie 6

//Zadanie 7

//Zadanie 8

//Zadanie 9

//Zadanie 10




