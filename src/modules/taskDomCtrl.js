// this class stores the state of the dom task element's
// mainly the state of the editor: whcih editor field label was clicked, and whether the editor is open/closed 
export default class taskDomCtrl {
    static myTaskDomCtrlMap = new Map()
    // editFieldDivPrev: the last edit-field div that was shown; to be hidden later when a new div is shown
    editFieldDivInView = null
    // task-details & task-details-edit divs; switching betwween both these div visiility when user clicks edit btn
    taskDetailsDivInView = null

    static add(id) {
        this.myTaskDomCtrlMap.set(id, new taskDomCtrl())
    }
}