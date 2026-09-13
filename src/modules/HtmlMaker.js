import Task from "./Task.js"
import DomCtrl from "./DomCtrl.js"

export default class HtmlMaker {

    static getSubtaskDialog(newSubTaskNo) {
        const newSubtaskDivHtml = `
            <div class="subtask-div">
                <label class="subtask-${newSubTaskNo}">subtask ${newSubTaskNo}
                    <input type="text" name="subtaskTitle${newSubTaskNo}">
                </label>
                <button type="button" class="remove-subtask small-delete-btn">X</button>
            </div>
            `
        return newSubtaskDivHtml
    }

    static getNewProjectDiv(projNum, projectName) {
            const userProjectDiv = `<div class="user-project">
                                        <button data-project-name="${projectName}" class="select-project">
                                            <div>
                                                <span>${projNum} - </span>
                                                <span>${projectName}</span>
                                            </div>            
                                        </button>
                                    <button type="button" class="remove-project small-delete-btn">X</button>
                                </div>                       `      
            return userProjectDiv
    }

    static getProjectSelectOption(existingProjectName) {
        const optionElem = 
        `
        <option value="${existingProjectName}">${existingProjectName}</option>
        `
        return optionElem
    }

    static getProjectNameDiv(projectName) {
        const div = 
        `
        <div class="project-name-div">
            <p>${projectName}</p>
        </div>
        `
        return div
    }

    static getTaskElem(task) {
        // 1. full-task-div
        // 2. progress-bar-btn-div
        // 3. task-parent-div
        // 4. primary-task + primary-task:first-child
        // 5. task-details
        // 6. tags
        // 7. task-details-edit
        // 8. expand-adjacent
        // 9. hidden-div shift-left (subtasks div) 
        // const fullTaskDiv = getEmptyFullTaskDiv(task.id)
            // const progBarMiscBtnDiv =  getProgBarBtnDiv()
            // const TaskParentDiv = getTaskParentDiv()
            //     const primaryTaskDiv = getPrimaryTaskDiv(task) // doesnt incl: task-details & task-details-edit 
            //         const taskDetailsDiv = getTaskDetailsDiv(task) // does not incl: tags div
            //             const tagsDiv = getTagsDiv(task)
            //         const taskDetailsEditDiv = getTaskDetailsEditDiv(task)
            //             const editSelectorDiv = getEditSelectorDiv(task)
            //             const editFormDiv = getEditFormDiv(Task)
            //     const subtaskCheckBox = getSubtaskCheckBoxDiv(task) // contains checkbox to collapse subtasks & subtask summary
            //     const hiddenSubTaskDiv = getHiddenSubTaskDiv(task) // last child of task-parent-div
            //         const SubTaskChildDiv = getSubTaskChildDiv(task.getSubtaskTitles())
        const done = (task.isFinished)? "done":""
        const taskElem = 
        `
        <div class="full-task-div ${done}" id="${task.id}">
            ${this.getProgBarBtnDiv(task)}
            ${this.getTaskParentDiv(task)}
        </div>
        `
        return taskElem
    }

        static getProgBarBtnDiv(task) {
            // progress-bar-btn-div
            const pct = 0
            let [label, color] = DomCtrl.getBarLabelColor(pct)
            const elem = 
            `
            <div class="progress-bar-btn-div">
                <div class="task-progress-bar" 
                    data-label="${label}" 
                    style="--progress-bar-width: ${pct}%;">
                </div>
                <button popovertarget="tasks-options-popover" class="tasks-options">
                    <div>...</div>
                </button>
            </div>
            `
            return elem
        }

        static getTaskParentDiv(task) {
            // ${(task.overdue)?"disAllow":""}
            const disallow = (task.isOverdue || task.isFinished)?"disAllow":""
            const taskParentDiv =
            `
            <div class="task-parent-div ${disallow}">
            ${this.getPrimaryTaskDiv(task)} 
            ${this.getSubtaskCheckBoxDiv(task.unFinishedSubtasks)} 
            ${this.getHiddenSubTaskDiv(task)}
            </div>
            `
            return taskParentDiv
        }

            static getPrimaryTaskDiv(task) {
                const confirmBtnState = (task.getSubtasksSize().length === 0) ? "finalize" : "disable"
                // console.log({confirmBtnState})
                const confirmBtn = `<button class="${confirmBtnState}" data-class_show="task-details">complete</button>`
                const primaryTaskDiv = 
                `
                <div class="primary-task">
                ${confirmBtn}
                ${this.getTaskDetailsDiv(task)} 
                ${this.getTaskDetailsEditDiv(task)} 
                </div>
                `
                return primaryTaskDiv
            }

                static getTaskDetailsDiv(task) {
                    const taskDetailsDiv =
                    `
                    <div class="task-details ">
                        <p>Title: ${task.getInfo().title}</p>
                        <p>Description: ${task.getInfo().description}</p>
                        <p>Due date: ${task.getInfo().dueDate}</p>
                        ${this.getTagsDiv(task)} 
                    </div>
                    `
                    return taskDetailsDiv
                }

                    // TODO: implemented tags! 
                    static getTagsDiv(task) {
                        // TODO: figure how to add insividual tag div from tags.getTagsList()
                        const tagsDiv = 
                        `
                        <div class="tags">
                            <span>Tags: </span>
                            <div class="tag high-priority">
                                <span>High </span>
                            </div>
                            <div class="tag">
                                <span>birthday</span>
                            </div>
                            <div class="tag medium-priority">
                                <span>medium</span>
                            </div>
                            <div class="tag low-priority">
                                <span>low</span>
                            </div>                                                                        
                        </div>
                        `
                        return tagsDiv
                    }

                static getTaskDetailsEditDiv(task) {
                    const editorDiv = 
                    `
                    <div class="task-details-edit hidden-div">
                        ${this.getEditSelectorDiv(task)}
                        <hr>
                        ${this.getEditFormDiv()}
                    </div>
                    `
                    return editorDiv
                }

                    static getEditSelectorDiv(task) {
                        const editSelectorDiv = 
                        `
                        <div class="edit-field-selectors">
                            <input type="radio" id="edit-title-radio-${task.id}" name="edit-field${task.id}" value="edit-title-div" class="toggle-input-edit">
                            <label for="edit-title-radio-${task.id}" class="toggle-label">Title</label>

                            <input type="radio" id="edit-date-radio-${task.id}" name="edit-field${task.id}" value="edit-date-div" class="toggle-input-edit">
                            <label for="edit-date-radio-${task.id}" class="toggle-label">Date</label>

                            <input type="radio" id="edit-desc-radio-${task.id}" name="edit-field-${task.id}" value="edit-desc-div" class="toggle-input-edit">
                            <label for="edit-desc-radio-${task.id}" class="toggle-label">Desc.</label>

                            <input type="radio" id="edit-time-radio-${task.id}" name="edit-field-${task.id}" value="edit-time-div" class="toggle-input-edit">
                            <label for="edit-time-radio-${task.id}" class="toggle-label">Time</label>

                            <input type="radio" id="edit-tags-radio-${task.id}" name="edit-field-${task.id}" value="edit-tags-div" class="toggle-input-edit">
                            <label for="edit-tags-radio-${task.id}" class="toggle-label">Tags</label>

                            <input type="radio" id="edit-note-radio-${task.id}" name="edit-field-${task.id}" value="edit-note-div" class="toggle-input-edit">
                            <label for="edit-note-radio-${task.id}" class="toggle-label">Note</label>
                        </div>
                        `
                        return editSelectorDiv
                    }    

                    static getEditFormDiv() {
                        const editformDiv = 
                        `
                        <form class="edit-form" data-form-name="editForm">
                            <fieldset>
                                <div class="hidden-div edit-title-div">                                            
                                    <label for="edit-title"></label>
                                    <input type="text" id="edit-title" placeholder="Title" name="title">
                                </div>
                                <div class="hidden-div edit-date-div">
                                    <label for="edit-date">Date: </label>
                                    <input type="date" id="edit-date" name="date">
                                </div>                                 
                                <div class="hidden-div edit-desc-div">
                                    <label for="edit-desc"></label>
                                    <input type="text" id="edit-desc" placeholder="Description" name="desc">
                                </div>  
                                <div class="hidden-div edit-time-div">
                                    <label for="edit-time" >Time: </label>
                                    <input type="time" id="edit-time" name="time">
                                </div>     
                                <div class="hidden-div edit-tags-div"> 
                                    <label for="edit-tags"></label>
                                    <input type="text" id="edit-tags" placeholder="Tags" name="tags">
                                </div>  
                                <div class="hidden-div edit-note-div"> 
                                    <label for="edit-note"></label>
                                    <textarea id="edit-note" placeholder="Note" name="note"></textarea>
                                </div>                                        
                            </fieldset>
                            <!-- <hr> -->
                            <div class="edit-form-buttons">
                                <button 
                                    type="submit" 
                                    class="confirm-edit" 
                                    data-class_show="task-details"
                                    data-class_hide="task-details-edit">✓
                                </button>
                                <button 
                                    type="button" 
                                    class="cancel-edit"
                                    data-class_show="task-details"
                                    data-class_hide="task-details-edit">X
                                </button>                                      
                            </div>
                        </form>
                        `
                        return editformDiv
                    }

            static getSubtaskCheckBoxDiv(unFinishedSubtasks) {
                if (unFinishedSubtasks === 0) {
                    return ""
                }
                const div = 
                `
                <div class="expand-adjacent">
                    <label class="show-children">
                        <input type="checkbox" class="expand">
                        <span class="arrow">></span>
                    </label>
                    <div class="subtask-status">
                        <p>Subtasks: <span>0</span>/${unFinishedSubtasks}</p>
                    </div>
            </div>
                `
                return div
            }

            static getHiddenSubTaskDiv(task) {
                if (task.getSubtaskTitles().length === 0) {
                    return ""
                }
                let hiddenSubtaskDiv = `<div class="hidden-div shift-left">`
                const subtaskTitles = task.getSubtaskTitles()
                let childSubtaskDivs = ""
                for (let i = 0; i < subtaskTitles.length; i += 1) {
                    childSubtaskDivs +=
                    `
                    <hr>
                    ${this.getSubTaskChildDiv(subtaskTitles[i], i+1, task.getShortId())}
                    `
                }
                hiddenSubtaskDiv += childSubtaskDivs + `</div>`
                return hiddenSubtaskDiv
            }

                static getSubTaskChildDiv(title, subtaskNo, shortId) {
                    const subtaskChildDiv = 
                    `
                    <div class="subtask-${subtaskNo}-div">
                        <input type="checkbox" id="subtask-checkbox-${shortId}-${subtaskNo}" value="subtaskTitle${subtaskNo}">
                        <label for="subtask-checkbox-${shortId}-${subtaskNo}">title: ${title}</label>
                    </div>
                    `
                    return subtaskChildDiv
                }
}