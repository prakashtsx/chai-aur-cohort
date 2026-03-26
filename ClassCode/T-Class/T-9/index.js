//! Part : 1

// const user1 = {
//     name: "Prakash",
//     score: 99,
//     increment() {
//         this.score++
//     }
// }

// const user2 = {
//     name: "chaicode",
//     score: 88,
//     increment() {
//         this.score++
//     }
// }

// user2.toString()

//! Part : 2

// const user2 = {
//     __proto__: user1
// }

// console.log(user2.name);

// let obj1 = { title: "Hello" }
// let obj2 = { title: "Ji" }

// obj2.__proto__ = obj1
// console.log(obj2.title);

// obj2.__proto__.title = "Hello world this edited from proto";
// console.log(obj1.title);
// console.log(obj2.title);


// ------------------------------------------------------------//

// const user1 = {
//     name: "Prakash",
//     score: 55,
//     increment() {
//         this.score++
//     }
// }

// const user2 = Object.create(user1);
// console.log(user2);


// ----------------------------------------------------- //

// ! Part : 3

function User(name, score) {
    this.name = name;
    this.score = score;
}

User.prototype.increment = function () {
    this.score++
}

const user1 = new User("Prakash", 99);
const user2 = new User("Angle Priya", 0)

user1.__proto__ === User.prototype;

// console.log(user1.name);
// console.log(user1.score);

// console.log(user2.name);
// console.log(user2.score);





