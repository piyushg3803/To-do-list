let taskArray = [];

const createTask = () => {
    let taskDate = document.getElementById("taskDate").value;
    let taskInput = document.getElementById("taskInput").value;
    let date = new Date();

    if (!taskInput) {
        alert("Task cannot be empty");
        return;
    }

    if (!taskDate) {
        alert("Task Date cannot be empty");
        return;
    }

    let taskId = taskArray.length;
    let taskDiv = document.createElement("div");
    taskDiv.setAttribute("data-task-id", taskId);
    taskDiv.classList.add("taskContainer");

    taskDiv.innerHTML = `
        <div class="accordion accordion-flush" id="accordionFlushExample-${taskId}">
            <div class="m-auto p-2 accordion-item">
                <div class="accordion-header d-flex justify-content-between align-items-center">
                    <input class="task-checkbox me-2" type="checkbox" id="taskCheckbox-${taskId}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acc-${taskId}" aria-expanded="false" aria-controls="acc-${taskId}">
                        <h3>Title: ${taskInput}</h3>
                    </button>
                </div>
                <div id="acc-${taskId}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <p>Task Created on <b>${date.toLocaleString()}</b></p>
                        <p>Deadline is <b>${taskDate}</b></p>
                        <button type="button" class="btn btn-danger" onclick="deleteTask(${taskId})">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("task-container").appendChild(taskDiv);

    let taskObject = {
        taskID: taskId,
        name: taskInput,
        createDate: date.toISOString(),
        deadline: taskDate,
        status: "pending",
    };

    taskArray.push(taskObject);
    localStorage.setItem("task", JSON.stringify(taskArray));

    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";
};

const loadTasks = () => {
    let tasks = JSON.parse(localStorage.getItem("task")) || [];
    taskArray = [...tasks];

    taskArray.forEach((item) => {
        let storedTask = document.createElement("div");
        storedTask.setAttribute("data-task-id", item.taskID);
        storedTask.classList.add("taskContainer");

        storedTask.innerHTML = `
            <div class="accordion accordion-flush" id="accordionFlushExample-${item.taskID}">
                <div class="m-auto p-2 accordion-item">
                    <div class="accordion-header d-flex justify-content-between align-items-center">
                        <input class="task-checkbox me-2" type="checkbox" style="width: 2rem; height: 2rem" id="taskCheckbox-${item.taskID}" ${item.status === "completed" ? "checked" : "" }>
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acc-${item.taskID}" aria-expanded="false" aria-controls="acc-${item.taskID}">
                            <h3>Title: ${item.name}</h3>
                        </button>
                    </div>
                    <div id="acc-${item.taskID}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <p>Task Created on <b>${new Date(item.createDate).toLocaleString()}</b></p>
                            <p>Deadline is <b>${item.deadline}</b></p>
                            <button type="button" class="btn btn-danger" onclick="deleteTask(${item.taskID})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("task-container").append(storedTask);
    });

    updateTasks();
};

const deleteTask = (taskId) => {
    const index = taskArray.findIndex((task) => task.taskID === taskId);

    if (index !== -1) {
        taskArray.splice(index, 1);
        localStorage.setItem("task", JSON.stringify(taskArray));

        const taskElement = document.querySelector(`div[data-task-id="${taskId}"]`);
        if (taskElement) taskElement.remove();

        updateTasks();
    }
};

const updateTasks = () => {
    document.getElementById("task-container").addEventListener("change", function (event) {
        if (event.target.classList.contains("task-checkbox")) {
            let taskId = parseInt(event.target.id.split("-").pop(), 10);

            if (taskArray[taskId]) {
                let taskElement = event.target.closest("div.taskContainer");
                let completeDate = new Date();

                taskArray[taskId].status = event.target.checked ? "completed" : "pending";
                localStorage.setItem("task", JSON.stringify(taskArray));

                if (event.target.checked) {
                    taskElement.style.filter = "opacity(50%)";
                    event.target.nextElementSibling.style.textDecoration = "line-through";
                } else {
                    taskElement.style.filter = "opacity(100%)";
                    event.target.nextElementSibling.style.textDecoration = "none";
                }
            }
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});
