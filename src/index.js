import "./style.css";

// tasksOptionsPrev is the last cicked .tasksOptions btn, we keep it to remove the anchor-active id from it
// when a new btn is clicked
let tasksOptionsPrev = null
let domCache = null

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

function anchorTasksOptions(tasksOptionsBtnEl) {
    if (tasksOptionsPrev) {
        tasksOptionsPrev.id = ""
    }
    tasksOptionsBtnEl.id = "active-anchor"
    tasksOptionsPrev  = tasksOptionsBtnEl
    // console.log(`after adding active-anchor id:`)
    //     console.log(tasksOptionsBtnEl)
}

function getDomElements() {
    const root = document.documentElement;
    const body = document.querySelector("body")
    const progressBar = document.querySelector(".task-progress-bar")
    const progressBarBefore = document.querySelector(".task-progress-bar::before")

    return {root, body, progressBar, progressBarBefore}
}

function updateProgress(isChecked) {
    if (isChecked) {
        tracker.current += 1
    }
    else {
        tracker.current -= 1
    }
    console.log(`current: ${tracker.current}`)
    renderProgressBar()

    function renderProgressBar() {
        let newPct = `${(tracker.current / 4 ) * 100}%`
        domCache.progressBar.dataset.label = `${newPct} %`
        domCache.progressBar.style.setProperty("--progress-bar-width", newPct)
        // console.log(domCache.progressBarBefore)
        if (tracker.current === 0)
            domCache.progressBar.style.setProperty("--bg-progress-bar-color", "var(--bg-progress-bar-empty)")
        else if (tracker.current > 0 && tracker.current < tracker.max) {
            domCache.progressBar.style.setProperty("--bg-progress-bar-color", "var(--bg-progress-bar-normal)")
        }
        else {
            domCache.progressBar.style.setProperty("--bg-progress-bar-color", "var(--bg-progress-bar-complete)")
            domCache.progressBar.dataset.label = `Complete!`
        }
    }
}

function setTheme() {
    const newTheme = domCache.root.className === 'dark' ? 'light' : 'dark';
    domCache.root.className = newTheme;
}

function delegate(event) {
    console.log(`event --> delegate(): elem clicked =`)
    console.log(event.target)
    if (event.target.closest(".theme-toggle")) {
        setTheme()
    }
    if (event.target.closest(".task-children-div") && event.target.type == "checkbox") {
        console.log(`checkbox state: ${event.target.checked}, from: ${event.target.type}`)
        updateProgress(event.target.checked)
    }
    if (event.target.closest(".tasks-options")) {
        // console.log(event.target.closest(".tasks-options"))
        const taskOptionsBtn = event.target.closest(".tasks-options")
        anchorTasksOptions(taskOptionsBtn)
    }
    // if (event.target.closest(".tasks-options")) {

    // }
}

function init() {
    domCache = getDomElements()

    domCache.body.addEventListener("click", (event) => {
        delegate(event)
    })
}

function main() {
    document.documentElement.className = "dark"
    init()
}

main()