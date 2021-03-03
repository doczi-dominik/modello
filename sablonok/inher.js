const base = `
using System;
using System.Collections.Generic;

namespace Feladat
{
    class [sup]
    {
[sup_fields]
        public [sup]([sup_params])
        {
[sup_constrbody]
        }
[sup_prop]
        public virtual string MindenAdat() => $"[sup_tostr]";
    }

    class [sub] : [sup]
    {
[sub_fields]
        public [sub]([sub_params]) : base([baseparams])
        {
[sub_constrbody]
        }
[sub_prop]
        public override string MindenAdat() => base.MindenAdat() + $"[sub_tostr]";
    }

    class Program
    {
        static void Main(string[] args)
        {
            List<[sub]> l = new List<[sub]>();

            for (int i = 0; i < [itercount]; i++)
            {
[inputconverts]
                [sub] segéd = new [sub]([inputparams]);

                Console.WriteLine(segéd.MindenAdat());

                l.Add(segéd);
            }
        }
    }
}
`

let code
let codeOut

let supFieldsElement
let subFieldsElement

window.onload = function() {
    supFieldsElement = document.getElementById("sup_fields")
    subFieldsElement = document.getElementById("sub_fields")

    codeOut = window.parent.document.getElementById("codeOut")
    configPanelFrame = window.parent.document.getElementById("configPanel")
}

function newSupField() {
    newFieldGroup("sup", supFieldsElement)
}


function newSubField() {
    newFieldGroup("sub", subFieldsElement)
}

function execute() {
    // Gather data
    let supName = document.getElementById("sup").value
    let supFieldInputs = fieldGroupToObjects("sup")
    let subName = document.getElementById("sub").value
    let subFieldInputs = fieldGroupToObjects("sub")

    // Generate superclass
    let supFields = ""
    let supParams = ""
    let supConstrBody = ""
    let supProps = ""
    let supToStr = ""
    let baseParams = ""

    let inputConverts = ""
    let inputParams = ""

    // Fields
    supFieldInputs.forEach(e => {
        let type = e.type
        let name = e.name

        supFields += `        protected ${type} _${name};\n`
        supParams += `${type} ${name}, `
        supConstrBody += `            _${name} = ${name};\n`
        supProps += `
        public ${type} ${name}
        {
            get => _${name};
            set => _${name} = value;
        }
        `
        supToStr += `${name}: {_${name}}; `

        baseParams += `${name}, `

        if (type.toLowerCase() == "string") {
            inputConverts += `
                Console.Write("${name}: ");
                string ${name} = Console.ReadLine();
            `
        } else {
            inputConverts += `
                Console.Write("${name}: ");
                ${type} ${name} = ${type}.Parse(Console.ReadLine());
            `
        }

        inputParams += `${name}, `
    });

    // Generate subclass
    let subFields = ""
    let subParams = supParams
    let subConstrBody = ""
    let subProps = ""
    let subToStr = ""

    subFieldInputs.forEach(e => {
        let type = e.type
        let name = e.name

        subFields += `        private ${type} _${name};\n`
        subParams += `${type} ${name}, `
        subConstrBody += `            _${name} = ${name};\n`
        subProps += `
        public ${type} ${name}
        {
            get => _${name};
            set => _${name} = value;
        }
        `

        subToStr += `${name}: {_${name}}; `

        if (type.toLowerCase() == "string") {
            inputConverts += `
                Console.Write("${name}: ");
                string ${name} = Console.ReadLine();
            `
        } else {
            inputConverts += `
                Console.Write("${name}: ");
                ${type} ${name} = ${type}.Parse(Console.ReadLine());
            `
        }

        inputParams += `${name}, `
    })

    let iterCount = document.getElementById("itercount").value

    supParams = supParams.substr(0, supParams.length-2)
    subParams = subParams.substr(0, subParams.length-2)
    baseParams = baseParams.substr(0, baseParams.length-2)
    inputParams = inputParams.substr(0, inputParams.length-2)

    code = base.replaceAll("[sup]", supName)
    code = code.replaceAll("[sup_fields]", supFields)
    code = code.replaceAll("[sup_params]", supParams)
    code = code.replaceAll("[sup_constrbody]", supConstrBody)
    code = code.replaceAll("[sup_prop]", supProps)
    code = code.replaceAll("[sup_tostr]", supToStr)
    code = code.replaceAll("[baseparams]", baseParams)

    code = code.replaceAll("[sub]", subName)
    code = code.replaceAll("[sub_fields]", subFields)
    code = code.replaceAll("[sub_params]", subParams)
    code = code.replaceAll("[sub_constrbody]", subConstrBody)
    code = code.replaceAll("[sub_prop]", subProps)
    code = code.replaceAll("[sub_tostr]", subToStr)

    code = code.replaceAll("[itercount]", iterCount)
    code = code.replaceAll("[inputconverts]", inputConverts)
    code = code.replaceAll("[inputparams]", inputParams)

    showCode(code)
}