const elmNote = document.getElementById("note");
const elmSave = document.getElementById("save");
const elmFileName = document.getElementById("file-name");
const tabs = document.querySelectorAll(".tabs h3");
const tabContents = document.querySelectorAll(".tab-content div");

getStoreElementObject = (id, value) => {
  const newObj = {
    'name': id,
    'code': value,
    'enabled': false,
    'edit': false,
    'new': true,
  }

  return newObj;
}

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

elmSave.onclick = () => {
    // console.log("name: ", elmFileName.value);
    // console.log("Code: ", elmNote.value);

    chrome.storage.local.get({scripts: []}, result => {
      const scripts = [...result.scripts];
      const file = elmFileName.value;
      const code = elmNote.value;
      const editScript = scripts.some(item => item.edit === true);
      const isScriptAvailable = scripts.some(item => item.name === file);

      if (editScript) {
        scripts.map(item => {
          if (item.edit) {
            item.code = code;
            item.edit = false;
            item.name = file;
          }
          
          return item;
        });
      } else if (file !== '' && !isScriptAvailable) {
        scripts.push(getStoreElementObject(file, code));
      }

      if (file === '') {
        alert("Please provide the script name");
      } else if ( isScriptAvailable ) {
        alert("Please provide a unique script name");
      } else {
        chrome.storage.local.set({scripts: scripts}, () => {
              console.log("Script successfully saved!");
        });
      }
  });
}

tabs[0].addEventListener("click", () => {
  tabContents.forEach(content => {
    content.classList.remove("active");
  });

  tabs.forEach((tab, index) => {
      tab.classList.remove("active");
  });

  tabs[0].classList.add("active");
  tabContents[0].classList.add("active");
  

  elmFileName.value = '';
  elmNote.value = '';
  setEditAttribute('', false);
});