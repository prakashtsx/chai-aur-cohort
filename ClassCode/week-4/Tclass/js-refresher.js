"use strict"
// Hello world 
console.log("hello world");

// ! This is comments
// This is comments , which we need to put in our code to understand it better
//* Single line comments
/* 
Multi line comment 
We can write mulitiple comment 
Line 1
Line 2
*/

function sum(a, b) {
    return a + b;
}

console.log(sum(4, 5))


//!  variables :  kitchen different boxes  (container which hold different type of data)

let name = 'I am variable';
let myFavLang;
myFavLang = 'JavaScript';
console.log(myFavLang);

myFavLang = 'Typescript';
console.log(myFavLang);

//! Idenetifiers
/*
let function = "Prakash" ;
let this = "Prakash"  // These are the reserved keywords
*/

// let cool = "I am cool";
// let COOL = "I am cool"; // both are different

// const g = 9.84;
// g = ' o ji';
// console.log(g);


// UPPERCASE CONST : THROUGH OUT PROGRAM YOUR VALUE ARE GOING TO BE CONSTANT
const vDay = '14 feb';

const days = "days from VDay";

//! data types 
// 1. Numbers : Integer , float
let myNum = 20.5;
console.log(myNum);

// INFINITY , -INFINITY and NaN(Not a Number)
console.log(1 / 0);
console.log(6 / "Not a number");
console.log(NaN ** 0);



// * BigInt 
// 2^ 53 -1 = 90071.....
// same for negative 
// so we use bigint 

let bigBalance = 90071992547409984559584958n;

//! String 

let single = 'I am single';
let double = "I am double";
let backtick = ` String interpolation`;

let naam = "Prakash";
console.log(`My name is ${naam}`);
console.log(` 2+ 2 is ${2 + 2}`);

console.log("HELLO WORLD".toLowerCase());


//! Boolean 
let isPassed = true;
let piyusIsSingle = false;

//! Null -- Khali  , I am saying by default it is empty (empty,unknown)
let partner = null;

// ! Undefined : Value not assigned

let bodyCount;