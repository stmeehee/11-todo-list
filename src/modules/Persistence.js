import Task from "./Task.js";

Task.defaultTaskProjectName = "All tasks"

export default class Persistence {
    static LOCAL_STORAGE_SAVE_KEY = "11-todo-list"
    static testProjectNames = ["My Project X","My Project Y", "has 2"]
    static testDates = [new Date(2026, 8, 16 ),new Date(2026, 8, 16), new Date(2026, 8, 11)]
    static testTitles = ["a in X", "b in Y", "c"]

    // simu;late loading tasks from this class
    static testLoadTasks(loadHowMany) {
        if (!loadHowMany) {
            throw new Error("missing loadHowMany arg!")
        }
        const tasksList = []
        let projName = null
        let testDate = null
        let testTitle = null
        for (let i = 0; i < loadHowMany; i += 1) {
            projName = this.testProjectNames[i%this.testProjectNames.length]
            testDate = this.testDates[i%this.testDates.length]
            testTitle = this.testTitles[i%this.testTitles.length]
            // console.log(testDate.toLocaleDateString())
            const task = new Task(null, true, projName)
            task.testSetDate(testDate)
            task.testSetTitle(testTitle)
            task.testSetTime("06:00")
            // console.log(task.dueDate)
            // task.isFinished = true
            // task.id = Task.getNewId()
            tasksList.push(task)
        }
        return tasksList
    }

    static save(taskList) {
        // console.log("> Persistence.save() ")
        if (!taskList) {
            throw new Error("tasksList is null!")
        }        
        if (typeof(Storage) === undefined) {
            // console.log("could not save")        
            return
        }        
        // const taskList = (!Array.isArray(taskList)) ? [...taskList] : taskList
        const plainTaskObjList = []
        for (const task of taskList) {
            const plainTaskObj = task.toJSON()
            // console.log(plainTaskObj.id)
            plainTaskObjList.push(plainTaskObj)
        }
        localStorage.setItem(this.LOCAL_STORAGE_SAVE_KEY, JSON.stringify(plainTaskObjList))
        // console.log("saved!")
    }

    static load(testRawStrTask) {
        // console.log(" > Persistence.load()")
        const loadedTasksList = []
        let loadedTaskRawStr = null
        if (!testRawStrTask) {
            if (typeof(Storage) === undefined) {
                // console.log("could not load!")        
                return
            }           
            loadedTaskRawStr = localStorage.getItem(this.LOCAL_STORAGE_SAVE_KEY)
            if (!loadedTaskRawStr || JSON.parse(loadedTaskRawStr).length === 0) {
                // console.log("nothing to load! loading a test task")
                return Persistence.testLoadTasks(2)
            }
        }
        const loadedPlainTaskList = (testRawStrTask)? JSON.parse(testRawStrTask) : JSON.parse(loadedTaskRawStr)
        // console.log("loaded data")
        // console.log(loadedTaskList)
        for (const plainTask of loadedPlainTaskList) {
            const formData = this.convToFormData(plainTask)
            loadedTasksList.push(new Task(formData, false))
        }
        return loadedTasksList
    }

    static convToFormData(plainTaskObj) {

        const formObject = new FormData()
        formObject.append("title", plainTaskObj.title)
        formObject.append("desc", plainTaskObj.description)
        formObject.append("date", plainTaskObj.dueDate)
        formObject.append("pickTime", "notNow")
        formObject.append("customTime", plainTaskObj.time)
        formObject.append("priority", plainTaskObj.priority)
        formObject.append("note", plainTaskObj.note)
        // loaded task properties: ids, projName, unFinishedSubtasks, isfinished, isDeleted, isOverdue 
        formObject.append("id", plainTaskObj.id)                
        formObject.append("existingProject", JSON.stringify(plainTaskObj.projectName))
        formObject.append("subtasks", JSON.stringify(plainTaskObj.subtasks))
        formObject.append("finishedSubtasks", plainTaskObj.finishedSubtasks)
        formObject.append("isFinished", plainTaskObj.isFinished)
        formObject.append("isDeleted", plainTaskObj.isDeleted)
        formObject.append("isOverdue", plainTaskObj.isOverdue)
        return formObject       
    }

    // static addSubtaskToFormData(subtaskList, formDataObj) {
    //     for (const subtask of subtaskList) {
    //         formDataObj.append()
    //     }
    // }
}

function testPrintTasks() {
    const res = Persistence.testLoadTasks(3)
    res.forEach(task => {
        console.log(task.toJSON())
    });
}

function testSave() {
    const taskList = Persistence.testLoadTasks(1)
    Persistence.save(taskList)
}

function testLoad(rawStrTask) {
    const loaded = Persistence.load(rawStrTask)
    console.log(loaded)
}

// testPrintTasks()
// testSave()

// testLoad(rawTaskToLoad)

const rawTaskToLoad = 
`
[
    {
    "id": "5b18f09a-e100-4025-ad75-975b1777e0b5",
    "title": "a in X",
    "description": "testDesc",
    "dueDate": "2026-09-16",
    "time": "06:00",
    "priority": "high",
    "note": "testAaa",
    "projectName": "My Project X",
    "subtasks": [
        {
        "isDone": false,
        "key": "subtaskTitle1",
        "title": "test - Do the dishes"
        }
    ],
    "finishedSubtasks": 0,
    "isFinished": false,
    "isDeleted": false,
    "isOverdue": false
    }
]
`