writeScript = item => {
    if (item.enabled) {
        eval(item.code);
    }
}

chrome.storage.local.get('scripts', items => {
    const scripts = items.scripts;

    scripts.forEach(element => {
        writeScript(element);
    });
});

