export default class Subtasks {
    // key: i same as name="subtaskTitle1" for subtask html inputs
    key = null
    // title": is the value of above html from add subtask dialog
    title = null
    _isDone = false

    constructor(key, title) {
        this.key = key
        this.title = title
    }

    set isDone(boolean) {
        if (!typeof boolean == "boolean") {
            throw new Error("assign a boolean value to subtask!")
        }
        this._isDone = boolean
    }

    get isDone() {
        return this._isDone
    }

    
}