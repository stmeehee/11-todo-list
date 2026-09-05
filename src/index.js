import "./style.css";
import Task from "./task.js";
import taskDomCtrl from "./taskDomCtrl.js";

// tasksOptionsPrev is the last cicked .tasksOptions btn, we keep it to remove the anchor-active id from it
// when a new btn is clicked
let tasksOptionsPrev = null
let domCache = null
let myTasks = new Map()
let myTaskElements = new Map()
let myTaskDomCtrlMap = new Map()


function getDomElements(getElemWithId) {
    if (getElemWithId) {
        return document.getElementById(getElemWithId)
    }
    // console.log(` > getDomElements()`)
    const root = document.documentElement;
    const body = document.querySelector("body")
    const allTasksElem = document.querySelectorAll(".all-tasks-div > div")
    const barCssVars =  {
        barWidthName: "--progress-bar-width",
        barColorInUseName: "--bg-progress-bar-color",
        barColorRedName: "--bg-progress-bar-empty",
        barColorYellowName: "--bg-progress-bar-normal",
        barColorTealName: "--bg-progress-bar-inComplete",
        barColorGreenName: "--bg-progress-bar-complete",
    }
    const dateInputs = document.querySelectorAll(`input[type="date"]`)
    const tasksOptionsPopover = document.querySelector(`#tasks-options-popover`)
    const newTaskdialogBox = document.querySelector("#add-task-dialog")
    // newSubtaskDiv: where subtask divs go when + btn is clicked in dialog"
    const newSubtaskDivsContainer = document.querySelector(".new-subtask-divs")
    const userProjectsContainer = document.querySelector(".user-projects")

    return {
        root, body, allTasksElem, barCssVars, dateInputs, tasksOptionsPopover, newTaskdialogBox, 
        newSubtaskDivsContainer, userProjectsContainer
    }
}

function unCheckSubtasks(taskId) {
    const subtasks = myTaskElements.get(taskId).querySelectorAll('.task-parent-div > .hidden-div input[type="checkbox"]')
    console.log(subtasks)
    subtasks.forEach((checkboxElem) => {
        checkboxElem.checked = false
    })
}

function resetTask(taskId) {
    myTaskElements.get(taskId).classList.remove("done")
    myTasks.get(taskId).current = 0
    unCheckSubtasks(taskId)
        let pct = myTasks.get(taskId).currentPercent
        let [label, color] = getBarLabelColor(pct)
    renderProgressBar(label, color, `${pct}%`, taskId)
    completeBtnOnOff(taskId, false)
}

function addTask(myFormData) {
    //TODO
}

function addSubtaskDialog() {
    // console.log("newSubtaskDiv:",domCache.newSubtaskDivsContainer)
    const newSubTaskNo =  domCache.newSubtaskDivsContainer.children.length + 1
    const newSubtaskDivHtml = `
        <div class="subtask-div">
            <label class="subtask-${newSubTaskNo}">subtask ${newSubTaskNo}
                <input type="text" name="subtaskTitle${newSubTaskNo}">
            </label>
            <button type="button" class="remove-subtask">X</button>
        </div>
        `
    domCache.newSubtaskDivsContainer.insertAdjacentHTML(
        "beforeend",
        newSubtaskDivHtml
    )
}

function removeSubtaskDiv(SubTaskDiv) {
    // console.log(SubTaskDiv)
    SubTaskDiv.remove()
}

function focusInputTextarea(focusInthisElem) {
    const inputElem = (focusInthisElem.querySelector("input"))
    if (inputElem !== null ) {
        inputElem.focus()
    }
    else {
        const textareaElem = (focusInthisElem.querySelector("textarea"))
        textareaElem.focus()
    }
}

function setMinDate() {
    const presentDate = new Date()
    const year = presentDate.getFullYear()
    const month = String(presentDate.getMonth() + 1).padStart(2,"0")
    const day = String(presentDate.getDate()).padStart(2,"0")
    const minDate = `${year}-${month}-${day}`
    // domCache.date.setAttribute("min", minDate)
    // domCache.date.setAttribute("value", minDate)
    domCache.dateInputs.forEach((date) => {
        date.setAttribute("min", minDate)
        date.setAttribute("value", minDate)
    })
}

function toggleElemVisibility(elemToShow, elemToHide) {
    // shows the clicked toggle-label div and hides the prev div of that nature
    // console.log(elemToShow, elemToHide)
    if (elemToHide) {
        // hide element
        elemToHide.classList.add("hidden-div")
    }
    // show element
    elemToShow.classList.remove("hidden-div")
    // keep track of last shown div
}

function disAllowDiv(taskId) {
    // console.log(` > disAllowTaskDiv()`)
    const taskElem = myTaskElements.get(taskId)
    const parentDiv = taskElem.querySelector(".task-parent-div")
    parentDiv.classList.add("disAllow")
    // toggle allow
    // console.log(myTaskElements.get(taskId))
}

function allowDiv(taskId) {
    const taskElem = myTaskElements.get(taskId)
    const parentDiv = taskElem.querySelector(".task-parent-div")
    parentDiv.classList.remove("disAllow")
}

function completeTask(taskId) {
    console.log(` > completeTask()`)
    myTaskElements.get(taskId).classList.add("done")
    myTaskElements.get(taskId).isFinished = true
}

function completeBtnOnOff(taskId, allow) {
    console.log(` > changeCompleteBtn()`)
    const taskElem = myTaskElements.get(taskId) 
    const confirmBtn = taskElem.querySelector("#primary-task > button")
    confirmBtn.classList.remove("disable")
    confirmBtn.classList.add("finalize")
    if (allow) {
        confirmBtn.classList.remove("disable")
        confirmBtn.classList.add("finalize")
    }
    else{
        confirmBtn.classList.add("disable")
        confirmBtn.classList.remove("finalize")
    }
    console.log(taskElem)
}

// finds the task up the dom tree and returns its id
function getTaskIdFromElement(descendentElem) {
    return descendentElem.closest(".full-task-div").id
}

function getProgressBar(taskId) {
    const taskElem = myTaskElements.get(taskId)
    const progBar = taskElem.querySelector(".task-progress-bar")
    return progBar
}

function anchorTasksOptions(tasksOptionsBtnEl) {
    // console.log(tasksOptionsBtnEl)
    if (tasksOptionsPrev) {
        tasksOptionsPrev.id = ""
    }
    tasksOptionsBtnEl.id = "active-anchor"

    tasksOptionsPrev  = tasksOptionsBtnEl
    // make tasks-options-popover dialog remember which task it was opened for, 
    // so taskOptionsBtnEl btns know which task its btns corrodpond to
    const taskId = getTaskIdFromElement(tasksOptionsBtnEl)
    // console.log(domCache.tasksOptionsPopover)
    domCache.tasksOptionsPopover.dataset.anchoredToTaskId = taskId
    // check if the taskId main-div has disAllow
    const resetBtnDiv = domCache.tasksOptionsPopover.querySelector('.popover-reset')
    const editBtnDiv = domCache.tasksOptionsPopover.querySelector('.popover-edit')
    // console.log(resetBtnDiv)
    const completedTask = myTaskElements.get(taskId).classList.contains("done")
    if (completedTask) {
        // console.log("SHOWING RESET BTN")
        if (resetBtnDiv.classList.contains("hidden")) {
            // show the reset btn and hide edit btn
            resetBtnDiv.classList.remove("hidden")
        }
        editBtnDiv.classList.add("hidden")
    }
    // hide reset and show edit
    else {
        if (editBtnDiv.classList.contains("hidden")) {
            editBtnDiv.classList.remove("hidden")
        }
        resetBtnDiv.classList.add("hidden")   
    }
    // console.log(`after adding active-anchor id:`)
    //     console.log(tasksOptionsBtnEl)
}

function updateProgress(isChecked, taskId) {
    const Task = myTasks.get(taskId)
    // console.log(` > updateProgress()`)
    // console.log(`task id clicked: ${Task._id}`)    
    if (isChecked) {
        Task.current += 1
    }
    else {
        Task.current -= 1
    }
}

function getBarLabelColor(percentVal) {
    let label = null, color = null
    const red = domCache.barCssVars.barColorRedName
    const yellow = domCache.barCssVars.barColorYellowName
    const teal = domCache.barCssVars.barColorTealName
    const green = domCache.barCssVars.barColorGreenName
    if (percentVal === 0)
        [label, color] = [`${percentVal} %`, red]
    else if (percentVal > 0 && percentVal < 100) {
        [label, color] = [`${percentVal} %`, yellow]
    }
    else {
        // task is either isFinished or waiting for user to click complete
        if (percentVal === 100) {
            [label, color] = ["In limbo...", teal]
        }
        // else {
        //     [label, color] = ["Complete!", green]
        // }
    }
    return [label, color]
}

// change the label and color for the given taskID
function renderProgressBar(labelToUse, colorToUse, setToThisWidth, taskId) {
    const progBarElem = getProgressBar(taskId)
    const barColor = domCache.barCssVars.barColorInUseName
    progBarElem.style.setProperty(domCache.barCssVars.barWidthName, setToThisWidth)
    console.log(getComputedStyle(document.documentElement).getPropertyValue("--progress-bar-width"))
    progBarElem.dataset.label = labelToUse
    progBarElem.style.setProperty(barColor, `var(${colorToUse})`)
}

function setTheme() {
    const newTheme = domCache.root.className === 'dark' ? 'light' : 'dark';
    domCache.root.className = newTheme;
}

function delegate(event) {
    // console.log({"event --> delegate(): elem clicked =":event.target})
    // console.log(event.target)
    let taskId = null
    if (event.target.closest(".theme-toggle")) {
        setTheme()
    }
    if (event.target.closest(".hidden-div") && event.target.type == "checkbox") {
        // console.log(`checkbox state: ${event.target.checked}, from: ${event.target.type}`)
        // console.log(event.target)
        const checkBoxElem = event.target
        const isChecked = checkBoxElem.checked
        taskId = getTaskIdFromElement(checkBoxElem)
        updateProgress(checkBoxElem.checked, taskId)
        let pct = myTasks.get(taskId).currentPercent
        let [label, color] = getBarLabelColor(pct)
        renderProgressBar(label, color, `${pct}%`, taskId)
        console.log(myTasks.get(taskId).isFinished)
        completeBtnOnOff(taskId, myTasks.get(taskId).isFinished)
    }
    if (event.target.closest(".tasks-options")) {
        // console.log(event.target.closest(".tasks-options"))
        const taskOptionsBtn = event.target.closest(".tasks-options")
        anchorTasksOptions(taskOptionsBtn)
    }
    if (event.target.closest(".finalize")) {
        const confirmBtn = event.target
        // console.log(confirmBtn)
        taskId = getTaskIdFromElement(confirmBtn)
        completeTask(taskId)
        disAllowDiv(taskId)
        collapseSubTasks(taskId)
        let color = domCache.barCssVars.barColorGreenName
        let pct = myTasks.get(taskId).currentPercent
        let label = "Complete!"
        renderProgressBar(label, color, `${pct}%`, taskId)
        closeEditor(confirmBtn)
    }
    if (event.target.closest(".edit-field-selectors") && event.target.type == "radio") {
        // show edit divs 
        // console.log(event.target.type )
        // console.log(event.target.value)
        const elem = event.target
        const elemClass = `.${event.target.value}`
        const taskId = getTaskIdFromElement(elem)
        const divToShow = getElemFromTaskElemAndChildClassId(elem, elemClass)
        const divToHide = myTaskDomCtrlMap.get(taskId).editFieldDivInView
        // console.log(hiddenEditFieldDiv)
        toggleElemVisibility(divToShow, divToHide)

        focusInputTextarea(divToShow)
        myTaskDomCtrlMap.get(taskId).editFieldDivInView = divToShow
        // save the div in view
    }
    if (event.target.closest(".cancel-edit")) {
        // closetask-details-edit div and show task-details div
        const closeBtnElem = event.target
        closeEditor(closeBtnElem)
    }
    if (event.target.closest("#tasks-options-popover")) {
        const taskId = event.target.closest("#tasks-options-popover").dataset.anchoredToTaskId
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
            openEditor()
        }
        if (resetBtn) {
            resetTask(taskId)
            allowDiv(taskId)
        }
    }
    if (event.target.closest(".add-subtask-option")) {
        // add subtask div
        console.log(event.target)
        const addTaskDialogBtn = event.target.closest(`button.new-subtask`)
        const rmTaskDialogBtn = event.target.closest(`button.remove-subtask`)
        if (addTaskDialogBtn) {
            console.log(addTaskDialogBtn)
            // const addInThisDiv = 
            addSubtaskDialog()
        }
        if (rmTaskDialogBtn) {
            console.log(rmTaskDialogBtn)
            const divToRm = rmTaskDialogBtn.closest(".subtask-div")
            removeSubtaskDiv(divToRm)
        }        
        
        // console.log(rmTaskDialogBtn)
    }
    if (event.target.closest(".add-project")) {
        // add project
        console.log(event.target)
        addProjectDiv()
    }
}

function addProjectDiv() {
    const projectDiv = domCache.userProjectsContainer
    // 1. user clicks add project btn
    // 2. unhide a text field inside projectDiv and take input
    // 3. if field empty and add is clicked, reject making user project 
    //      3.1. field empty + add clicked: hide the add btn  
    // 4. else if field not empty, add a btn with a div that has newProject
    // 5. 
}

function collapseSubTasks(taskId) {
    const arrowBtn = myTaskElements.get(taskId).querySelector('.expand[type="checkbox"]')
    // console.log(arrowBtn.checked)
    arrowBtn.checked = false
}

function openEditor() {
    // open the editor by checking which full-task-div popover misc menu is at 
    const taskId = domCache.tasksOptionsPopover.dataset.anchoredToTaskId
    const divToShow = myTaskElements.get(taskId).querySelector(".task-details-edit")
    const divToHide = myTaskElements.get(taskId).querySelector(".task-details")
    toggleElemVisibility(divToShow, divToHide)
    myTaskDomCtrlMap.get(taskId).taskDetailsDivInView = divToShow
}

function closeEditor(btnElem) {
    // useful if the btnElem has the info for which to open 
    // otherwise use toggleElemVisibility() instead
    const divToShowClass = `.${btnElem.dataset.class_show}`
    const taskId = getTaskIdFromElement(btnElem)
    // console.log(`divClassToShow: ${divClassToShow}, divClassToHide: ${divClassToHide}`)
    const divToShow = getElemFromTaskElemAndChildClassId(btnElem, divToShowClass)
    const divToHide = myTaskDomCtrlMap.get(taskId).taskDetailsDivInView
    // console.log({divToShow})
    toggleElemVisibility(divToShow, divToHide)
    myTaskDomCtrlMap.get(taskId).taskDetailsDivInView = divToShow    
}

// return the element from the childElem and child class/id
// childElem -> mainTaskDiv -> childClassId (aka destination id) -> return elem with that id/class
function getElemFromTaskElemAndChildClassId(childElem, childClassId) {
    const taskElem = getFullTaskDivElemFromChildElem(childElem)
    const resElem = taskElem.querySelector(childClassId)
    return resElem
}

// find and return maintask element from child element 
function getFullTaskDivElemFromChildElem(childElem) {
    const taskId = getTaskIdFromElement(childElem)
    const taskEl = myTaskElements.get(taskId)
    return taskEl 
}

function setTasksAndTaskElements() {
    console.log(` > getTasks()`)
    for (const taskEl of domCache.allTasksElem) {
        let id = taskEl.id
        myTasks.set(id, new Task(id))
        myTaskElements.set(id, taskEl)
        myTaskDomCtrlMap.set(id, new taskDomCtrl())
    }
    // console.log(myTasks.get("1a"))
}

function init() {
    console.log(` > init()`)
    domCache = getDomElements()
    setTasksAndTaskElements()
    setMinDate()

    domCache.body.addEventListener("click", (event) => {
        delegate(event)
    })

        domCache.body.addEventListener("submit", (event) => {
        event.preventDefault()
        const myData = new FormData(event.target)
        if (event.target.dataset.id === "newForm") {
            console.log("newForm")
            console.log(Object.fromEntries(myData))
            addTask(myData)
            domCache.newTaskdialogBox.close()
        }
        if (event.target.dataset.id === "editForm") {
            console.log("editForm")
            console.log(Object.fromEntries(myData))
            // editTask()
            const submitBtn = event.submitter
            console.log(submitBtn)
            closeEditor(submitBtn)
        }
        // {title: 'aa', desc: 'aa', date: '2026-09-01', priority: 'high', note: 'aaa', …}
        // console.log(Object.fromEntries(myData))
        // console.log(`date from form: ${myData.get(date)}`)

        // event.target.closest("dialog").close()
    })

}

function main() {

    document.documentElement.className = "dark"
    init()
}

main()