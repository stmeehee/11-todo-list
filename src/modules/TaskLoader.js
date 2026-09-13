import Task from "./Task.js";

export default class TaskLoader {
    static testProjectNames = ["has 2","has 1", "has 2"]
    static testDates = [new Date(2026, 8, 15),new Date(2026, 8, 12), new Date(2026, 8, 11)]
    // simu;late loading tasks from this class
    static testLoadTasks(loadHowMany) {
        if (!loadHowMany) {
            throw new Error("missing loadHowMany arg!")
        }
        const tasksList = []
        let projName = null
        let testDate = null
        for (let i = 0; i < loadHowMany; i += 1) {
            projName = this.testProjectNames[i%this.testProjectNames.length]
            testDate = this.testDates[i%this.testDates.length]
            // console.log(testDate.toLocaleDateString())
            const task = new Task(null, projName)
            task.testSetDate(testDate)
            // task.isFinished = true
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

