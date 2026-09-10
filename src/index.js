import "./style.css";
// import Task from "./task.js"; // NotUsing
import Task from "./modules/Task.js";
import taskDomCtrl from "./modules/taskDomCtrl.js";
import DomCtrl from "./modules/DomCtrl.js";
import TaskLoader from "./modules/TaskLoader.js";

// myViewingDivTasks: the tasks that are currently being viewed; chosen according to the viewingProject var
let myViewingDivTasks = null // Task  
let projectMap = new Map()
const defaultProjectName = "All tasks"
let viewingProject = null

// Task method
//TODO
function addTask(myFormData) {
    //TODO
}

function setTaskDefaultProjectName() {
    Task.defaultProjectName = defaultProjectName
    viewingProject = Task.defaultProjectName
}

function newTask(formData) {
    const task = new Task(formData)
    addToProjectMap(task)
    // DomCtrl.addToMap
    // TODO: 
    // saveTaskToStorage(projectMap) 
    displayTask(task)
    setTaskElementsMap()
}

function displayTask(thisTask) {
    const ifViewingThisTaskProject = thisTask.projectNames.includes(viewingProject)
    if (ifViewingThisTaskProject) {
        DomCtrl.displayTask(thisTask)
    }
}

function addToProjectMap(task) {
    for (const projName of task.projectNames) {
        const newProject = (projName !== "" && !projectMap.has(projName))
        if (newProject) {
            projectMap.set(projName, new Map()) // {now: new Map(), later: new Map()}
        }     
        projectMap.set(projName, projectMap.get(projName).set(task.id, task)) // {now: { {id: task} }}
    }
}   

function setViewingDivTasksMapToProject(setToProject) {
    myViewingDivTasks = projectMap.get(setToProject)
}

// DomCtrl & app method
// TODO: break this apart!
function setMinDate() {
    const presentDate = new Date()
    const year = presentDate.getFullYear()
    const month = String(presentDate.getMonth() + 1).padStart(2,"0")
    const day = String(presentDate.getDate()).padStart(2,"0")
    const minDate = `${year}-${month}-${day}`
    // DomCtrl.cache.date.setAttribute("min", minDate)
    // DomCtrl.cache.date.setAttribute("value", minDate)
    DomCtrl.cache.dateInputs.forEach((date) => {
        date.setAttribute("min", minDate)
        date.setAttribute("value", minDate)
    })
}

// app; main driver & orchestrator
function delegate(event) {
    // console.log({"event --> delegate(): elem clicked =":event.target})
    // console.log(event.target.checked)
    // if (event.target.checked) {
    //     console.log(event.target.value)
    //     console.log("here!")
    // }
    let taskId = null
    const changeTheme = event.target.closest(".theme-toggle")
    const subTaskCheckboxClick = (event.target.closest(".hidden-div") && event.target.type == "checkbox") 
    const TaskOptionsPopupBtn = event.target.closest(".tasks-options")
    const finishTask = event.target.closest(".finalize")
    const toggleEditorField = (event.target.closest(".edit-field-selectors") && event.target.type == "radio")
    const cancelEditing = event.target.closest(".cancel-edit")
    const taskOptionsPopupMenu = event.target.closest("#tasks-options-popover")
    const addDialogSubtask = event.target.closest(".add-subtask-option")
    const deleteProject = event.target.closest(".remove-project")
    if (changeTheme) {
        DomCtrl.setTheme()
    }
    if (subTaskCheckboxClick) {
        // console.log(`checkbox state: ${event.target.checked}, from: ${event.target.type}`)
        // console.log(event.target)
        // 1. get tashId from checkBox
        // 2. updateProgress(checkboxElState, taskId)
        const checkBoxElem = event.target
        const subtaskKey = checkBoxElem.value
        taskId = DomCtrl.getTaskIdFromElement(checkBoxElem) 
        const task = myViewingDivTasks.get(taskId)
        task.updateProgress(subtaskKey, checkBoxElem.checked)
        let pct = task.taskProgress 
        let [label, color] = DomCtrl.getBarLabelColor(pct) 
        DomCtrl.renderProgressBar(label, color, `${pct}%`, taskId)
        DomCtrl.updateSubTask(taskId, task.finishedSubtasks)

        // console.log(myTasks.get(taskId).isFinished)
        // completeBtnOnOff(taskId, myTasks.get(taskId).isFinished) // DomCtrl
        DomCtrl.completeBtnOnOff(taskId, task.isFinished) 
    }
    if (TaskOptionsPopupBtn) {
        // console.log(event.target.closest(".tasks-options"))
        const taskOptionsBtn = event.target.closest(".tasks-options")
        DomCtrl.anchorTasksOptions(taskOptionsBtn)
    }
    if (finishTask) {
        const confirmBtn = event.target
        // console.log(confirmBtn)
        taskId = DomCtrl.getTaskIdFromElement(confirmBtn)
        DomCtrl.markTaskComplete(taskId)
        DomCtrl.disAllowDiv(taskId)
        const subtasksExist = (projectMap.get(viewingProject).get(taskId).getSubtaskTitles().length !== 0)
        if (subtasksExist) {
            DomCtrl.collapseHiddenDiv(taskId)
        }
        const pct = 100
        let [label, color] = DomCtrl.getBarLabelColor(null, true) 
        // let color = DomCtrl.cache.barCssVars.barColorGreenName
        // let label = "Complete!"

        DomCtrl.renderProgressBar(label, color, `${pct}%`, taskId)
        DomCtrl.closeEditor(confirmBtn)
    }
    if (toggleEditorField) {
        // show edit divs 
        // console.log(event.target.type )
        // console.log(event.target.value)
        const clickedToggleBtn = event.target
        DomCtrl.switchEditorField(clickedToggleBtn)
    }
    if (cancelEditing) {
        // closetask-details-edit div and show task-details div
        const closeBtnElem = event.target
        DomCtrl.closeEditor(closeBtnElem)
    }
    if (taskOptionsPopupMenu) {
        const taskId = event.target.closest("#tasks-options-popover").dataset.anchoredToTaskId
        const task = myViewingDivTasks.get(taskId)        
        const btnClicked = event.target
        const editBtn = btnClicked.classList.contains("popover-edit") 
        const resetBtn = btnClicked.classList.contains("popover-reset")
        if (editBtn) {
            DomCtrl.openEditor()
        }
        if (resetBtn) {
            task.resetProgress()
            const subtasksExist = task.getSubtaskTitles().length
            DomCtrl.resetTaskElement(taskId, subtasksExist)
            DomCtrl.allowDiv(taskId)
        }
    }
    if (addDialogSubtask) {
        // add subtask div
        // console.log(event.target)
        const addTaskDialogBtn = event.target.closest(`button.new-subtask`)
        const rmTaskDialogBtn = event.target.closest(`button.remove-subtask`)
        if (addTaskDialogBtn) {
            // console.log(addTaskDialogBtn)
            DomCtrl.addSubtaskDialog()
        }
        if (rmTaskDialogBtn) {
            // console.log(rmTaskDialogBtn)
            const subtaskDiv = rmTaskDialogBtn.closest(".subtask-div")
            DomCtrl.removeDiv(subtaskDiv)
        }        
        // console.log(rmTaskDialogBtn)
    }
    if (deleteProject) {
        const userProjectDiv = event.target.closest(".user-project")
        // TODO: manage the project data
        DomCtrl.removeDiv(userProjectDiv)
        // removeProject()
    }
}

// saves Tasks, task html elements & tracks editor open/close + other state for each task html element
// TODO: seperate this 
function setTaskElementsMap() {
    console.log(` > getTasks()`)
    for (const taskEl of DomCtrl.getPopulatedTaskElements()) {
        let id = taskEl.id
        // myTasks.set(id, new Task())
        // myTasks.set(id, task)
        DomCtrl.myTaskElements.set(id, taskEl)
        taskDomCtrl.myTaskDomCtrlMap.set(id, new taskDomCtrl())
    }
    // console.log(myTasks.get("1a"))
}

// function extractProjectName(formData) {
//     let existingProj = formData.get("existingProject")
//     let newProject = formData.get("newProject")
//     if (newProject) {
//         return newProject
//     } 
//     return existingProj
// }

// ProjectMap {projectName: {taskId: taskObj}}

function loadTasksToProjectMap(taskList) {
    for (const task of taskList) {
        let taskProjectNames = task.projectNames
        for (const projName of taskProjectNames) {
            if (!projectMap.has(projName)) {
                projectMap.set(projName, new Map()) // {now: new Map(), later: new Map()}
            }
            projectMap.set(projName, projectMap.get(projName).set(task.id, task)) // {now: { {id: task} }}
        }
    }
}

// app
function init() {
    console.log(` > init()`)
    setTaskDefaultProjectName()
    DomCtrl.cache = DomCtrl.getDomElements()
    let tasksList = TaskLoader.testLoadTasks(1)
    loadTasksToProjectMap(tasksList)
    DomCtrl.displayProjectTasks(viewingProject, projectMap.get(viewingProject))
    setViewingDivTasksMapToProject(viewingProject)
    // DomCtrl.displayProjectTasks(viewingProject, projectMap.get(viewingProject))  
    // TODO: make DomCtrl.displayProjectTasks(projectName, tasksMap) 
    // to load tasks from the map for the given projName and make taskElement obects
    // keep a viewingProject var to easily switch to it using:  
    //      DomCtrl.displayProjectTasks(viewingProject, projectMap.get(viewingProject))  

    setTaskElementsMap()
    setMinDate()
    DomCtrl.setTheme("dark")

    DomCtrl.cache.body.addEventListener("click", (event) => {
        delegate(event)
    })

    DomCtrl.cache.body.addEventListener("submit", (event) => {
        event.preventDefault()
        const myData = new FormData(event.target)
            // console.log(Object.fromEntries(myData))
        if (event.target.dataset.formName === "newForm") {
            console.log("newForm")
            console.log(Object.fromEntries(myData))
            newTask(myData)
            DomCtrl.cache.newTaskdialogBox.close()
        }
        if (event.target.dataset.formName === "editForm") {
            console.log("editForm")
            console.log(Object.fromEntries(myData))
            // editTask()
            const submitBtn = event.submitter
            // console.log(submitBtn)
            DomCtrl.closeEditor(submitBtn)
        }
        if (event.target.dataset.formName === ("newProject")) {
            // console.log("newProject")
            // console.log(Object.fromEntries(myData)) 
            DomCtrl.addProjectToSideBar(myData)
            DomCtrl.collapseHiddenDiv(null, DomCtrl.cache.addNewProjectCheckBox)
        }
    })
}

function main() {
    init()
}

main()

