import "./style.css";

function setTheme() {
    const root = document.documentElement;
    const newTheme = root.className === 'dark' ? 'light' : 'dark';
    root.className = newTheme;
}

function delegate(event) {
    if (event.target.closest(".theme-toggle")) {
        setTheme()
    }
}

function init() {
    const body = document.querySelector("body")

    body.addEventListener("click", (event) => {
        delegate(event)
    })
}

function main() {
    init()
}

main()