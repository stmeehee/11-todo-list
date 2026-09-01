export default class Tracker {

    static max = 4
    _current = 0
    _finished = false

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
    }

    get max() {
        return  Tracker.max
    }

    get finished() {
        return this._finished
    }    

    set finished(bool) {
        this._finished = bool
    }

    get currentPercent() {
        return (this.current / Tracker.max) * 100
    }

}