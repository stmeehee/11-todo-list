export default class Tracker {

    static max = 4
    _current = 0
    _isFinished = false

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
        if (this._current >= 0 && this._current <= Tracker.max) {
        // if (val  0 && val <= Tracker.max) {
            this._current = val
        }
        this.checkIsFinished()
    }

    get max() {
        return  Tracker.max
    }

    get isFinished() {
        return this._isFinished
    }    

    set isFinished(bool) {
        this._isFinished = bool
    }

    get currentPercent() {
        return (this.current / Tracker.max) * 100
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