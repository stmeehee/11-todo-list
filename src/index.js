import "./style.css";
import Tracker from "./trackers.js";

// tasksOptionsPrev is the last cicked .tasksOptions btn, we keep it to remove the anchor-active id from it
// when a new btn is clicked
let tasksOptionsPrev = null
let domCache = null
let myTrackers = new Map()

const tracker = (() => {
    const max = 4
    let current = 0 

    return {
        get current() {
            return  current
        },
        set current(val) {
            if (current >= 0 && current <= max) {
                current = val
            }
            return
        },
        get max() {
            return  max
        },
    }
})();

function getDomElements() {
    const root = document.documentElement;
    const body = document.querySelector("body")
    // const progressBar = document.querySelector(".task-progress-bar")
    // const progressBarBefore = document.querySelector(".task-progress-bar::before")
    const allTasksElem = document.querySelectorAll(".all-tasks-div > div")

    return {root, body, allTasksElem}
}

function getTaskId(descendentElem) {
    return descendentElem.closest(".full-task-div").id
}

// trackers.1a.current
// trackers.1b.current

function getProgressBar(progBarAncestorElem) {
    const task = progBarAncestorElem.closest(".full-task-div")
    const progBar = task.querySelector(".task-progress-bar")
    return progBar
}


function anchorTasksOptions(tasksOptionsBtnEl) {
    if (tasksOptionsPrev) {
        tasksOptionsPrev.id = ""
    }
    tasksOptionsBtnEl.id = "active-anchor"
    tasksOptionsPrev  = tasksOptionsBtnEl
    // console.log(`after adding active-anchor id:`)
    //     console.log(tasksOptionsBtnEl)
}

function updateProgress(isChecked, progBarElem, taskId) {
    console.log(` > updateProgress()`)
    const tracker = myTrackers.get(taskId)
    console.log(`task id clicked: ${tracker._id}`)    
    if (isChecked) {
        tracker.current += 1
    }
    else {
        tracker.current -= 1
    }
    console.log(`current: ${tracker.current}`)
    console.log("myTrackers after updateing current: ")
    console.log(myTrackers)
    renderProgressBar(progBarElem)

    function renderProgressBar() {
        let newPct = `${(tracker.current / 4 ) * 100}%`
        progBarElem.dataset.label = `${newPct}`
        progBarElem.style.setProperty("--progress-bar-width", newPct)
        // console.log(domCache.progressBarBefore)
        if (tracker.current === 0)
            progBarElem.style.setProperty("--bg-progress-bar-color", "var(--bg-progress-bar-empty)")
        else if (tracker.current > 0 && tracker.current < tracker.max) {
            progBarElem.style.setProperty("--bg-progress-bar-color", "var(--bg-progress-bar-normal)")
        }
        else {
            progBarElem.style.setProperty("--bg-progress-bar-color", "var(--bg-progress-bar-complete)")
            progBarElem.dataset.label = `Complete!`
        }
    }
}

function setTheme() {
    const newTheme = domCache.root.className === 'dark' ? 'light' : 'dark';
    domCache.root.className = newTheme;
}

function delegate(event) {
    // console.log(`event --> delegate(): elem clicked =`)
    // console.log(event.target)
    if (event.target.closest(".theme-toggle")) {
        setTheme()
    }
    if (event.target.closest(".task-children-div") && event.target.type == "checkbox") {
        // console.log(`checkbox state: ${event.target.checked}, from: ${event.target.type}`)
        console.log(event.target)
        const checkBoxElem = event.target
        const isChecked = checkBoxElem.checked
        const taskId = getTaskId(checkBoxElem)
        let progBarElem = getProgressBar(checkBoxElem)
        updateProgress(isChecked, progBarElem, taskId)
    }
    if (event.target.closest(".tasks-options")) {
        // console.log(event.target.closest(".tasks-options"))
        const taskOptionsBtn = event.target.closest(".tasks-options")
        anchorTasksOptions(taskOptionsBtn)
    }
    // if (event.target.closest(".tasks-options")) {

    // }
}

function getTrackers() {
    console.log(` > getTrackers()`)
    for (const task of domCache.allTasksElem) {
        let id = task.id
        myTrackers.set(id, new Tracker(id))
    }
    // console.log(myTrackers.get("1a"))
}

function init() {
    console.log(` > init()`)
    domCache = getDomElements()
    getTrackers()
    // console.log(myTrackers)

    domCache.body.addEventListener("click", (event) => {
        delegate(event)
    })
}

function main() {
    document.documentElement.className = "dark"
    init()
}

main()