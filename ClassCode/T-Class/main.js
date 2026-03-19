const btn = document.getElementById("btn");

// btn.onclick = function () {
//     console.log("Hello world from dom");
// }

// btn.onclick = function () {
//     console.log("Hello world from dom 2");
// }

const parent = document.getElementById("parent");
const child = document.getElementById("child")
const body = document.body;

body.addEventListener("click", function () {
    console.log('Body Clicked !');

})


child.addEventListener("click", function () {
    console.log("parent Clicked !");
})

parent.addEventListener("click", function () {
    console.log("parent Clicked !");
})