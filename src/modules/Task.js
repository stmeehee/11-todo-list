import Subtask from "./Subtask.js"


export default class Task {
    #id = null
    #title= null
    #description = null
    #date = null
    #time = null
    #priority = null
    #note = null
    #projectNames = ["allTasks"]
    #subtasks = []
    #finishedSubtasks = 0
    #unFinishedSubtasks = 0
    _isFinished = false

    constructor(formData, testAddProjectName) {
        if (!formData) { // temp condition
            const testForm = this.testGetFormObj()
            this.setFields(testForm, "addProjectName", testAddProjectName)
            return
        }
        this.setFields(formData, "addProjectName", null)
    }

    setFields(formData, addProjectName, forceAddProjectName) {
        let newProjName = null
        this.#title = formData.get("title")
        this.#description = formData.get("desc")
        this.#date = formData.get("date")
        this.#time = formData.get("pickTime")
        this.#priority = formData.get("priority")
        this.#note = formData.get("note")
        if (addProjectName) {
            if (forceAddProjectName) {
                newProjName = forceAddProjectName
            }
            else {
                newProjName = (formData.get("existingProject") !== "") 
                                    ? formData.get("existingProject")
                                    : (formData.get("newProject") || "All Tasks")
            }
            this.#projectNames.push(newProjName)
        }
        this.addSubtasks(formData)
        this.#unFinishedSubtasks = this.#subtasks.length 
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

    testGetFormObj() {
        const formObject = new FormData()
        formObject.append("title", "testTitle")
        formObject.append("desc", "testDesc")
        formObject.append("date", "test-2026-09-01")
        formObject.append("pickTime", "test-00:00")
        formObject.append("priority", "high")
        formObject.append("newProject", "mine")
        formObject.append("note", "testAaa")
        formObject.append("subtaskTitle1", "test - Do the dishes")
        formObject.append("subtaskTitle2", "test - wash clothes")
        formObject.append("subtaskTitle3", "test - pre-bedtime scream")
        formObject.append("subtaskTitle4", "test - sleep")
        formObject.append("existingProject", "")
        
        return formObject
    }

    toJSON() {
            return {
                id: this.getShortId(),
                title: this.#title,
                description: this.#description,
                date: this.#date,
                time: this.#time,
                priority: this.#priority,
                note: this.#note,
                projectNames: this.#projectNames,
                "subtasks size": this.#subtasks.list,
                finishedSubtasks: this.#finishedSubtasks,
                unFinishedSubtasks: this.#unFinishedSubtasks,
                _isFinished: this._isFinished
            };
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
        return (this.#finishedSubtasks / this.#subtasks.length) * 100
    }

    static testGetTask() {
        return new Task()
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
        this.finishedSubtasks = 0
        this._isFinished = false
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
        return this.#projectNames
    }

    getInfo() {
        return {
            title: this.#title,
            description: this.#description,
            dueDate: this.#date,
        }
    }

    getTags() {
        console.log("tags dont exist yet!")
        // TODO: add tags list private field and return return that list 
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


