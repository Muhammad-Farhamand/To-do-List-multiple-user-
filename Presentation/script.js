const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

const user_id = localStorage.getItem("user_id");
const username = localStorage.getItem("username");

const usernamePlaceholder = document.getElementById("usernamePlaceholder");
usernamePlaceholder.textContent = username;

if(username || user_id){
    console.log(username + ' ' + user_id);
}
else{
    console.log('no username found');
}


// Function to fetch and display tasks
async function displayTask(){
    try{
        const response = await fetch(`/api/todo/${user_id}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }
      
        const data = await response.json();

        const tasks = data.data.todo;

      
          tasks.forEach((taskObj) => {
            let li = document.createElement("li");
            li.innerHTML =
              '<div class="list-item">' +
              '<input type="checkbox" class="ui-checkbox">' +
              '<p>' + taskObj.task + '</p>' +
              '</div>';
            if (taskObj.completed) {
              li.querySelector("input").checked = true;
              li.querySelector("p").classList.add("checked-item");
            }
            listContainer.appendChild(li);
      
            let span = document.createElement("span");
            span.innerHTML = "\u00d7";
            li.appendChild(span);

        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

window.onload = displayTask();


async function addTask(){
    if(inputBox.value === ''){
        alert("you must write something!");
    }
    try {
        console.log(user_id);
        const response = await fetch(`/api/todo/${user_id}/push`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task: inputBox.value,
              completed: false,
            }),
        });

        console.log(response);
      
        if (!response.ok) {
            throw new Error("Failed to add task");
        }
      
        const data = await response.json();
        
        let li = document.createElement("li");
        li.innerHTML = '<div class="list-item">' +
        '<input type="checkbox" class="ui-checkbox">' +
        '<p>'+ inputBox.value +'</p>' +
        '</div>'
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);


        inputBox.value = "";
    } catch(error){
        console.error("Error adding task: ", error)
    }
}

inputBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

async function checked(taskToComplete, isCompleted){
    try{
        console.log("TASK UPDATION: " + taskToComplete + " " + isCompleted);
        const response = await fetch(`/api/todo/${user_id}/update`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task: taskToComplete,
              completed: isCompleted
            }),
        });
      
        if (!response.ok) {
            throw new Error("Failed to complete task");
        }            

    } catch (error){
        console.error("Error completing task: ", error)
    }
}

async function pullTask(taskToComplete, isCompleted){
    try{
        console.log("TASK: " + taskToComplete + " " + isCompleted);
        const response = await fetch(`/api/todo/${user_id}/pull`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task: taskToComplete,
              completed: isCompleted
            }),
        });
        console.log(response);
      
        if (!response.ok) {
            throw new Error("Failed to remove task");
        }            

    } catch (error){
        console.error("Error removing task: ", error)
    }
}


listContainer.addEventListener("click", function(e){
    const listItem = e.target.closest("li");
    const task = listItem.querySelector("p").textContent.trim();
    const checkbox = listItem.querySelector(".ui-checkbox");
    const taskCompleted = checkbox.checked;


    if(e.target.tagName === "LI"){
        console.log('checked');
        e.target.classList.toggle("checked");
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        pullTask(task, taskCompleted);

    }
    else if (e.target.classList.contains("ui-checkbox") || e.target.tagName === "P") {
        checked(task, taskCompleted);
        checkbox.checked = !checkbox.checked;
        listItem.querySelector("p").classList.toggle("checked-item");

    }
}, false);


// listContainer.addEventListener("click", function(e) {
//     const listItem = e.target.closest("li");
//     const checkbox = listItem.querySelector(".ui-checkbox");
//     const task = listItem.querySelector("p").textContent.trim();
//     const taskCompleted = checkbox.checked;

//     if (e.target === checkbox || e.target.tagName === "P") {
//         checkbox.checked = !checkbox.checked;
//         listItem.querySelector("p").classList.toggle("checked-item");
//         checked(task, checkbox.checked);
//     } else if (e.target.tagName === "SPAN") {
//         listItem.remove();
//         pullTask(task, taskCompleted);
//     } else if (e.target.tagName === "LI") {
//         listItem.classList.toggle("checked");
//     }
// });
