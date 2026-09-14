import "./style.css";
// import Task from "./task.js"; // NotUsing
import Task from "./modules/Task.js";
import DomCtrl from "./modules/DomCtrl.js";
import TaskLoader from "./modules/TaskLoader.js";
import Filter from "./modules/Filter.js";

// myViewingDivTasks: the tasks that are currently being viewed; chosen according to the viewingProject var
let projectMap = new Map()
const DEAFULT_PROJECT_NAME = "All tasks"
let viewingProject = null

function setViewingProject(setToProjectName) {
    viewingProject = setToProjectName
}

function prepareEditor(task) {
    const taskInfo = task.getInfo()
    const taskCurrentInfo =  {
        title: taskInfo.title,
        date: formatToLocalDate(task.dueDate),
        description: taskInfo.description,
        time: taskInfo.time,
        priority: taskInfo.priority,
        note: taskInfo.note
    }
    DomCtrl.addCurrentTaskInfoToEditor(task.id, taskCurrentInfo)
}

function formatToLocalDate(dateObj) {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2,"0")
    const day = String(dateObj.getDate()).padStart(2,"0")
    return `${year}-${month}-${day}`
}

function editTask(taskId, formData) {
    // console.log(taskId, formData.get("title"))
    const task = projectMap.get(DEAFULT_PROJECT_NAME).get(taskId)
    task.edit(formData)
    DomCtrl.updateTaskDetailsDiv(task)
}

function moveProject(taskId, moveToProject) {
    const task = projectMap.get(DEAFULT_PROJECT_NAME).get(taskId)
    const currProjectSet = task.getCurrentProject()
    if (currProjectSet.has(moveToProject)) {
        return false
    }
    task.changeProject(moveToProject)
    const projectToRmTask = [...currProjectSet].join("")
    projectMap.get(projectToRmTask).delete(task.id)
    projectMap.get(moveToProject).set(task.id, task)
    return true
}

function getExistingProjects() {
    const lst = [...projectMap.keys()].filter( (projectName) => {
       return (projectName !== "deleted tasks")
    })
    return lst
}

function checkAndMarkOverdueTasks() {
    const overdueTasksID = Filter.getTaskIdOfOverdue(projectMap.get(DEAFULT_PROJECT_NAME))
    const AllTasks = projectMap.get(DEAFULT_PROJECT_NAME)
    for (const overdueTaskId of overdueTasksID) {
        AllTasks.get(overdueTaskId).isOverdue = true
    }
}

/**
 * call this after setting the viewingProject to refresh the dom tasks to the given viewingProject
 * or pass in the 2 optional list & listName params to show tasks from a filtered list of tasks and
 * to give it an accompanying name in the dom
 * @param (string[]) displayTaskList - list of task UUID's to display for the assigned 
 * viewingProject; is accompanied by forceViewingDivName
 * @param string forceViewingDivName - set the viewing div name; this is the name for 
 * the displayTaskList tasks
 */
function refreshDomTasks(displayTaskList, forceViewingDivName) {
    if (displayTaskList && forceViewingDivName) {  
        DomCtrl.showTasks(forceViewingDivName, new Set(displayTaskList))
        return
    }
    // const projects = projectMap.get(viewingProject).keys()
    // const viewingProjectTaskIdSet = new Set(projects)
    const lst = projectMap.get(viewingProject)
    DomCtrl.showTasks(viewingProject, lst)
}

// set the task itself to replace its prev projects with "deleted tasks" project
// then add that task to deleted project map
function addTaskToDelete(task, deletedTasksMap) {
    task.markAsDeleted()
    deletedTasksMap.set(task.id, task)
    if (task.getSubtaskTitles().length > 0) {
        DomCtrl.collapseHiddenDiv(task.id)
    }
    DomCtrl.closeEditor(null, task.id)
    DomCtrl.disAllowFullTaskDiv(task.id)
}

// deletes an individual task
// by makign it forget about all projects and add "deleted tasks" to its projectNames set (addTaskToDelete())
// then removing that task from the project in projectMap  
function deleteAndRmTaskFromProjectMap(task) {
    for (const projectName of task.projectNames) {
        projectMap.get(projectName).delete(task.id)
    }
    addTaskToDelete(task, projectMap.get("deleted tasks"))
}

// del an entire project 
// by looping over that projects task and deleting them using (addTaskToDelete())
// then removing the project tiiself from project Map
function moveProjectTasksToDel(projNameToRm, projectMap) {
    for (const task of projectMap.get(DEAFULT_PROJECT_NAME).values()) {
        if (task.projectNames.has(projNameToRm)) {
            addTaskToDelete(task, projectMap.get("deleted tasks"))
            projectMap.get(DEAFULT_PROJECT_NAME).delete(task.id)
        }
        // also del the task from "all tasks" map
    }
    const boolDeleted = projectMap.delete(projNameToRm)
    return [boolDeleted, projNameToRm]
    // TODO: delete the projNameToRm tasks from "all tasks" project!
}

function addNewProjectToProjectMap(projectName) {
    projectMap.set(projectName, new Map())
}

function addProject(newProjName) {
    DomCtrl.addProjectToSideBar(newProjName)
    addNewProjectToProjectMap(newProjName)
    DomCtrl.collapseHiddenDiv(null, DomCtrl.cache.addNewProjectCheckBox)
}

function projectExists(newProjectName, existingProjects) {
    return new Set(existingProjects).has(newProjectName)
}

function newTask(formData) {
    const task = new Task(formData)
    addTaskToProjectMap(task)
    // TODO: 
    // saveTaskToStorage(projectMap) 
    displayTask(task)
    // TODO: add project to sidebar
    DomCtrl.setTaskElementsMap()
    checkAndMarkOverdueTasks()
    console.log(`added task: ${task.getShortId()} | isOverdue? = ${task.isOverdue}`)
}

function displayTask(task) {
    const ifViewingTaskProject = task.projectNames.has(viewingProject)
    if (ifViewingTaskProject) {
        DomCtrl.addNewTaskElemToDom(task)
    }
}

function addTaskToProjectMap(task) {
    for (const projName of task.projectNames) {
        const newProject = (projName !== "" && !projectMap.has(projName))
        if (newProject) {
            projectMap.set(projName, new Map()) // {now: new Map(), later: new Map()}
        }     
        projectMap.set(projName, projectMap.get(projName).set(task.id, task)) // {now: { {id: task} }}
    }
}   

// DomCtrl & app method
// TODO: break this apart!
function setMinDate() {
    const presentDate = new Date()
    const minDate = formatToLocalDate(presentDate)
    DomCtrl.setMinDate(minDate)
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
    const addNewTaskBtn = event.target.closest(".add-todo")
    const addDialogSubtask = event.target.closest(".add-subtask-option")
    const deleteProject = event.target.closest(".remove-project")
    const selectProject = event.target.closest(".select-project")
    const sidebarMenu = event.target.closest(".sidebar-main-div")
    const moveProjectBtn = event.target.closest("#existing-projects-popover > button[data-project-name]") // inside popup 
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
        const task = projectMap.get(viewingProject).get(taskId)
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
        DomCtrl.disAllowTaskParentDiv(taskId)
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
        const clickedToggleBtn = event.target
        // TODO: add task fields to editor inputs
        DomCtrl.switchEditorField(clickedToggleBtn)
    }
    if (cancelEditing) {
        // closetask-details-edit div and show task-details div
        const closeBtnElem = event.target
        DomCtrl.closeEditor(closeBtnElem)
    }
    if (taskOptionsPopupMenu) {
        const taskId = DomCtrl.getTaskOptionsPopupTaskId()
        const task = projectMap.get(viewingProject).get(taskId)        
        const btnClicked = event.target
        const editBtn = btnClicked.classList.contains("popover-edit") 
        const resetBtn = btnClicked.classList.contains("popover-reset")
        const delBtn = btnClicked.classList.contains("popover-delete")
        const moveProjectBtn = btnClicked.classList.contains("popover-move")
        if (editBtn) {
            prepareEditor(task)
            DomCtrl.openEditor()
        }
        if (resetBtn) {
            task.resetProgress()
            const subtasksExist = (task.getSubtaskTitles().length !== 0)
            DomCtrl.resetTaskElement(taskId, subtasksExist)
            DomCtrl.allowDiv(taskId)
        }
        if (delBtn) {
            deleteAndRmTaskFromProjectMap(task)
            // rm task from viewingProject dom by refreshing the dom
            // DomCtrl.buildProjectTasksElements(viewingProject, projectMap.get(viewingProject))
            refreshDomTasks()
        }
        if (moveProjectBtn) {
            const userMadeProjects = getExistingProjects().filter(project => project !== DEAFULT_PROJECT_NAME)
            DomCtrl.populateExistingProjectsPopover(userMadeProjects)
            // check event.target from the #existing-projects-popover menu now
        }
    }
    if (addNewTaskBtn) {
        DomCtrl.setExistingProjectsInNewTaskDialog(getExistingProjects()) 
        setMinDate()
    }
    if (addDialogSubtask) {
        const addTaskDialogBtn = event.target.closest(`button.new-subtask`)
        const rmTaskDialogBtn = event.target.closest(`button.remove-subtask`)
        if (addTaskDialogBtn) {
            DomCtrl.addSubtaskDialog()
        }
        if (rmTaskDialogBtn) {
            const subtaskDiv = rmTaskDialogBtn.closest(".subtask-div")
            DomCtrl.removeDiv(subtaskDiv)
        }        
    }    
    if (deleteProject) {
        const userProjectDiv = event.target.closest(".user-project")
        const userProjectName = userProjectDiv.querySelector("button[data-project-name]").dataset.projectName
        // rm project name from each task
        const [deleted, delProjectName] = moveProjectTasksToDel(userProjectName, projectMap)
        // rm projName key from projectMap
        projectMap.delete(userProjectName)
        DomCtrl.removeDiv(userProjectDiv)
        if (deleted && delProjectName === viewingProject) {
            setViewingProject(DEAFULT_PROJECT_NAME)
        }
        refreshDomTasks()   
        // removeProject()
        // expected: there are 2 now's and 1 later project, rming now == 1 project left
        // add rmed project to delete project
    }
    if (selectProject) {
        const projectSelected = event.target.closest(".select-project")
        // console.log(projectSelected.dataset.projectName)
        setViewingProject(projectSelected.dataset.projectName)
        refreshDomTasks()
    }
    if (sidebarMenu) {
        console.log(sidebarMenu)
        const allTasksBtn = event.target.closest("button[value='allTasks']")
        const upcomingTasksBtn = event.target.closest("button[value='upcomingTasks']")
        const overdueTasksBtn = event.target.closest("button[value='overdueTasks']")
        const completedTasksBtn = event.target.closest("button[value='completedTasks']")
        const deletedTasksBtn = event.target.closest("button[value='deletedTasks']")
        if (allTasksBtn) {
            setViewingProject(DEAFULT_PROJECT_NAME)
            refreshDomTasks()
        }
        if (upcomingTasksBtn) {
            console.log(upcomingTasksBtn)
            const upcoming = Filter.getTasksIdOfUpcoming(projectMap.get(DEAFULT_PROJECT_NAME)) // [a,b,c]
            refreshDomTasks(upcoming, "Upcoming")
        }
        if (overdueTasksBtn) {
            const overdue = Filter.getTaskIdOfOverdue(projectMap.get(DEAFULT_PROJECT_NAME))
            refreshDomTasks(overdue, "Overdue")
        }
        if (completedTasksBtn) {
            const completed = Filter.getTaskIdOfCompleted(projectMap.get(DEAFULT_PROJECT_NAME))
            refreshDomTasks(completed, "Completed")
        }
        if (deletedTasksBtn) {
            setViewingProject("deleted tasks")
            refreshDomTasks()
        }
    }
    if (moveProjectBtn) {
        // get the id from tasks-options-popover to get task to move
        const taskId = DomCtrl.getTaskOptionsPopupTaskId()
        const moveToProject = moveProjectBtn.closest("button[data-project-name]").dataset.projectName
        const moveSuccessful = moveProject(taskId, moveToProject)
        if (moveSuccessful) {
            refreshDomTasks()
            DomCtrl.cache.tasksOptionsPopover.hidePopover()
        }
        // console.log(moveToProject)
    }
}


function makeProjectMap(taskListToLoad) {
    for (const task of taskListToLoad) {
        let taskProjectNames = task.projectNames
        for (const projName of taskProjectNames) {
            if (!projectMap.has(projName)) {
                projectMap.set(projName, new Map()) // {now: new Map(), later: new Map()}
                // condition below is to not add "All tasks" as a project div
                if (projName !== DEAFULT_PROJECT_NAME ) {
                    addProject(projName)                            
                }
            }
            projectMap.set(projName, projectMap.get(projName).set(task.id, task)) // {now: { {id: task} }}
        }
    }
    if (!projectMap.has("deleted tasks")) {
        projectMap.set("deleted tasks", new Map())
    }
}

function printOverdueTasks() {
    for (const task of projectMap.get(DEAFULT_PROJECT_NAME).values()) {
        // const b = task
        console.log(`time for task ${task.getShortId()}: ${task.time} | overdue? ${task.isOverdue}`)
    }
}

// app
function init() {
    console.log(` > init()`)
    Task.defaultTaskProjectName = DEAFULT_PROJECT_NAME
    setViewingProject(DEAFULT_PROJECT_NAME)
    DomCtrl.cacheStaticDomElements()
    let tasksList = TaskLoader.testLoadTasks(3)
    makeProjectMap(tasksList)
    checkAndMarkOverdueTasks()
    // printOverdueTasks()
    
    DomCtrl.buildAllTasksElements(viewingProject, projectMap.get(viewingProject))
    DomCtrl.setTaskElementsMap()
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
            DomCtrl.cache.newTaskdialogBox.close()
            const newProjectName = myData.get("newProject")
            if (newProjectName !== "" && !projectExists(newProjectName, projectMap.keys())) {
                addProject(newProjectName)
            }            
            newTask(myData)
            // TODO: if a newproj is added via new task form, means that it gets added to projectMap and thus exists
            //      but it still wouldnt exist in the dom, figure out a way to add this proj to dom  
        }
        if (event.target.dataset.formName === "editForm") {
            console.log("editForm")
            console.log(Object.fromEntries(myData))
            const taskId = DomCtrl.getTaskIdFromElement(event.target)
            editTask(taskId, myData)
            const submitBtn = event.submitter
            // console.log(submitBtn)
            DomCtrl.closeEditor(submitBtn)
        }
        if (event.target.dataset.formName === ("newProject")) {
            // console.log("newProject")
            // console.log(Object.fromEntries(myData)) 
            const projName = myData.get("newProject")
            const projectsExists = projectExists(projName, projectMap.keys()) 
            if (!projectsExists) {
                addProject(projName)
            }
        }
    })
}

function main() {
    init()
}

main()
