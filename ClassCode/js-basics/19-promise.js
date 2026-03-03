// const allPromise = Promise.allSettled([
//   Promise.resolve("chaicode"),
//   Promise.resolve("Headquarter"),
//   Promise.reject("You are rejected"),
// ]);

// // allPromise.then(console.log);
// allPromise.then((data) => {
//   console.log(data);
// });
//
//
// ------------------------------------------------------
// const hPromise = new Promise((res, rej) => {
//   setTimeout(() => {
//     // res("Masterji");
//     rej(new Error("Ye Error hai"));
//   }, 3000);
// });

// function nice() {
//   hPromise.then((value) => {
//     setTimeout(() => {
//       console.log(value);
//     }, 4000);
//   });
// }
// nice();

// async function nice() {
//   const result = await hPromise;
//   console.log(result);
// }
// nice();

// const newResult = await hPromise;
// console.log(newResult);

// async function nice() {
//   try {
//     const result = await hPromise;
//     console.log(result);
//   } catch (error) {
//     console.log("Error ka code hai ji : ", error.message);
//   }
// }

// nice();

// ---------------------------------------------------------------------



