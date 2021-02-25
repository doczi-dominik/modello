const base = `
using System;
using System.Collections.Generic;

namespace Feladat
{
    class [sup]
    {
[fields]
        public [sup]([params])
        {
[constrbody]
        }
[prop]
[methods]
    }

[subclasses]
    class Program
    {
        static void Main(string[] args)
        {
[calls]
        }
    }
}
`

const subclassBase = `
    class [sub] : [sup]
    {
[fields]
        public [sub]([params]) : base([base_params])
        {
[constrbody]
        }
[methods]
    }

`

let code
let supFieldsElement
let supMethodsElement
let subClassesElement
let subClassCount = 0
let subFieldElements = []

window.onload = function() {
    supFieldsElement = document.getElementById("sup_fields")
    supMethodsElement = document.getElementById("sup_methods")
    subClassesElement = document.getElementById("sub_classes")
}

function newSupField() {
    let element = document.createElement("li")
    element.innerHTML = `
        <input class="bg-dark text-light form-control m-2" placeholder="Típus (pl.: int)" name="sup_fieldType" />
        <input class="bg-dark text-light form-control m-2" placeholder="Név" name="sup_fieldName" />
    `

    supFieldsElement.appendChild(element)
}

function newSupMethod() {
    let element = document.createElement("li")
    element.innerHTML = `
        <input class="bg-dark text-light form-control m-2" placeholder="Visszatérítési típus (pl.: int)" name="sup_methodType" />
        <input class="bg-dark text-light form-control m-2" placeholder="Név" name="sup_methodName" />
        <input class="bg-dark text-light form-control m-2" placeholder="Paraméterek vesszővel elválasztva (pl.: int a, string b)" name="sup_methodParams" />
        `

    supMethodsElement.appendChild(element)
}

function newSubClass() {
    let element = document.createElement("li")

    element.innerHTML = `
        <input class="bg-dark text-light form-control m-2" placeholder="Osztály neve" id="sub${subClassCount}" />
        
        <span>Extra mezők</span>
        <button class="btn btn-dark p-2" type="button" onclick="newSubField(${subClassCount})">+</button><br />
        <ul id="sub${subClassCount}_fields"></ul><br />
    `

    subClassesElement.appendChild(element)
    subFieldElements.push(document.getElementById(`sub${subClassCount}_fields`))
    subClassCount++;
}

function newSubField(subclass) {
    let element = document.createElement("li")

    element.innerHTML = `
        <input class="bg-dark text-light form-control m-2" placeholder="Típus (pl.: int)" name="sub${subclass}_fieldType" />
        <input class="bg-dark text-light form-control m-2" placeholder="Név" name="sub${subclass}_fieldName" />
    `

    subFieldElements[subclass].appendChild(element)
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

function execute() {
    // Gather data
    let supName = document.getElementById("sup").value
    let supFieldInputs = fieldGroupToObjects("sup")
    let supMethodInputs = methodGroupToObjects("sup")

    let supFields = ""
    let supParams = ""
    let supConstrBody = ""
    let supProps = ""
    let baseParams = ""

    supFieldInputs.forEach(e => {
        let type = e.type
        let name = e.name

        supFields += `        proctected ${type} _${name};\n`
        supParams += `${type} ${name}, `
        supConstrBody += `            _${name} = ${name};\n`
        supProps += `
        public ${type} ${name}
        {
            get => _${name};
            set => _${name} = value;
        }
        `

        baseParams += `${name}, `
    })

    let supMethods = ""
    let subOverridedMethods = ""

    supMethodInputs.forEach(e => {
        let type = e.type
        let name = e.name
        let params = e.params

        supMethods += `
        abstract public ${type} ${name}(${params});\n
        `

        subOverridedMethods += `
        override public ${type} ${name}(${params})
        {

        }
        `
    })

    baseParams = baseParams.substr(0, baseParams.length-2)


    let subClasses = ""
    let instanceCalls = ""
    let instanceCount = Number(document.getElementById("instancecount").value)

    for (let i = 0; i < subClassCount; i++) {
        let prefix = `sub${i}`

        let subName = document.getElementById(prefix).value
        let subFieldInputs = fieldGroupToObjects(prefix)

        let subFields = ""
        let subParams = supParams
        let subConstrBody = ""

        subFieldInputs.forEach(e => {
            let type = e.type
            let name = e.name

            subFields += `        ${type} _${name};\n`
            subParams += `${type} ${name}, `
            subConstrBody += `            _${name} = ${name};\n`
        })

        subParams = subParams.substr(0, subParams.length-2)

        let code = subclassBase.replaceAll("[sub]", subName)
        code = code.replaceAll("[sup]", supName)
        code = code.replaceAll("[fields]", subFields)
        code = code.replaceAll("[params]", subParams)
        code = code.replaceAll("[base_params]", baseParams)
        code = code.replaceAll("[constrbody]", subConstrBody)
        code = code.replaceAll("[methods]", subOverridedMethods)

        subClasses += code

        
        for (let i = 0; i < instanceCount; i++) {
            const varName = subName.toLowerCase() + (i+1)

            instanceCalls += `            ${subName} ${varName} = new ${subName}();\n`
            supMethodInputs.forEach(e => {
                instanceCalls += `            ${varName}.${e.name}();\n`
            })
        }

        instanceCalls += "\n"
    }

    supParams = supParams.substr(0, supParams.length-2)

    code = base.replaceAll("[sup]", supName)
    code = code.replaceAll("[fields]", supFields)
    code = code.replaceAll("[params]", supParams)
    code = code.replaceAll("[constrbody]", supConstrBody)
    code = code.replaceAll("[prop]", supProps)
    code = code.replaceAll("[methods]", supMethods)
    code = code.replaceAll("[subclasses]", subClasses)    
    code = code.replaceAll("[calls]", instanceCalls)

    window.parent.document.getElementById("codeOut").innerText = code
}