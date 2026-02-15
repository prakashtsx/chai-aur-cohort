// There are different types of log levels :

console.log("Hello world"); //simple printing

console.warn("This is warning"); // printing warning

console.error("Error"); // printing error

const names = [
  {
    firstName: "Prakash",
    lastName: "Kumar",
    age: 22,
  },
];
console.table(names); // print the array of object in the form of tables

console.group("Group starts"); // printing in groups
console.log("log1");
console.log("log2");
console.log("log3");
console.log("log4");
console.groupEnd();

// console.time("Time start now");
// console.log("Time 1 ");
// console.timeEnd("end");

console.count("Prakash");
console.count("Prakash");
console.count("Prakash"); // How many times printing
