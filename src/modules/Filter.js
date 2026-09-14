import Task from "./Task.js"
import TaskLoader from "./TaskLoader.js"
export default class Filter {


    static getTasksDueChronological(allTasksMap, dueSooner = true) {
        // sort tasks from desceding-ascending (due sooner than later)
        const sortedChrono = [...allTasksMap.values()].sort( (taskA, taskB) => {
            return  ( dueSooner 
                ? taskA.dueDate - taskB.dueDate 
                : taskB.dueDate - taskA.dueDate )
        })
        return sortedChrono      
    }

    static getTasksIdOfUpcoming(allTasksMap) {
        const taskIdChronoOrder = this.getTasksDueChronological(allTasksMap, true)
        const overdue = new Set(this.getTaskIdOfOverdue(allTasksMap))
        const filteredUpcoming = taskIdChronoOrder
        .filter( task => (!overdue.has(task.id) && !task.isFinished && !task.isDeleted))
        .map(task => task.id)
        return filteredUpcoming
    }
    
    static getTaskIdOfOverdue(allTasksMap) {
        return [...allTasksMap.values()].filter( (task) => {
            // console.log(`task due on: ${task.getInfo().dueDate}`)
            // console.log(`today      : ${new Date().toLocaleDateString()}`)
            const present = Date.now()
            return ( task.dueDate.getTime() < present  )
        }).map(task => task.id)
    }

    static getTaskIdOfCompleted(tasksMap) {
        return [...tasksMap.values()].filter((task) => {
            return task.isFinished
        }).map(task => task.id)
    }

    // always pass in all tasks map, or it will incl. deleted tasks
    static getTaskIdByCreationDate(allTasksMap, oldestFirst = true) {
        return [...allTasksMap.values()].sort((taskA, taskB) => {
            // console.log(`taskA dateMade${taskA.creationDate}`)
            // console.log(`taskB dateMade${taskB.creationDate}`)
            return  (
                oldestFirst 
                ? taskA.creationDate - taskB.creationDate 
                : taskB.creationDate - taskA.creationDate
            )            
        }).map(task => task.id)
    }
}

// const DEAFULT_PROJECT_NAME = "All tasks"
// Task.defaultTaskProjectName = DEAFULT_PROJECT_NAME
// const projectMap = new Map()
// function makeProjectMap(taskListToLoad) {
//     for (const task of taskListToLoad) {
//         let taskProjectNames = task.projectNames
//         // console.log(taskProjectNames)
//         for (const projName of taskProjectNames) {
//             if (!projectMap.has(projName)) {
//                 projectMap.set(projName, new Map()) // {now: new Map(), later: new Map()}
//             }
//             projectMap.set(projName, projectMap.get(projName).set(task.id, task)) // {now: { {id: task} }}
//         }
//     }
//     if (!projectMap.has("deleted tasks")) {
//         projectMap.set("deleted tasks", new Map())
//     }
// }

// function init() {
//     const tasks = TaskLoader.testLoadTasks(3)
//     makeProjectMap(tasks)
// }

// function upcoming() {
//     // console.log(projectMap)
//     const upcoming = Filter.getTasksIdOfUpcoming(projectMap.get(DEAFULT_PROJECT_NAME), false)
//     upcoming.forEach((task) => {
//         console.log(`upcoming: ${task.getInfo().dueDate}`)
//     })
// }

// function testOverdue() {
//     const overdue = Filter.getTaskIdOfOverdue(projectMap.get(DEAFULT_PROJECT_NAME))
//     overdue.forEach((task) => {
//         console.log(`overdue tasks: ${task.getInfo().dueDate}`)
//     })    
// }

// function testCompleted() {
//     const completed = Filter.getTaskIdOfCompleted(projectMap.get(DEAFULT_PROJECT_NAME), false)
//     completed.forEach((task) => {
//         console.log(`completed tasks: ${task.getInfo().dueDate}`)
//     })  
// }

// function testGetTasksByCreationDate() {
//     const sortedByMakeDate = Filter.getTaskIdByCreationDate(projectMap.get(DEAFULT_PROJECT_NAME), false)
//     sortedByMakeDate.forEach((task) => {
//         console.log(`task cretion date | taskId: ${task.getShortId()} | time made: ${task.creationDate}`)
//     }) 
// }

// init()
// testUpcoming()
// testOverdue()
// testCompleted()
// testGetTasksByCreationDate()