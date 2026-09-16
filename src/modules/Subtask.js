export default class Subtasks {
    // key: i same as name="subtaskTitle1" for subtask html inputs
    key = null
    // title": is the value of above html from add subtask dialog
    title = null
    _isDone = false

    constructor(key, title, isDone = false) {
        this.key = key
        this.title = title
        this._isDone = isDone
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

    toJSON() {
        return {
            isDone: this._isDone, 
            key: this.key,
            title: this.title,
        }
    }

}