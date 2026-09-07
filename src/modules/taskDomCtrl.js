export default class taskDomCtrl {
    static myTaskDomCtrlMap = new Map() // DomCtrl?; might need an instance to kep track of elem state for each Task instance 
    // editFieldDivPrev: the last edit-field div that was shown; to be hidden later when a new div is shown
    editFieldDivInView = null
    // task-details & task-details-edit divs; switching betwween both these div visiility when user clicks edit btn
    taskDetailsDivInView = null
}