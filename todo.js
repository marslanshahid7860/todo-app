// task model
// {
//   id: number,
//   title: string,
//   isCompleted: boolean,
//   createdAt: DateTime
// }

const tasksList = [];
let isEditable = false;
let activeindex = -1;
let isCompleted = false;
let taskId = 0;

const userInput = document.getElementById('user-input');
const selectAll = document.getElementById("select-all");
const filtersDropdown = document.getElementById("filters-dropdown");
const list = document.querySelector(".tasks-list");

const keyPressListener = (event) => {
    if (event.key === "Enter") {
        const { value } = document.getElementById('user-input');
        // validation
        if (value === "") {
            alert('Please enter some text.');
            return;
        }

        const task = tasksList.find((t) => t.title === value);
        if (task) {
            alert('This item already exist.');
            return;
        }

        if (!isEditable) {
            addTask(value);
        } else {
            updateText(value);
        }
    };


};
document.addEventListener('keypress', keyPressListener);

const addTask = (taskText) => {
    // create an object for the new task
    const obj = {
        id: ++taskId,
        title: taskText,
        isCompleted: false,
        createdAt: new Date().toLocaleDateString(),
    };
    tasksList.push(obj);
    console.log(tasksList)

    setTaskItemUI(obj);

    resetInputField();
}

const updateTask = (id) => {
    const currentTask = tasksList.find((t) => t.id === id);
    userInput.value = currentTask.title;
    isEditable = true;
    activeId = id;
};

// values modification in terms of UI
const updateText = (taskText) => {
    const currentTask = tasksList.find((t) => t.id === activeId);

    currentTask.title = taskText;

    const activeSpan = document.querySelector(`#item_${activeId} span`)

    activeSpan.innerText = taskText;

    isEditable = false;

    resetInputField();
};
const resetInputField = () => {
    // clearInputField
    userInput.value = "";
}

// mark as complete functionality
const markAsComplete = (id) => {

    const currentTask = tasksList.find((t) => t.id === id);
    // const currentState = currentTask.isCompleted
    currentTask.isCompleted = !currentTask.isCompleted

    // get desired list item
    const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);

    activeCheckbox.classList.toggle("checkbox-filled");

    const currentTaskItem = document.querySelector(`#item_${id}`);
    currentTaskItem.classList.toggle("completed");

    // check the mark as complete functionality work properly or not.
    // console.log(tasksList);

}
const markItemAsComplete = (id) => {
    const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);
    const currentTaskItem = document.querySelector(`#item_${id}`);

    activeCheckbox.classList.add("checkbox-filled");
    currentTaskItem.classList.add("completed");
};

const markItemAsInComplete = (id) => {
    const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);
    const currentTaskItem = document.querySelector(`#item_${id}`);

    activeCheckbox.classList.remove("checkbox-filled");
    currentTaskItem.classList.remove("completed");
};

const handleSelectAllChange = (event) => {
    const { checked } = event.target;

    tasksList.forEach((t) => {
        t.isCompleted = checked;
        const activeCheckbox = document.querySelector(`#item_${t.id} .checkbox`);
        const currentTaskItem = document.querySelector(`#item_${t.id}`);

        // SELECT ALL
        if (checked) {
            activeCheckbox.classList.add("checkbox-filled");
            currentTaskItem.classList.add("completed");
        } else {
            activeCheckbox.classList.remove("checkbox-filled");
            currentTaskItem.classList.remove("completed");
        }
        //   checked
        //     ? activeCheckbox.classList.add("checkbox-filled")
        //     : activeCheckbox.classList.remove("checkbox-filled");

        //   checked
        //     ? currentTaskItem.classList.add("completed")
        //     : currentTaskItem.classList.remove("completed");
    });
};

selectAll.addEventListener("change", handleSelectAllChange);

const handleFiltersChange = (event) => {
    const { value } = event.target;

    //  completed | pending | All 

    switch (value) {
        case "all":
            list.innerHTML = "";

            tasksList.forEach((t) => {
                setTaskItemUI(t);
                if (t.isCompleted) {
                    markItemAsComplete(t.id);
                } else {
                    markItemAsInComplete(t.id);
                }

            });
            break;
        case "completed":
            // tasksList.filter(t => t.isCompleted)
            const completedTasks = tasksList.filter((t) => t.isCompleted === true);
            list.innerHTML = "";

            completedTasks.forEach((t) => {
                setTaskItemUI(t);
                markItemAsComplete(t.id);
            });

            if (completedTasks.length === 0) {
                list.innerHTML = "<p><i>There are no completed tasks</i><p>";
            }

            break;
        case "pending":
            // const pendingTasks = tasksList.filter((t) => !t.isCompleted);
            const pendingTasks = tasksList.filter((t) => t.isCompleted === false);
            list.innerHTML = "";

            pendingTasks.forEach((t) => {
                setTaskItemUI(t);
                markItemAsInComplete(t.id);
            });
            break;

        default:
            console.log("all");
            break;
    }
}

filtersDropdown.addEventListener("change", handleFiltersChange);

const setTaskItemUI = (obj) => {
    const currentId = obj.id;
    // create a new list item (li)
    const taskItem = document.createElement("li");
    // taskItem.classList.add("task-item")
    taskItem.className = "task-item";
    taskItem.id = `item_${currentId}`;
    // inner text set
    taskItem.innerHTML = `<div class="checkbox" onclick="markAsComplete(${currentId})"></div>
    <span>${obj.title}
    </span>
    <button id="edit_${currentId}" onclick="updateTask(${currentId})">Edit</button>
    <button onclick="deleteTask(${currentId})">Delete</button>`;

    // append the new li to existing ul
    list.appendChild(taskItem);
};

const deleteTask = (id) => {
    const isAllowed = confirm("Are you sure you want to delete this task?");

    if (!isAllowed) {
        return;
    }

    const index = tasksList.findIndex((t) => t.id === id);
    tasksList.splice(index, 1)

    const currentTaskItem = document.querySelector(`#item_${id}`)
    currentTaskItem.remove();
}
