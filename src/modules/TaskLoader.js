import Task from "./Task.js";

export default class TaskLoader {
    static testProjectNames = ["now","later", "now"]
    // simu;late loading tasks from this class
    static testLoadTasks(loadHowMany) {
        if (!loadHowMany) {
            throw new Error("missing loadHowMany arg!")
        }
        const tasksList = []
        let projName = null
        for (let i = 0; i < loadHowMany; i += 1) {
            projName = this.testProjectNames[i%this.testProjectNames.length]
            const task = new Task(null, projName)
            // task.id = Task.getNewId()
            tasksList.push(task)
        }
        return tasksList
    }

    // static #testGenerateId() {
    //     if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    //         return crypto.randomUUID();
    //     }
    // }   
}

function testPrintTasks() {
    const res = TaskLoader.testLoadTasks(3)
    res.forEach(task => {
        console.log(task.toJSON())
    });
}

// testPrintTasks()

