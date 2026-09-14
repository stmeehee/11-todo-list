import Subtask from "./Subtask.js"
import Filter from "./Filter.js"


export default class Task {
    static defaultTaskProjectName = null
    #id = null
    #title= null
    #description = null
    #dueDate = null // use dueDate.dateMade.toLocaleTimeString()
    #time = null
    #priority = null
    #note = null
    #projectNames = new Set().add(Task.defaultTaskProjectName)
    #subtasks = []
    #finishedSubtasks = 0
    #unFinishedSubtasks = 0
    _isFinished = false
    #isDeleted = false
    #isOverdue = false
    #creationDate = Date.now()


    constructor(formData, testAddProjectName) {
        if (!formData) { // temp condition
            const testForm = this.testGetFormObj()
            this.setFields(testForm, "addProjectName", testAddProjectName)
            return
        }
        this.setFields(formData, true, null)
    }

    setFields(formData, addProjectName = true, forceAddProjectName) {
        let newProjName = null
        let time = null
        if (addProjectName) { 
            this.#id = Task.getNewId()
        }
        this.#title = formData.get("title")
        this.#description = formData.get("desc")
        this.#priority = formData.get("priority")
        this.#note = formData.get("note")
        time = (formData.get("pickTime") === "now")? (this.getCurrTime()) : formData.get("customTime")
        this.#time = time 
        // console.log(`picked time: ${time}`)
        this.#dueDate = new Date(formData.get("date"))
        this.addTimeToDate()
        // console.log(`time in setFields: ${time}`)
        if (addProjectName) {
            if (forceAddProjectName) {
                newProjName = forceAddProjectName
            }
            else {
                newProjName =  newProjName = formData.get("newProject") 
                                || formData.get("existingProject") 
                                || Task.defaultTaskProjectName;
            }
            this.#projectNames.add(newProjName)
        }
        if (addProjectName) {
            this.addSubtasks(formData)
            this.#unFinishedSubtasks = this.#subtasks.length 
        }
    }

    addTimeToDate() {
        const [hours, mins] = this.#time.split(":")
        this.#dueDate.setHours(hours, mins)
    }

    getCurrTime() {
        return new Date().toLocaleTimeString([], { hour12: false , hour: "2-digit", minute: "2-digit" })
    }

    static getNewId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
    }
    
    addSubtasks(formData) {
        for (const [k, v] of formData) {
            if (k.startsWith("subtaskTitle") && v !== "") {
                this.#subtasks.push(new Subtask(k, v))
            }
        }
    }

    edit(formData) {
        this.setFields(formData, false)
    }

    updateProgress(subtaskKey, isChecked) {
        if (!subtaskKey && !isChecked && this.getSubtasksSize() === 0) {
            this._isFinished = true
            return
        }
        let ticked = 0
        for (const subtask of this.#subtasks) {
            if (subtask.key === subtaskKey) {
                subtask.isDone = isChecked
            }
            if (subtask.isDone) {
                ticked += 1
            }
        }
        this.#finishedSubtasks = ticked
        this.#unFinishedSubtasks = this.#subtasks.length - this.#finishedSubtasks
        this.#checkIsFinished()
    }

    testGetFormObj() {
        const formObject = new FormData()
        formObject.append("title", "testTitle")
        formObject.append("desc", "testDesc")
        formObject.append("date", `${new Date()}`)
        formObject.append("pickTime", "noTnow")
        formObject.append("customTime", "07:10")
        formObject.append("priority", "high")
        formObject.append("newProject", "")
        formObject.append("note", "testAaa")
        // formObject.append("subtaskTitle1", "test - Do the dishes")
        // formObject.append("subtaskTitle2", "test - wash clothes")
        // formObject.append("subtaskTitle3", "test - pre-bedtime scream")
        // formObject.append("subtaskTitle4", "test - sleep")
        // formObject.append("subtaskTitle5", "test - sleep")
        // formObject.append("subtaskTitle6", "test - sleep")
        // formObject.append("subtaskTitle7", "test - sleep")
        // formObject.append("subtaskTitle8", "test - sleep")
        formObject.append("existingProject", "")
        return formObject
    }

    testSetDate(setTodDateObj) {
        this.#dueDate = setTodDateObj
    }

    testSetTime(hoursMins) {
        const [hours, minutes] = hoursMins.split(":")
        this.#time = `${hours}:${minutes}`
        this.#dueDate.setHours(hours, minutes)
    }

    toJSON() {
            const info = 
            {
                id: this.getShortId(),
                title: this.#title,
                description: this.#description,
                date: this.#dueDate,
                time: this.#time,
                priority: this.#priority,
                note: this.#note,
                projectNames: this.#projectNames,
                "subtasks size": this.#subtasks.list,
                finishedSubtasks: this.#finishedSubtasks,
                unFinishedSubtasks: this.#unFinishedSubtasks,
                _isFinished: this._isFinished
            }
            return info
        }
    
    set id(value) {
        this.#id = value
    }

    get id() {
        return this.#id
    }

    getShortId() {
        return this.#id.slice(0,3)
    }

    get taskProgress() {
        if (this.#subtasks.length === 0) {
            return 0
        }
        return (this.#finishedSubtasks / this.#subtasks.length) * 100
    }

    static testGetTask() {
        return new Task()
    }

    testSetTitle(setTo) {
        this.#title = setTo
    }

    get finishedSubtasks() {
        return this.#finishedSubtasks
    }

    get unFinishedSubtasks() {
        return this.#unFinishedSubtasks
    }    

    get isFinished() {
        return this._isFinished
    }   

    #checkIsFinished() {
        if (this.taskProgress === 100) {
            this._isFinished = true
        }
        else {
            this._isFinished = false
        }
    }    

    resetProgress() {
        this.resetAllSubtasks()
        this.#finishedSubtasks = 0
        this._isFinished = false
        this.#isOverdue = false
    }

    resetAllSubtasks() {
        for (const subtask of this.#subtasks) {
            subtask.isDone = false
        }
    }

    getSubtaskTitles() {
        const lst = []
        this.#subtasks.forEach( (subtask) => {
            lst.push(subtask.title)
        })
        return lst
    }

    get projectNames() {
        // return Array.from(this.#projectNames)
        return this.#projectNames
    }

    getInfo() {
        return {
            title: this.#title,
            dueDate: this.#dueDate.toLocaleDateString(),
            description: this.#description,
            time: this.#time,
            // tags
            priority: this.#priority,
            note: this.#note,
        }
    }

    getTags() {
        console.log("tags dont exist yet!")
        // TODO: add tags list private field and return return that list 
    }

    // removeProject(removeThisProject) {
    //     this.#projectNames.delete(removeThisProject)
    // }

    markAsDeleted() {
        this.#projectNames.clear()
        this.#projectNames.add("deleted tasks")
        this.#isDeleted = true
    }

    get dueDate() {
        return this.#dueDate
    }
    
    get creationDate() {
        return this.#creationDate
    }

    get isOverdue() {
        return this.#isOverdue
    }

    set isOverdue(value) {
        this.#isOverdue = value
    }


    getSubtasksSize() {
        return this.#subtasks.length
    }

    set isFinished(value) {
        this._isFinished = value
    }

    changeProject(changeProjectTo) {
        if (this.#projectNames.has("deleted tasks")) {
            console.log("cant move deleted project!")
            return
        }
        this.#projectNames.clear()
        this.#projectNames.add(changeProjectTo)
        this.#projectNames.add(Task.defaultTaskProjectName)
    }

    getCurrentProject() {
        let currentProject = [...this.#projectNames]
        .find(projectName => (projectName !== Task.defaultTaskProjectName) && (projectName !== "deleted tasks"))
        const res = (currentProject)? currentProject : null
        return res
    }

    get time() {
        return this.#time
    }

    formatToMilitaryTime(date) {
    const hours = String(date.getHours()).padStart(2,"0")
    const minutes = String(date.getDate()).padStart(2,"0")
    return `${hours}:${minutes}`
    }

    

    // set projectNames(name) {
    //     this.#projectNames = name
    // }


}

// test get subtasks progression
// const task = Task.testGetTask()

// task.updateProgress("subtaskTitle1", true)
// task.updateProgress("subtaskTitle1", false)
// task.updateProgress("subtaskTitle2", true)
// task.updateProgress("subtaskTitle3", true)
// task.updateProgress("subtaskTitle4", true)

// console.log(`tickedSubtasks: ${task.finishedSubtasks}`)
// console.log(`unTickedSubtasks: ${task.unFinishedSubtasks}`)

// let pct = task.taskProgress 
// console.log(task)
// console.log(`completed: ${pct}%`) // expected: 75%


