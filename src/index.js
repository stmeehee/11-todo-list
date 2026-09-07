import "./style.css";
// import Task from "./task.js"; // NotUsing
import Task from "./modules/Task.js";
import taskDomCtrl from "./modules/taskDomCtrl.js";
import DomCtrl from "./modules/DomCtrl.js";

// tasksOptionsPrev is the last cicked .tasksOptions btn, we keep it to remove the anchor-active id from it
// when a new btn is clicked
// let tasksOptionsPrev = null // DomCtrl
let myTasks = new Map() // Task
// let myTaskElements = new Map() // DomCtrl
// let myTaskDomCtrlMap = new Map() // DomCtrl?; might need an instance to kep track of elem state for each Task instance  

// DomCtrl


// Task method
//TODO
function addTask(myFormData) {
    //TODO
}

// DomCtrl & HtmlMaker methods: addProjectToSideBar(formElem)

// DomCtrl: unCheckSubtasks(taskId)

// DomCtrl: resetTaskElement

// HtmlMaker & DomCtrl method: addSubtaskDialog()
// TODO; separate this! this is making and adding html

// DomCtrl: removeDiv(SubTaskDiv)

// DomCtrl: focusInputTextarea(focusInthisElem)

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

// DomCtrl: toggleElemVisibility(elemToShow, elemToHide)


// DomCtrl: disAllowDiv(taskId)

// DomCtrl: allowDiv(taskId) 

// DomCtrl: markTaskComplete(taskId) 

// DomCtrl: completeBtnOnOff(taskId, allow)

// DomCtrl: getTaskIdFromElement

// DomCtrl: getProgressBar(taskId)


// DomCtrl: anchorTasksOptions(tasksOptionsBtnEl) 

// DomCtrl: updateProgress(isChecked, taskId)


// DomCtrl: getBarLabelColor(percentVal)


// DomCtrl: renderProgressBar(labelToUse, colorToUse, setToThisWidth, taskId)
// change the label and color for the given taskID

// DomCtrl


// app; main driver & orchestrator
function delegate(event) {
    // console.log({"event --> delegate(): elem clicked =":event.target})
    // console.log(event.target.checked)
    if (event.target.checked) {
        console.log(event.target.value)
        console.log("here!")
    }
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

// DomCtrl: collapseHiddenDiv(Elem)

// DomCtrl: openEditor()

// DomCtrl: closeEditor(btnElem)


// DomCtrl: getElemFromTaskElemAndChildClassId(childElem, childClassId)

// DomCtrl: getFullTaskDivElemFromChildElem(childElem)

// saves Tasks, task html elements & tracks editor open/close + other state for each task html element
// TODO: seperate this 
function setTasksAndTaskElements() {
    console.log(` > getTasks()`)
    for (const taskEl of DomCtrl.cache.allTasksElem) {
        let id = taskEl.id
        myTasks.set(id, new Task())
        DomCtrl.myTaskElements.set(id, taskEl)
        taskDomCtrl.myTaskDomCtrlMap.set(id, new taskDomCtrl())
    }
    // console.log(myTasks.get("1a"))
}

// app
function init() {
    console.log(` > init()`)
    DomCtrl.cache = DomCtrl.getDomElements()
    setTasksAndTaskElements()
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
            addTask(myData)
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
        // {title: 'aa', desc: 'aa', date: '2026-09-01', priority: 'high', note: 'aaa', …}
        // console.log(Object.fromEntries(myData))
        // console.log(`date from form: ${myData.get(date)}`)

        // event.target.closest("dialog").close()
    })
}

function main() {

    init()
}

main()