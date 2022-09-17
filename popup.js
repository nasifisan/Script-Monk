document.addEventListener('DOMContentLoaded', () => {
  var y = document.getElementById("dashboard");
  console.log(y);
  y.addEventListener("click", openIndex);
});

openIndex = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("userScript.html"),
    }, function(win) {
      console.log("hello world");
    });
}