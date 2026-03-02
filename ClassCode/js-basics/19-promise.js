const promise = new Promise((res, rej) => {
  setTimeout(() => {
    res("chaicode");
  }, 2000);
});
console.log(promise);
// setTimeout(() => {
//   console.log(promise);
// }, 3000); // this will run after 3 sec.
promise.then((value) => {
  console.log(value);
}); // res ki data value
