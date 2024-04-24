// modal open close macanisome
const add_modal_btn = document.querySelector(".add-btn")
const modal_close_btn = document.querySelector(".close_modal_btn")
const modal_cont = document.querySelector(".ticket-modal")
const textArea = document.querySelector(".ticket_text")
const taskHead = document.querySelectorAll(".task-head")
const add_ticket_btn = document.querySelector(".add_task_btn")

let modalOpenCloseFlag = false

// let backlogFlag = true
// let processingFlag = true
// let reviewFlag = true
// let comppleteFlag = true

const taskArray = []

// hide show task body in phone view
// taskHead.forEach(function (e) {
//     e.addEventListener("click", function() {
//         const task = e.classList[0]
//         console.log(task);
//         const body = document.querySelector("#"+task)

//         if(task == 'backlog') {
//             backlogFlag = !backlogFlag
            

//             if(backlogFlag) {
//                 body.style.display = 'block'
//             } else {
//                 body.style.display = 'none'
//             }
//         } else if (task == 'processing') {

//         } else if (task == 'review') {

//         } else if (task == 'complete') {

//         }
//     })
// })

// check is we have anything in local storage then append in DOM
if(localStorage.getItem("tasks")) {
    try {
        const allTasks = JSON.parse(localStorage.getItem("tasks"))

        allTasks.forEach((task) => {
            createTikcet(task.ticketId, task.ticketContent, task.ticketColor)
        })   
    } catch (error) {
        console.log("Something is wrong in JSON", error);
        localStorage.removeItem("tasks")
    }
    
}

// open add task modal
add_modal_btn.addEventListener("click", function() {
    modalOpenCloseFlag = !modalOpenCloseFlag

    if(modalOpenCloseFlag) {
        modal_cont.style.display = "flex"
    }
})

// close add task modal
modal_close_btn.addEventListener("click", function() {
    modalOpenCloseFlag = !modalOpenCloseFlag

    if(!modalOpenCloseFlag) {
        modal_cont.style.display = "none"
    }
})


// modal color picker macanisome
const modal_color_picker = document.querySelectorAll(".modal-color > div")
let modalPriorityColor = "backlog"

modal_color_picker.forEach(function(element) {
    element.addEventListener("click", function() {
        modal_color_picker.forEach(function(ele) {
            ele.classList.remove("active")
        })

        element.classList.add("active")

        modalPriorityColor = element.classList[0]
    })
})


// press shift to add ticket macanisome
modal_cont.addEventListener("keydown", function(e) {
    if(e.key == 'Shift') {
        const textContent = textArea.value
        const ticketId = shortid()
        createTikcet(ticketId, textContent, modalPriorityColor)
    }
})

// Press add btn to add ticket macanisome
add_ticket_btn.addEventListener("click", function(e) {
    const textContent = textArea.value
    const ticketId = shortid()
    createTikcet(ticketId, textContent, modalPriorityColor)
})

// function for drag and drop 
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("taskId", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const updated_color = ev.target.id
    
    const taskId = ev.dataTransfer.getData("taskId");

    // get task by task id
    const currentTask = taskArray.find((task) => task.ticketId == taskId)
    currentTask.ticketColor = updated_color

    ev.target.appendChild(document.getElementById(taskId));

    localStorage.setItem("tasks", JSON.stringify(taskArray))
}

// haldale create ticket
function createTikcet(ticketId, ticketContent, ticketColor) {

    const priorityTaskCont = document.querySelector("."+ticketColor+"-tasks > .task-body")

    const taskItem = document.createElement("div")
    taskItem.setAttribute("class", "task-item")
    taskItem.setAttribute("draggable", "true")
    taskItem.setAttribute("ondragstart", "drag(event)")
    taskItem.setAttribute("id", ""+ticketId)

    taskItem.innerHTML = `<h4>Task Id - ${ticketId}</h4>
                <p>${ticketContent}</p>
                <i class="fa-solid fa-xmark"></i>
                <i class="fa-solid fa-lock task_lock_unlock_icon"></i>`
                
    priorityTaskCont.appendChild(taskItem)
    

    textArea.value = ""

    handalRemoveTicket(taskItem, ticketId)
    handalLockUnlockBtn(taskItem, ticketId)

    // close modal after adding task successfully
    modalOpenCloseFlag = !modalOpenCloseFlag
    modal_cont.style.display = "none"
    
    // add ticket data into array
    taskArray.push({ ticketId, ticketContent, ticketColor })

    // add ticket array in local storage
    localStorage.setItem("tasks", JSON.stringify(taskArray))
}


// remove ticket from DOM and array
function handalRemoveTicket(element, ticketId) {
    const removeBtn = element.querySelector("i.fa-xmark")

    removeBtn.addEventListener("click", function() {
        element.remove()

        // remove task from array
        const ticketIdx = getTaskIndexFromArray(ticketId)
        taskArray.splice(ticketIdx, 1)

        localStorage.setItem("tasks", JSON.stringify(taskArray))
    })
}

// update task in DOM and array
function handalLockUnlockBtn(element, ticketId) {
    const lockUnlockBtn = element.querySelector(".task_lock_unlock_icon")

    const contentBox = element.querySelector("p")

    lockUnlockBtn.addEventListener("click", function() {
        if(lockUnlockBtn.classList.contains("fa-lock")) {
            contentBox.style.cursor = "text"
            lockUnlockBtn.classList.remove("fa-lock")
            lockUnlockBtn.classList.add("fa-lock-open")
            contentBox.setAttribute("contenteditable", "true")
        }
        else {
            contentBox.style.cursor = "inherit"
            lockUnlockBtn.classList.remove("fa-lock-open")
            lockUnlockBtn.classList.add("fa-lock")
            contentBox.setAttribute("contenteditable", "false")

            // update task content into array
            const currentTask = taskArray.find((task) => task.ticketId == ticketId)
            currentTask.ticketContent = contentBox.innerText

            localStorage.setItem("tasks", JSON.stringify(taskArray))
        }
    })
}

function getTaskIndexFromArray(ticketId) {
    return taskArray.findIndex((ticket) => ticket.ticketId == ticketId)
}



/// hide unhide content in phone view
