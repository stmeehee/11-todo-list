import "./style.css";
// import Task from "./task.js"; // NotUsing
import Task from "./modules/Task.js";
import taskDomCtrl from "./modules/taskDomCtrl.js";
import DomCtrl from "./modules/DomCtrl.js";

let myTasks = new Map() // Task  
let projectMap = new Map()

// Task method
//TODO
function addTask(myFormData) {
    //TODO
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

        // taskId = getTaskIdFromElement(checkBoxElem) // DomCtrl
        taskId = DomCtrl.getTaskIdFromElement(checkBoxElem) 

        // Task.updateProgress(checkBoxElem.checked, taskId) // Task 
        const task = myTasks.get(taskId)
        task.updateProgress(subtaskKey, checkBoxElem.checked)

        // let pct = myTasks.get(taskId).currentPercent // Task 
        let pct = task.taskProgress 

        // let [label, color] = getBarLabelColor(pct) / // DomCtrl
        let [label, color] = DomCtrl.getBarLabelColor(pct) 

        // renderProgressBar(label, color, `${pct}%`, taskId) // DomCtrl
        DomCtrl.renderProgressBar(label, color, `${pct}%`, taskId)

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
        DomCtrl.collapseHiddenDiv(taskId)
        let color = DomCtrl.cache.barCssVars.barColorGreenName
        let pct = myTasks.get(taskId).taskProgress
        let label = "Complete!"
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
        const task = myTasks.get(taskId)        
        const btnClicked = event.target
        const editBtn = btnClicked.classList.contains("popover-edit") 
        const resetBtn = btnClicked.classList.contains("popover-reset")
        if (editBtn) {
            // const divToShow = myTaskElements.get(taskId).querySelector(".task-details-edit")
            // const divToHide = myTaskElements.get(taskId).querySelector(".task-details")
            // console.log({divToShow}, {divToHide})
            // toggleElemVisibility(divToShow, divToHide)
            // myTaskDomCtrlMap.get(taskId).taskDetailsDivInView = divToShow
            // console.log(myTaskDomCtrlMap.get(taskId).taskDetailsDivInView)
            DomCtrl.openEditor()
        }
        if (resetBtn) {
            task.resetProgress()
            DomCtrl.resetTaskElement(taskId)
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
    for (const taskEl of DomCtrl.cache.allTasksElem) {
        let id = taskEl.id
        // myTasks.set(id, new Task())
        // myTasks.set(id, task)
        DomCtrl.myTaskElements.set(id, taskEl)
        taskDomCtrl.myTaskDomCtrlMap.set(id, new taskDomCtrl())
    }
    // console.log(myTasks.get("1a"))
}
    // function mapProjectToTasks() {
    //     let task = new Task() // task-a, id=1a, // task-b, id=1b // task-c, id=1c
    //     task.projectName = "new-project"
    //     let projectName = task.projectName // now // later // now
    //     if (!projectMap.has(projectName)) {
    //         projectMap.set(projectName, new Map()) // {now: new Map(), later: new Map()}
    //     }
    //     projectMap.set(projectName, projectMap.get(projectName).set(id, task)) // {now: { {id: task} }}
    // }

// function extractProjectName(formData) {
//     let existingProj = formData.get("existingProject")
//     let newProject = formData.get("newProject")
//     if (newProject) {
//         return newProject
//     } 
//     return existingProj
// }

// ProjectMap {projectName: {taskId: taskObj}}

function newTask(formData) {
    // const task = new Task(formData)
    // projectName = extractProjectName(formData)
    // projectMap.set(projectName, task)
    // console.log(task)
}

function loadTaskToProjectMap(taskList) {
    for (const task of taskList) {
        let taskProjectNames = task.projectNames
        for (const projName of taskProjectNames) {
            if (!projectMap.has(projName)) {
                projectMap.set(projName, new Map()) // {now: new Map(), later: new Map()}
            }
            projectMap.set(projName, projectMap.get(projName).set(task.getShortId(), task)) // {now: { {id: task} }}
        }
    }
}

// app
function init() {
    console.log(` > init()`)
    let tasksList = TaskLoader.testLoadTasks(3)
    loadTaskToProjectMap(tasksList)
    // TODO: make DomCtrl.displayTasks(projectMap)  
    // to load tasks from projectsMap and make taskElement obects
    // keep a viewingProject var to easily switch to it using:  
    //      DomCtrl.displayTasks(projectMap.get(viewingProject), htmlMaker.getTaskElTemplate()))  

    DomCtrl.cache = DomCtrl.getDomElements()
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
            // console.log("newForm")
            // console.log(Object.fromEntries(myData))
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

