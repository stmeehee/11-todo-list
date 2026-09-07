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

    static getProjectDiv(projNum, projectName) {
            const userProjectDiv = `<div class="user-project">
                                    <button value="${projectName}">
                                        <div>
                                            <span>${projNum} - </span>
                                            <span>${projectName}</span>
                                        </div>            
                                    </button>
                                    <button type="button" class="remove-project small-delete-btn">X</button>
                                </div>
                                `      
            return userProjectDiv
        }
}