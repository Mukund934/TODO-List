// Getting all required elements
const inputField = document.querySelector("#todo-input"),
    todoLists = document.querySelector(".todoLists"),
    pendingNum = document.querySelector(".pending-num"),
    clearButton = document.querySelector(".clear-button");

// Load saved tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("todos")) || [];
    tasks.forEach(task => addTaskToList(task.text, task.isCompleted));
    allTasks();
}

// Update localStorage
function updateLocalStorage() {
    const tasks = [...document.querySelectorAll(".list")].map(listItem => ({
        text: listItem.querySelector(".task").textContent,
        isCompleted: listItem.classList.contains("completed")
    }));
    localStorage.setItem("todos", JSON.stringify(tasks));
}

// Adding task
inputField.addEventListener("keyup", (e) => {
    const inputVal = inputField.value.trim();
    if (e.key === "Enter" && inputVal.length > 0) {
        addTaskToList(inputVal);
        inputField.value = "";
    }
});

function addTaskToList(taskText, isCompleted = false) {
    const liTag = document.createElement('li');
    liTag.classList.add('list');
    if (isCompleted) liTag.classList.add('completed');

    liTag.innerHTML = `
        <input type="checkbox" ${isCompleted ? "checked" : ""} onclick="toggleTaskStatus(this)">
        <span class="task">${taskText}</span>
        <button class="delete-btn" onclick="deleteTask(this)">X</button>
    `;
    liTag.addEventListener('dblclick', editTask);
    todoLists.appendChild(liTag);
    liTag.classList.add('fade-in');
    allTasks();
    updateLocalStorage();
}

// Edit task
function editTask(e) {
    const task = e.target.querySelector(".task");
    if (task) {
        const newTaskText = prompt("Edit task", task.textContent);
        if (newTaskText !== null) {
            task.textContent = newTaskText.trim();
            updateLocalStorage();
        }
    }
}

// Toggle task status
function toggleTaskStatus(checkbox) {
    const taskElement = checkbox.closest(".list");
    taskElement.classList.toggle("completed");
    allTasks();
    updateLocalStorage();
}

// Delete task
function deleteTask(btn) {
    btn.closest(".list").remove();
    allTasks();
    updateLocalStorage();
}

// Clear all tasks
clearButton.addEventListener("click", () => {
    todoLists.innerHTML = "";
    allTasks();
    updateLocalStorage();
});

// Update pending tasks and button states
function allTasks() {
    const tasks = document.querySelectorAll(".list:not(.completed)");
    pendingNum.textContent = tasks.length === 0 ? "no" : tasks.length;
    clearButton.disabled = document.querySelectorAll(".list").length === 0;
}
