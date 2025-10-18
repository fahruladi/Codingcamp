const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task");
const dateInput = document.getElementById("date");
const list = document.getElementById("todo-list");
const search = document.getElementById("search");
const clear = document.getElementById("clear");

let todos = JSON.parse(localStorage.getItem("simple_buddy_todos")) || [];

document.addEventListener("DOMContentLoaded", render);

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const date = dateInput.value;
  if (!text) return;
  todos.push({ id: Date.now(), text, date, done: false });
  save();
  render();
  form.reset();
});

function render() {
  list.innerHTML = "";
  const query = search.value.toLowerCase();
  todos
    .filter(t => t.text.toLowerCase().includes(query))
    .forEach(todo => {
      const li = document.createElement("li");
      if (todo.done) li.classList.add("completed");

      li.innerHTML = `
        <span>${todo.text}${todo.date ? ` <small>(${todo.date})</small>` : ""}</span>
        <div class="actions-btn">
          <button class="done">${todo.done ? "↩" : "✔"}</button>
          <button class="delete">🗑</button>
        </div>
      `;

      li.querySelector(".done").addEventListener("click", () => {
        todo.done = !todo.done;
        save(); render();
      });
      li.querySelector(".delete").addEventListener("click", () => {
        todos = todos.filter(t => t.id !== todo.id);
        save(); render();
      });

      list.appendChild(li);
    });
}

search.addEventListener("input", render);
clear.addEventListener("click", () => {
  if (confirm("Clear all tasks?")) {
    todos = [];
    save(); render();
  }
});

function save() {
  localStorage.setItem("simple_buddy_todos", JSON.stringify(todos));
}
