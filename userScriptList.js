// const tabs = document.querySelectorAll(".tabs h3");
// const tabContents = document.querySelectorAll(".tab-content div");

setEditAttribute = (file, edit) => {
    chrome.storage.local.get('scripts', result => {
        const scripts = result.scripts;

        scripts.map(item => {
            if ( item.name == file ) {
                item.edit = edit;
            } else {
                item.edit = false;
            }

            return item;
        });

        chrome.storage.local.set({scripts: scripts});
    });
}

onChangeUpdate = (file, enabled) => {
    chrome.storage.local.get('scripts', result => {
        const scripts = result.scripts;
        scripts.map(item => {
            if ( item.name === file ) {
                item.enabled = enabled;
            }

            return item;
        })

        chrome.storage.local.set({scripts: scripts});
    });
}

deleteScript = file => {
    const elmToRemove = document.getElementById(`${file}-script-row`);

    console.log("elm remove: ", elmToRemove);

    chrome.storage.local.get('scripts', result => {
        const scripts = (result.scripts || []).filter(item => item.name !== file);
        chrome.storage.local.set({scripts: scripts});
    });

    elmToRemove.remove();
}

goToEditButton = item => {
    const elmNote = document.getElementById("note");
    const elmFileName = document.getElementById("file-name");

    tabContents.forEach(content => {
        content.classList.remove("active");
    });

    tabs.forEach((tab, index) => {
        tab.classList.remove("active");
    });

    tabs[0].classList.add("active");
    tabContents[0].classList.add("active");

    elmNote.value = item.code;
    elmFileName.value = item.name;

    setEditAttribute(item.name, true);
}

createListElement = item => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className =  "checklist-button";
    input.checked = item.enabled;
    input.onchange = (e) => {
        if (e.currentTarget.checked) {
            onChangeUpdate(item.name, true);
        } else {
            onChangeUpdate(item.name, false);
        }
    }

    const span = document.createElement("span");
    span.textContent = item.name;
    span.className = `${item.name}-span`;

    const deleteButton = document.createElement("button");
    deleteButton.style.margin = "0px 20px";
    deleteButton.onclick = () => {
        deleteScript(item.name);
    }
    deleteButton.textContent = "delete"


    const editButton = document.createElement("button");
    editButton.style.margin = "0px 20px";
    editButton.onclick = () => {
        goToEditButton(item);
    }
    editButton.textContent = "edit";



    const div = document.createElement("div");
    
    div.className = "checklist-element";
    div.id = `${item.name}-script-row`
    div.style.display = "block";

    div.append(input, span, editButton, deleteButton);

    return div;
}

prepareListElement = scripts => {
    (scripts || []).forEach(item => {
        const child = createListElement(item);
        tabContents[1].appendChild(child);
    });
}

window.onload = e => {
    e.preventDefault();

    chrome.storage.local.get('scripts', result => {
        prepareListElement(result.scripts);
    });
}

tabs[1].addEventListener("click",  () => {
    tabContents.forEach(content => {
        content.classList.remove("active");
    });

    tabs.forEach((tab, index) => {
        tab.classList.remove("active");
    });

    tabs[1].classList.add("active");
    tabContents[1].classList.add("active");


    chrome.storage.local.get('scripts', result => {
        const scripts = result.scripts;
        const anyNewAdded = scripts.some(item => item.new === true);
        const tabTitle = document.createElement('h4');
        tabTitle.innerText = "Script List"
        tabContents[1].innerHTML = "";
        tabContents[1].appendChild(tabTitle);

        prepareListElement(scripts);

        // if (anyNewAdded) {
        //     scripts.forEach(item => {
        //         if (item.new) {
        //             const child = createListElement(item);
        //             tabContents[1].appendChild(child);
        //         }
        //     });
    
        //     scripts.map(item => {
        //         if (item.new) {
        //             item.new = false;
        //         }
    
        //         return item;
        //     });
    
        //     chrome.storage.local.set({scripts: scripts});
        // }
    });
});
