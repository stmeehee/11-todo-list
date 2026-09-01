import "./style.css";
import Tracker from "./trackers.js";

// tasksOptionsPrev is the last cicked .tasksOptions btn, we keep it to remove the anchor-active id from it
// when a new btn is clicked
let tasksOptionsPrev = null
let domCache = null
let myTrackers = new Map()
let myTaskElements = new Map()

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
    // console.log(` > getDomElements()`)
    const root = document.documentElement;
    const body = document.querySelector("body")
    const allTasksElem = document.querySelectorAll(".all-tasks-div > div")
    const barCssVars =  {
        barWidthName: "--progress-bar-width",
        barColorInUseName: "--bg-progress-bar-color",
        barColorRedName: "--bg-progress-bar-empty",
        barColorYellowName: "--bg-progress-bar-normal",
        barColorTealName: "--bg-progress-bar-inComplete",
        barColorGreenName: "--bg-progress-bar-complete",
    }
    // console.log(BarColors.cssVarColorInUse)

    return {root, body, allTasksElem, barCssVars}
}

// allTrackers.get(id).object
// allTrackers.get(id).element

function disAllowTaskDiv(taskId) {
    // console.log(` > disAllowTaskDiv()`)
    myTaskElements.get(taskId).classList.add("done")
    // console.log(myTaskElements.get(taskId))
}

function completeTask(taskId) {
    console.log(` > completeTask()`)
    myTaskElements.get(taskId).finished = true
}

function changeCompleteBtnPermit(taskId, allow) {
    console.log(` > changeCompleteBtn()`)
    // TODO:
    const taskElem = myTaskElements.get(taskId) 
    const confirmBtn = taskElem.querySelector("#primary-task > button")
    confirmBtn.classList.remove("disable")
    confirmBtn.classList.add("finalize")
    if (allow) {
        confirmBtn.classList.remove("disable")
        confirmBtn.classList.add("finalize")
    }
    else{
        confirmBtn.classList.add("disable")
        confirmBtn.classList.remove("finalize")
    }
    console.log(taskElem)
}

// finds the task up the dom tree and returns its id
function getTaskElementId(descendentElem) {
    return descendentElem.closest(".full-task-div").id
}

// trackers.1a.current
// trackers.1b.current

function getProgressBar(taskId) {
    const taskElem = myTaskElements.get(taskId)
    const progBar = taskElem.querySelector(".task-progress-bar")
    return progBar
        // const progBar = myTaskElements.get(taskId).querySelector(".task-progress-bar")

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

function updateProgress(isChecked, taskId) {
    const tracker = myTrackers.get(taskId)
    // console.log(` > updateProgress()`)
    // console.log(`task id clicked: ${tracker._id}`)    
    if (isChecked) {
        tracker.current += 1
    }
    else {
        tracker.current -= 1
    }
    // console.log(`current: ${tracker.current}`)
    // console.log("myTrackers after updateing current: ")
    // console.log(myTrackers)
    // let label = null
    // let color = null
    // let percent = (tracker.current / Tracker.max ) * 100
    // if (percent === 0)
    //     color = percent, "red"
    // else if (percent > 0 && percent < 100) {
    //     label, color = percent, "yellow"
    //     changeCompleteBtnPermit(taskId, false)
    // }
    // else {
    //     // task is either finished or waiting for user to click complete
    //     if (percent === 100 && !tracker.finished) {
    //         label, color = percent, "teal"
    //         changeCompleteBtnPermit(taskId, true)
    //     }
    //     else {
    //         label, color = percent, "green"
    //     }
    // // renderProgressBar(label, color, taskId)
    // return {label, color}
    // }
}

function getBarLabelColor(percentVal) {
    let label = null, color = null
    const red = domCache.barCssVars.barColorRedName
    const yellow = domCache.barCssVars.barColorYellowName
    const teal = domCache.barCssVars.barColorTealName
    const green = domCache.barCssVars.barColorGreenName
    if (percentVal === 0)
        [label, color] = [`${percentVal} %`, red]
    else if (percentVal > 0 && percentVal < 100) {
        [label, color] = [`${percentVal} %`, yellow]
    }
    else {
        // task is either finished or waiting for user to click complete
        if (percentVal === 100 && !tracker.finished) {
            [label, color] = ["In limbo...", teal]
        }
        else {
            [label, color] = ["Complete!", green]
        }
    // renderProgressBar(label, color, taskId)
    }
    return [label, color]
}

// change the label and color for the given taskID
function renderProgressBar(labelToUse, colorToUse, setToThisWidth, taskId) {
    // const taskTracker = myTrackers.get(taskId)
    const progBarElem = getProgressBar(taskId)
    // const value = `${(taskTracker.current / Tracker.max ) * 100}`
    const barColor = domCache.barCssVars.barColorInUseName
    // let colorToUse = null
    // let labelToUse = `${value} %`

    // // console.log(domCache.progressBarBefore)
    // if (value === 0) {
    //     colorToUse = `var(${domCache.BarColors.cssVarColorRed})`
    // }
    // else if (value > 0 && value < 100) {
    //     colorToUse = `var(${domCache.BarColors.cssVarColorYellow})`
    //     changeCompleteBtnPermit(taskId, false)
    // }
    // else {
    //     // task is either finished or waiting for user to click complete
    //     if (value === 100 && !taskTracker.finished) {
    //         colorToUse = `var(${domCache.BarColors.cssVarColorTeal})`
    //         labelToUse = `Task in limbo...`
    //         changeCompleteBtnPermit(taskId, true)
    //     }
    //     else {
    //         progBarElem.style.setProperty("--bg-progress-bar-color", "var(--bg-progress-bar-complete)")
    //         labelToUse = `Complete!`
    //         changeCompleteBtnPermit(taskId, false)
    //     }
    // }
    progBarElem.style.setProperty(domCache.barCssVars.barWidthName, setToThisWidth)
    console.log(getComputedStyle(document.documentElement).getPropertyValue("--progress-bar-width"))
    progBarElem.dataset.label = labelToUse
    progBarElem.style.setProperty(barColor, `var(${colorToUse})`)
}

function setTheme() {
    const newTheme = domCache.root.className === 'dark' ? 'light' : 'dark';
    domCache.root.className = newTheme;
}

function delegate(event) {
    // console.log(`event --> delegate(): elem clicked =`)
    console.log(event.target)
    let taskId = null
    if (event.target.closest(".theme-toggle")) {
        setTheme()
    }
    if (event.target.closest(".task-children-div") && event.target.type == "checkbox") {
        // console.log(`checkbox state: ${event.target.checked}, from: ${event.target.type}`)
        // console.log(event.target)
        const checkBoxElem = event.target
        const isChecked = checkBoxElem.checked
        taskId = getTaskElementId(checkBoxElem)
        updateProgress(checkBoxElem.checked, taskId)
        let pct = myTrackers.get(taskId).currentPercent
        let [label, color] = getBarLabelColor(pct)
        renderProgressBar(label, color, `${pct}%`, taskId)
    }
    if (event.target.closest(".tasks-options")) {
        // console.log(event.target.closest(".tasks-options"))
        const taskOptionsBtn = event.target.closest(".tasks-options")
        anchorTasksOptions(taskOptionsBtn)
    }
    if (event.target.closest(".finalize")) {
        const confirmBtn = event.target
        console.log(confirmBtn)
        taskId = getTaskElementId(confirmBtn)
        completeTask(taskId)
        // TODO: make the progress bar turn green!
        // renderProgressBar()
        disAllowTaskDiv(taskId)
    }
}



function setTrackersAndTaskElements() {
    console.log(` > getTrackers()`)
    for (const task of domCache.allTasksElem) {
        let id = task.id
        myTrackers.set(id, new Tracker(id))
        myTaskElements.set(id, task)
    }
    // console.log(myTrackers.get("1a"))
}


function init() {
    console.log(` > init()`)
    domCache = getDomElements()
    setTrackersAndTaskElements()
    // console.log({myTrackers})
    // console.log({myTaskElements})

    domCache.body.addEventListener("click", (event) => {
        delegate(event)
    })
}

function main() {
    document.documentElement.className = "dark"
    init()
}

main()