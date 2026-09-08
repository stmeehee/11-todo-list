import Task from "./modules/Task.js"
import TaskLoader from "./modules/TaskLoader.js"
// const a = new Date()
// console.log(a.toLocaleTimeString())

let projectMap = new Map().set("allTasks", new Map())

function mapProjectToTasks(taskList) {
    for (const task of taskList) {

        let taskProjectNames = task.projectNames
        for (const projName of taskProjectNames) {
            if (!projectMap.has(projName)) {
                projectMap.set(projName, new Map()) // {now: new Map(), later: new Map()}
            }
            // projectMap.set("allTasks", projectMap.get("allTasks").set(task.getShortId(), task))
            projectMap.set(projName, projectMap.get(projName).set(task.getShortId(), task)) // {now: { {id: task} }}
        }
        
    }
}

function test() {
    let lst = TaskLoader.testLoadTasks(3)
    mapProjectToTasks(lst)
    console.log(projectMap)

    const getProjName = "allTasks"
    const resProject = projectMap.get(getProjName)
    const resProjObj = Object.fromEntries(resProject)

    console.log(`get project named "${getProjName}" size: ${resProject.size} `)
    console.log(`get project named "${getProjName}": ${JSON.stringify(resProjObj, null, 2)}`)
}

test()

