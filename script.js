import { taskList } from "./variables.js";

const input = document.querySelector("#input");
const submitButton = document.querySelector("#submit");
const toDoList = document.querySelector("#toDoList");
const totalTask = document.querySelector(".total");
const deleteAllButton = document.getElementById("deleteAll");

const rederTask = () => {
  if (taskList) {
    let task = "";
    taskList.map((item) => {
      task += `
      <ul>
        <li
          id=${item.id}
          class="taskItem flex gap-2 items-center py-4 hover:cursor-pointer hover:bg-gray-100 hover:rounded-b-lg px-8 overflow-hidden"
        >
          <input type="checkbox" title="check" class="size-4 hover:cursor-pointer"/>
          <p class="">${item.context}</p>
          <svg class="deleteIcon w-6 h-6 hover:text-red-400 text-gray-400 ml-auto block md:hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
          </svg>
        </li>
      </ul>
    `;
    });
    toDoList.innerHTML = task;
    const taskItem = document.querySelectorAll("ul .taskItem");

    if (taskItem) {
      taskItem.forEach((item) => {
        const deleteIcon = item.querySelector(".deleteIcon");
        const checkInput = item.querySelector("input");
        const context = item.querySelector("p");
        const foundTaskIndex = taskList.findIndex(
          (task) => task.id === Number(item.id)
        );
        if (foundTaskIndex !== -1) {
          checkInput.checked = taskList[foundTaskIndex].completed;
        }
        if (checkInput.checked) {
          context.classList.add("line-through", "opacity-50");
        } else {
          context.classList.remove("line-through", "opacity-50");
        }
        item.addEventListener("mouseover", () => {
          deleteIcon.classList.remove("md:hidden");
          deleteIcon.classList.add("md:block");
        });
        item.addEventListener("mouseout", () => {
          deleteIcon.classList.add("md:hidden");
          deleteIcon.classList.remove("md:block");
        });
        item.addEventListener("click", () => {
          checkInput.checked = !checkInput.checked;
          console.log(foundTaskIndex);

          if (foundTaskIndex !== -1) {
            taskList[foundTaskIndex].completed =
              !taskList[foundTaskIndex].completed;
            if (checkInput.checked) {
              context.classList.add("line-through", "opacity-50");
            } else {
              context.classList.remove("line-through", "opacity-50");
            }
          }

          localStorage.setItem("taskList", JSON.stringify(taskList));
        });
        deleteIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteTask(Number(item.id));
        });
      });
    }
  }
  totalTask.innerHTML = `Total: ${taskList.length}`;
};

rederTask();

const addTask = () => {
  if (input.value === "") {
    input.placeholder = "Please enter new task";
    input.classList.add("placeholder:text-red-500");
  } else {
    const newTask = {
      id: taskList.length + 1,
      context: input.value.trim(),
      completed: false,
    };
    taskList.unshift(newTask);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    input.value = "";
    input.placeholder = "Add a new to do";
    input.classList.remove("placeholder:text-red-500");
    rederTask();
  }
};

const deleteTask = (id) => {
  const foundTaskIndex = taskList.findIndex((item) => item.id === id);
  if (foundTaskIndex === -1) return;
  taskList.splice(foundTaskIndex, 1);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  rederTask();
};

deleteAllButton.addEventListener("click", () => {
  taskList.length = 0;
  localStorage.removeItem("taskList");
  rederTask();
});

submitButton.addEventListener("click", () => {
  addTask();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});
