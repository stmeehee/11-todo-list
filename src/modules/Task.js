import Subtask from "./Subtask.js"


export default class Task {
    #title= null
    #description = null
    #date = null
    #time = null
    #priority = null
    #note = null
    #projectName = null
    #subtasks = []
    #finishedSubtasks = 0
    #unFinishedSubtasks = 0
    _isFinished = false
    testFormData = this.testAddFieldsToForm(new FormData())

    constructor(formData) {
        if (!formData) { // temp condition
            this.setFields(this.testFormData, "addProjectName")
            return
        }
        this.setFields(testFormData, "addProjectName")
    }

    setFields(formData, addProjectName) {
        this.#title = formData.get("title")
        this.#description = formData.get("desc")
        this.#date = formData.get("date")
        this.#time = formData.get("pickTime")
        this.#priority = formData.get("priority")
        this.#note = formData.get("note")
        if (addProjectName) {
            this.projectName = (formData.get("existingProject") !== "") 
                                ? formData.get("existingProject")
                                : (formData.get("newProject") || "All Tasks")
        }
        this.subtask = this.addSubtasks(formData)
    }
    
    addSubtasks(formData) {
        for (const [k, v] of formData) {
            if (k.startsWith("subtaskTitle") && v !== "") {
                this.#subtasks.push(new Subtask(k, v))
            }
        }
    }

    // set subtasks(subtaskObj) {
    //     if (!subtaskObj instanceof Subtask) {
    //         throw new Error("Can only assign a subtask of type Subtask")            
    //     }
    //     this._subtask = subtaskObj 
    // }

    edit(formData) {
        this.setFields(formData)
    }

    // updateProgress(isChecked) {
    //     const Task = myTasks.get(taskId)
    //     // console.log(` > updateProgress()`)
    //     // console.log(`task id clicked: ${Task._id}`)    
    //     if (isChecked) {
    //         this.current += 1
    //     }
    //     else {
    //         this.current -= 1
    //     }
    // }

    updateProgress(subtaskKey, isChecked) {
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
        this.#unFinishedSubtasks = this.#subtasks.length - this.finishedSubtasks
        this.#checkIsFinished()
    }

    // creates every task object with testFormData for testing
    // will later load task data from local storage
    // testGetTaskMap(howMany) {
    //     let map = new Map()
    //     for (let i = 0; i < howMany; i += 1) {
    //         map.set(id, new Task())
    //     }
    //     return map
    // }

    testAddFieldsToForm(formObject) {

        formObject.append("title", "testTitle")
        formObject.append("desc", "testDesc")
        formObject.append("date", "test-2026-09-01")
        formObject.append("pickTime", "test-00:00")
        formObject.append("priority", "high")
        formObject.append("newProject", "test")
        formObject.append("note", "testAaa")
        formObject.append("subtaskTitle1", "test - Do the dishes")
        formObject.append("subtaskTitle2", "test - wash clothes")
        formObject.append("subtaskTitle3", "test - pre-bedtime scream")
        formObject.append("subtaskTitle4", "test - sleep")
        return formObject
    }

    get taskProgress() {
        return (this.#finishedSubtasks / this.#subtasks.length) * 100
    }

    static testGetTask() {
        return new Task()
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
        this.finishedSubtasks = 0
        this._isFinished = false
    }

    resetAllSubtasks() {
        for (const subtask of this.#subtasks) {
            subtask.isDone = false
        }
    }

}

// test get subtasks progression
const task = Task.testGetTask()

task.updateProgress("subtaskTitle1", true)
task.updateProgress("subtaskTitle1", false)
task.updateProgress("subtaskTitle2", true)
task.updateProgress("subtaskTitle3", true)
task.updateProgress("subtaskTitle4", true)

console.log(`tickedSubtasks: ${task.finishedSubtasks}`)
console.log(`unTickedSubtasks: ${task.unFinishedSubtasks}`)

let pct = task.taskProgress 
console.log(`completed: ${pct}%`) // expected: 75%

