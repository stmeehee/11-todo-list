import taskDomCtrl from "./taskDomCtrl.js";
import HtmlMaker from "./htmlMaker.js";

export default class DomCtrl {
    // some frequently used static  elements
    cache = null // DomCtrl
    static myTaskElements = new Map() // DomCtrl
    // tasksOptionsPrev: is the last cicked .tasksOptions btn, we keep it to remove the anchor-active id from it 
    // when a new btn is clicked    
    static tasksOptionsPrev = null // DomCtrl

    static getDomElements(getElemWithId) {
        if (getElemWithId) {
            return document.getElementById(getElemWithId)
        }
        // console.log(` > DomCtrl.getDomElements()`)
        const root = document.documentElement;
        const body = document.querySelector("body")
        const allTasksElem = document.querySelectorAll(".project-name-div > div")
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
        // addNewProjectCheckBox: uncheck add project to collapse project name field
        const addNewProjectCheckBox = document.querySelector('.add-project > input[type="checkbox"]')

        return {
            root, body, allTasksElem, barCssVars, dateInputs, tasksOptionsPopover, newTaskdialogBox, 
            newSubtaskDivsContainer, userProjectsContainer, addNewProjectCheckBox
        }
    }

    static setTheme(setThemeTo) {
        if (setThemeTo) {
            this.cache.root.className = setThemeTo;
            return
        }
        const newTheme = this.cache.root.className === 'dark' ? 'light' : 'dark';
        this.cache.root.className = newTheme;
    }

    // finds the task up the dom tree and returns its id
    static getTaskIdFromElement(descendentElem) {
        return descendentElem.closest(".full-task-div").id
    }

    static getBarLabelColor(percentVal) {
        let label = null, color = null
        const red = DomCtrl.cache.barCssVars.barColorRedName
        const yellow = DomCtrl.cache.barCssVars.barColorYellowName
        const teal = DomCtrl.cache.barCssVars.barColorTealName
        const green = DomCtrl.cache.barCssVars.barColorGreenName
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
            else {
                [label, color] = ["Complete!", green]
            }
        }
        return [label, color]
    }

    static getProgressBar(taskId) {
        const taskElem = this.myTaskElements.get(taskId)
        const progBar = taskElem.querySelector(".task-progress-bar")
        return progBar
    }

    static renderProgressBar(labelToUse, colorToUse, setToThisWidth, taskId) {
        const progBarElem = this.getProgressBar(taskId)
        const barColor = this.cache.barCssVars.barColorInUseName
        progBarElem.style.setProperty(DomCtrl.cache.barCssVars.barWidthName, setToThisWidth)
        // console.log(getComputedStyle(document.documentElement).getPropertyValue("--progress-bar-width"))
        progBarElem.dataset.label = labelToUse
        progBarElem.style.setProperty(barColor, `var(${colorToUse})`)
    }

    static completeBtnOnOff(taskId, allow) {
        // console.log(` > changeCompleteBtn()`)
        const taskElem = this.myTaskElements.get(taskId) 
        const confirmBtn = taskElem.querySelector("#primary-task > button")
        // confirmBtn.classList.remove("disable")
        // confirmBtn.classList.add("finalize")
        if (allow) {
            confirmBtn.classList.remove("disable")
            confirmBtn.classList.add("finalize")
        }
        else{
            confirmBtn.classList.add("disable")
            confirmBtn.classList.remove("finalize")
        }
        // console.log(taskElem)
    }    

    static markTaskComplete(taskId) {
        // console.log(` > completeTask()`)
        this.myTaskElements.get(taskId).classList.add("done")
        // myTaskElements.get(taskId).isFinished = true
    }

    static disAllowDiv(taskId) {
        // console.log(` > disAllowTaskDiv()`)
        const taskElem = this.myTaskElements.get(taskId)
        const parentDiv = taskElem.querySelector(".task-parent-div")
        parentDiv.classList.add("disAllow")
        // toggle allow
        // console.log(myTaskElements.get(taskId))
    }

    static collapseHiddenDiv(taskId, collapseThisCheckbox) {
        if (collapseThisCheckbox) {
            collapseThisCheckbox.checked = false
            return
        }
        const collapseCheckbox = this.myTaskElements.get(taskId).querySelector('input.expand[type="checkbox"]')
        collapseCheckbox.checked = false
    }

    static closeEditor(btnElem) {
        // useful if the btnElem has the info for which to open 
        // otherwise use toggleElemVisibility() instead
        // const divToShowClass = `.${btnElem.dataset.class_show}`
        const taskId = this.getTaskIdFromElement(btnElem)
        // console.log(`divClassToShow: ${divClassToShow}, divClassToHide: ${divClassToHide}`)
        // const divToShow = getElemFromTaskElemAndChildClassId(btnElem, divToShowClass)
        const divToShow = this.myTaskElements.get(taskId).querySelector(".task-details")
        // const divToHide = this.myTaskDomCtrlMap.get(taskId).taskDetailsDivInView
        const divToHide = this.myTaskElements.get(taskId).querySelector(".task-details-edit")
        // console.log({divToShow})
        this.toggleElemVisibility(divToShow, divToHide)
        taskDomCtrl.myTaskDomCtrlMap.get(taskId).taskDetailsDivInView = divToShow    
    }    

    static toggleElemVisibility(elemToShow, elemToHide) {
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
    static anchorTasksOptions(tasksOptionsBtnEl) {
        // console.log(tasksOptionsBtnEl)
        if (this.tasksOptionsPrev) {
            this.tasksOptionsPrev.id = ""
        }
        tasksOptionsBtnEl.id = "active-anchor"

        this.tasksOptionsPrev  = tasksOptionsBtnEl
        // make tasks-options-popover dialog remember which task it was opened for, 
        // so taskOptionsBtnEl btns know which task its btns corrodpond to
        const taskId = this.getTaskIdFromElement(tasksOptionsBtnEl)
        // console.log(DomCtrl.cache.tasksOptionsPopover)
        DomCtrl.cache.tasksOptionsPopover.dataset.anchoredToTaskId = taskId
        // check if the taskId main-div has disAllow
        const resetBtnDiv = DomCtrl.cache.tasksOptionsPopover.querySelector('.popover-reset')
        const editBtnDiv = DomCtrl.cache.tasksOptionsPopover.querySelector('.popover-edit')
        // console.log(resetBtnDiv)
        const completedTask = this.myTaskElements.get(taskId).classList.contains("done")
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

    static openEditor() {
        // open the editor by checking which full-task-div popover misc menu is at 
        const taskId = this.cache.tasksOptionsPopover.dataset.anchoredToTaskId
        const divToShow = this.myTaskElements.get(taskId).querySelector(".task-details-edit")
        const divToHide = this.myTaskElements.get(taskId).querySelector(".task-details")
        this.toggleElemVisibility(divToShow, divToHide)
        taskDomCtrl.myTaskDomCtrlMap.get(taskId).taskDetailsDivInView = divToShow
    }    

    static unCheckSubtasks(taskId) {
        const subtasksElem = this.myTaskElements.get(taskId).querySelectorAll('.task-parent-div > .hidden-div input[type="checkbox"]')
        // console.log(subtasks)
        subtasksElem.forEach((checkboxElem) => {
            checkboxElem.checked = false
        })
    }    

    static resetTaskElement(taskId) {
        this.myTaskElements.get(taskId).classList.remove("done")
        // app/task duty
        this.unCheckSubtasks(taskId)
        let pct = 0
        let [label, color] = this.getBarLabelColor(pct)
        this.renderProgressBar(label, color, `${pct}%`, taskId)
        this.completeBtnOnOff(taskId, false)
    }    

    static allowDiv(taskId) {
        const taskElem = this.myTaskElements.get(taskId)
        const parentDiv = taskElem.querySelector(".task-parent-div")
        parentDiv.classList.remove("disAllow")
    }    

    // find and return maintask element from child element 
    static getFullTaskDivElemFromChildElem(childElem) {
        const taskId = this.getTaskIdFromElement(childElem)
        const taskEl = this.myTaskElements.get(taskId)
        return taskEl 
    }
    
    // return the element from the childElem and child class/id
    // childElem -> mainTaskDiv -> childClassId (aka destination id) -> return elem with that id/class
    static getElemFromTaskElemAndChildClassId(childElem, childClassId) {
        const taskElem = this.getFullTaskDivElemFromChildElem(childElem)
        const resElem = taskElem.querySelector(childClassId)
        return resElem
    }
    
    static focusInputTextarea(focusInthisElem) {
        const inputElem = focusInthisElem.querySelector("input")
        if (inputElem !== null ) {
            inputElem.focus()
        }
        else {
            const textareaElem = focusInthisElem.querySelector("textarea")
            textareaElem.focus()
        }
    }

    static switchEditorField(clickedToggleBtn) {
        const targetDivClass = `.${event.target.value}`
        const taskId = DomCtrl.getTaskIdFromElement(clickedToggleBtn)
        const divToShow = this.getElemFromTaskElemAndChildClassId(clickedToggleBtn, targetDivClass)
        const divToHide = taskDomCtrl.myTaskDomCtrlMap.get(taskId).editFieldDivInView
        // console.log(hiddenEditFieldDiv)
        this.toggleElemVisibility(divToShow, divToHide)
        this.focusInputTextarea(divToShow)
        // save the opened div in view
        taskDomCtrl.myTaskDomCtrlMap.get(taskId).editFieldDivInView = divToShow
    }

    static addSubtaskDialog() {
        // console.log("newSubtaskDiv:",DomCtrl.cache.newSubtaskDivsContainer)
        const newSubTaskNo =  DomCtrl.cache.newSubtaskDivsContainer.children.length + 1
        const newSubtaskDivHtml = HtmlMaker.getSubtaskDialog(newSubTaskNo)
        DomCtrl.cache.newSubtaskDivsContainer.insertAdjacentHTML(
            "beforeend",
            newSubtaskDivHtml
        )
    }    

    static removeDiv(divToRemove) {
        // console.log(SubTaskDiv)
        divToRemove.remove()
    }    

    static addProjectToSideBar(formElem) {
        // DomCtrl.cache.userProjectsContainer
        const projectName = formElem.get("newProject")
        const projNum = this.cache.userProjectsContainer.children.length + 1
        const userProjectDiv = HtmlMaker.getProjectDiv(projNum, projectName)
        DomCtrl.cache.userProjectsContainer.insertAdjacentHTML(
            "beforeend",
            userProjectDiv
        )
    }    
        
}