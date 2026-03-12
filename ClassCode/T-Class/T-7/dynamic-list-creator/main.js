const input = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("li");

addBtn.addEventListener("click", () => {
    if (input.value === "") {
        alert("Mat kar lalla")
        return;
    }

    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete ❌";
    delBtn.classList.add("delete");
    li.textContent = input.value;
    li.appendChild(delBtn);

    delBtn.addEventListener("click", () => {
        li.remove()
    })

    list.appendChild(li);
    input.value = "";
})