// a test class for testing html, css
export default class Task {

    static max = 4
    _current = 0
    _isFinished = false

    // fields for checking
    title= null
    desc = null
    date = null
    priority = null
    note = null
    project = null
    subtasks = []

    constructor(taskId) {
        this._id = taskId
    }

    get taskId() {
        return this._id
    }

    get current() {
        return this._current
    }

    set current(val) {
        if (this._current >= 0 && this._current <= Task.max) {
        // if (val  0 && val <= Tracker.max) {
            this._current = val
        }
        this.checkIsFinished()
    }

    get max() {
        return  Task.max
    }

    get isFinished() {
        return this._isFinished
    }    

    set isFinished(bool) {
        this._isFinished = bool
    }

    get currentPercent() {
        return (this.current / Task.max) * 100
    }

    checkIsFinished() {
        if (this.currentPercent === 100) {
            this._isFinished = true
        }
        else {
            this._isFinished = false
        }
    }

}