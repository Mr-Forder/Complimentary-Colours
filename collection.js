const currentHexes = document.querySelectorAll(".sm-colour"); //selects colour h2's "Hex:"
const popup = document.querySelector(".copy-container");
ccm = document.querySelector(".ccm");

let box = document.querySelector(".todo-input");

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});

async function copyToClipboard(hex) {
  const el = document.createElement("textarea"); //creates a text area element
  el.value = hex.innerText; //sets it to the value of hex
  document.body.appendChild(el);
  el.select(); // use select method to select contents of textarea (equivalent of manually selecting it with your mouse, or Ctrl + A)
  document.execCommand("copy"); //execute command method to 'copy' our selection
  document.body.removeChild(el); //removes our new textarea element from existence
  //POPUP AND ANIM

  box.value = hex.innerText;

  ccm.classList.add("msgactive");
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 3 sec
  ccm.classList.remove("msgactive");
}
