let configPanelFrame

window.onload = function() {
    configPanelFrame = document.getElementById("configPanel")
}

function loadConfigPanel(filename) {
    configPanelFrame.src = `sablonok/${filename}.html`
    
    configPanelFrame.addEventListener("load", function() {
        configPanelFrame.style.height = (configPanelFrame.contentDocument.body.scrollHeight + 5) +"px"
    })
}

// Strictly for use with templates

function updateParentHeight() {
    configPanelFrame.style.height = (configPanelFrame.contentDocument.body.scrollHeight + 5) +"px"
}

function showCode(code) {
    codeOut.innerHTML = code
}

function newInputGroup(target, contents) {
    let element = document.createElement("li")
    element.innerHTML = contents

    target.appendChild(element)
    updateParentHeight()
}

function newFieldGroup(prefix, target) {
    newInputGroup(target, `
        <input class="bg-dark text-light form-control m-2" name="${prefix}_fieldType" placeholder="Típus (pl.: int)" />
        <input class="bg-dark text-light form-control m-2" name="${prefix}_fieldName" placeholder="Név" />
    `)
}

function newMethodGroup(prefix, target) {
    newInputGroup(target, `
        <input class="bg-dark text-light form-control m-2" name="${prefix}_methodType" placeholder="Típus (pl.: int)" />
        <input class="bg-dark text-light form-control m-2" name="${prefix}_methodName" placeholder="Név" />
        <input class="bg-dark text-light form-control m-2" name="${prefix}_methodParams" placeholder="Vesszővel elválasztott paraméterek (pl.: int a, string b)" />
    `)
}

function fieldGroupToObjects(prefix) {
    let types = Array.from(document.getElementsByName(prefix + "_fieldType")).map(e => e.value)
    let names = Array.from(document.getElementsByName(prefix + "_fieldName")).map(e => e.value)

    let results = []

    for (let i = 0; i < names.length; i++) {
        results.push({type: types[i], name: names[i]})
    }

    return results
}

function methodGroupToObjects(prefix) {
    let types = Array.from(document.getElementsByName(prefix + "_methodType")).map(e => e.value)
    let names = Array.from(document.getElementsByName(prefix + "_methodName")).map(e => e.value)
    let paramLists = Array.from(document.getElementsByName(prefix + "_methodParams")).map(e => e.value)

    let results = []

    for (let i = 0; i < names.length; i++) {
        results.push({type: types[i], name: names[i], params: paramLists[i]})
    }

    return results
}