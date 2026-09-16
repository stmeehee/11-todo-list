import Task from "./modules/Task.js"
import Persistence from "./modules/Persistence.js"
// const a = new Date()
// console.log(a.toLocaleTimeString())



function test() {
const taskList = Persistence.testLoadTasks(1)
const TaskListStr = JSON.stringify(taskList, " | ", 1)
// console.log("taskList stringified")
// console.log(TaskListStr)
// console.log()

// console.log("taskList back to plain object")
// console.log(JSON.parse(TaskListStr)[0])
// console.log()

// console.log("to get conv. taskList subtasks :") 
// console.log(JSON.parse(TaskListStr)[0].subtasks)
// console.log()




}


test()


// taskList[0].toJSON():
//
// {
//   id: '3794f124-9c52-49c7-aa39-f3728ec97965',
//   title: 'a in X',
//   description: 'testDesc',
//   date: 2026-09-16T00:00:00.000Z,
//   time: '05:00',
//   priority: 'high',
//   note: 'testAaa',
//   projectName: 'My Project X',
//   subtasks: [
//     {
//       isDone: false,
//       key: 'subtaskTitle1',
//       title: 'test - Do the dishes'
//     }
//   ],
//   finishedSubtasks: 0,
//   unFinishedSubtasks: 1,
//   _isFinished: false,
//   isDeleted: false,
//   isOverdue: false
// }