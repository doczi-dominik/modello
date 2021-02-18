let configPanelFrame
let codeFrame

window.onload = function() {
    configPanelFrame = document.getElementById("configPanel")
    codeFrame = document.getElementById("codeFrame")
}

function loadConfigPanel(filename) {
    configPanelFrame.src = `sablonok/${filename}.html`
    
    configPanelFrame.addEventListener("load", function() {
        configPanelFrame.style.height = (configPanelFrame.contentDocument.body.scrollHeight + 5) +"px"
    })
}

function showCode(code) {
    codeFrame.innerHTML = code
}