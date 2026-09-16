import Subtask from "./Subtask.js"
import taskDomCtrl from "./taskDomCtrl.js"
import Utils from "./Utils.js"

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

    constructor(formData, newTask, testAddProjectName, edit) {
        if (!formData && testAddProjectName) { // temp condition
            const testForm = this.testGetFormObj()
            // add projectName
            this.setFields(testForm, true, testAddProjectName)
            return
        }
        this.setFields(formData, newTask, null)
    }

    setFields(formData, newTask = true, testAddProjectName = null, edit = false) {
        let ProjName = null
        let time = null
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
        if (newTask) {
            this.#id = Task.getNewId()
            if (testAddProjectName) {
                ProjName = testAddProjectName
            }
            else {
                ProjName =  ProjName = formData.get("newProject") 
                                || formData.get("existingProject") 
                                || Task.defaultTaskProjectName;
            }   
            this.#projectNames.add(ProjName)
            // adding just incase
            this.addNewSubtasks(formData)
            this.#unFinishedSubtasks = this.#subtasks.length 
        }
        if (!newTask && !edit) {
            this.#id = (!this.#id) ? formData.get("id") : this.#id
            const existingProjects = JSON.parse(formData.get("existingProject"))
            if (existingProjects.includes("deleted tasks")) {
                this.#projectNames = new Set().add("deleted tasks")
            }
            else {
                existingProjects.forEach(projName => this.#projectNames.add(projName))
            }
            const parsedSubtasks = JSON.parse(formData.get("subtasks"))
            this.addExistingSubtasks(parsedSubtasks)
            this.#unFinishedSubtasks = this.#subtasks.length     
            this.#finishedSubtasks = formData.get("finishedSubtasks")
            this._isFinished = JSON.parse(formData.get("isFinished"))
            this.#isDeleted = JSON.parse(formData.get("isDeleted"))
            this.#isOverdue = JSON.parse(formData.get("isOverdue"))
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
    
    addNewSubtasks(formData) {
        for (const [k, v] of formData) {
            if (k.startsWith("subtaskTitle") && v !== "") {
                this.#subtasks.push(new Subtask(k, v))
            }
        }
    }

    addExistingSubtasks(parsedSubtasks = null) {
        if (parsedSubtasks) {
            for (const subtask of parsedSubtasks) {
                const [k, v, isDone]  = [subtask.key, subtask.title, subtask.isDone]
                this.#subtasks.push(new Subtask(k, v, isDone))
            }
        }        
    }

    edit(formData) {
        this.setFields(formData, false, null, true)
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
        formObject.append("subtaskTitle1", "test - Do the dishes")
        // formObject.append("subtaskTitle2", "test - wash clothes")
        // formObject.append("subtaskTitle3", "test - pre-bedtime scream")
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
                id: this.#id,
                title: this.#title,
                description: this.#description,
                dueDate: Utils.formatToLocalDate(this.#dueDate),
                time: this.#time,
                priority: this.#priority,
                note: this.#note,
                projectName: [...this.#projectNames],
                subtasks: this.#subtasks.map(subtask => subtask.toJSON()),
                finishedSubtasks: this.#finishedSubtasks,
                // unFinishedSubtasks: this.#unFinishedSubtasks,
                isFinished: this._isFinished,
                isDeleted: this.#isDeleted,
                isOverdue: this.#isOverdue,
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

    markAsDeleted() {
        this.#projectNames.clear()
        this.#projectNames.add("deleted tasks")
        this.#isDeleted = true
    }

    get dueDate() {
        return this.#dueDate
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
            // console.log("cant move deleted project!")
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

    get isDeleted() {
        return this.#isDeleted
    }

    get subtasks() {
        return this.#subtasks
    }

    get finishedSubtasks() {
        return this.#finishedSubtasks
    }

}

