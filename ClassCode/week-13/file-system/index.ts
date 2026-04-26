import fs from "node:fs";

// 1. WRITE
fs.writeFileSync("test.txt", "Hello my name is Prakash");

// 2. READ
const data = fs.readFileSync("test.txt", "utf-8");
console.log(data);

// 3. APPEND
fs.appendFileSync("test.txt", "\nI am a student");

// 4. MAKING FOLDER
fs.mkdirSync("folder");
fs.mkdirSync("newFolder/insideFolder", { recursive: true });
