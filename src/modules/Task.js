import Subtask from "./Subtask.js"


export default class Task {
    title= null
    description = null
    date = null
    priority = null
    note = null
    projectName = null
    _subtasks = []

    constructor(formData) {
        this.setFields(formData, "addProjectName")
    }

    setFields(formData, addProjectName) {
        this.title = formData.get("title")
        this.description = formData.get("desc")
        this.date = formData.get("date")
        this.priority = formData.get("priority")
        this.note = formData.get("note")
        if (addProjectName) {
            this.projectName = (formData.get("existingProject") !== "") 
                                ? formData.get("existingProject")
                                : (formData.get("newProject") || "All Tasks")
        }
        this.subtask = addSubtasks(formData)
    }
    
    addSubtasks(formData) {
        for (const [k, v] of formData) {
            if (k.startsWith("subtaskTitle") && v !== "") {
                this._subtask.push(new Subtask(k, v))
            }
        }
    }

    // set subtasks(subtaskObj) {
    //     if (!subtaskObj instanceof Subtask) {
    //         throw new Error("Can only assign a subtask of type Subtask")            
    //     }
    //     this._subtask = subtaskObj 
    // }

    edit(formData) {
        this.setFields(formData)
    }
}