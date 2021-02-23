//GLOBAL SELECTS
const colourDivs = document.querySelectorAll(".colour"); //selects each .colour div
const generateBtn = document.querySelector(".generate"); //selects generate button
const sliders = document.querySelectorAll('input[type="range"]'); //selects our input sliders
const currentHexes = document.querySelectorAll(".colour h2"); //selects colour h2's "Hex:"
const popup = document.querySelector(".copy-container");
const adjustButton = document.querySelectorAll(".adjust"); // grab adjust button
const lockButton = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment"); //grab close box
const slideContainers = document.querySelectorAll(".sliders"); //grab sliders
const clearBtn = document.querySelector(".clear-palettes");

let initialColours;
//object creation for local storage

let savedPalettes = [];

//EVENT LISTENERS

//Clear local storage
clearBtn.addEventListener("click", clearLocalStorage);

function clearLocalStorage() {
  localStorage.clear();
  closeLibrary();
  openCleared();
}

//message
//get our message div
const message = document.querySelector(".message");
//message array
const compItems = [
  `<p><i class="fas fa-quote-left"></i> Wow! That's a good one! <i class="fas fa-quote-right"></i></p>`,
  `<p><i class="fas fa-quote-left"></i> Have you done something with your hair? <i class="fas fa-quote-right"></i></p>`,
  `<p><i class="fas fa-quote-left"></i> Gorgeous! <i class="fas fa-quote-right"></i></p>`,
  `<p><i class="fas fa-quote-left"></i> Beautiful! <i class="fas fa-quote-right"></i></p>`,
];
//function to return a random element from our compItems
function compGen() {
  return compItems[Math.floor(Math.random() * compItems.length)];
}
compGen();
//add event listener to existing elements
generateBtn.addEventListener("click", () => {
  message.innerHTML = compGen();
});

//

okayBtn = document.querySelector(".okay");
okayBtn.addEventListener("click", reload);

function reload() {
  location.reload();
}

function openCleared() {
  const clearedContainer = document.querySelector(".cleared-container");
  const popup = clearedContainer.children[0];
  clearedContainer.classList.toggle("active");
  popup.classList.toggle("active");
  console.log(popup);
}

//done

lockButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    colourDivs[index].classList.toggle("locked");
    button.firstChild.className = colourDivs[index].classList.contains("locked")
      ? "fas fa-lock"
      : "fas fa-lock-open";
  });
});

//Space bar functionality
document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    randomColours();
  }
});
//disable spacebar scroll
window.onkeydown = function (e) {
  var elem = e.target.nodename;
  if (elem !== "TEXTAREA" && elem != "INPUT") {
    return !(e.keyCode == 32);
  }
};

generateBtn.addEventListener("click", randomColours);

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colourDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});
popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});
adjustButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});

closeAdjustments.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});

//FUNCTIONS
//Colour Generator - generates a random hex code
function generateHex() {
  const hexColour = chroma.random(); //uses chroma to generate a randome chroma value that we store in hexcolour
  return hexColour; //return the chrom.random fun, executing the above code
}

function randomColours() {
  initialColours = [];
  colourDivs.forEach((div, index) => {
    //for each colour div, execute

    const hexText = div.children[0]; //creates a const called hextext, sets it to be the h2s in each div
    const randomColour = generateHex(); //creates const randomColour, sets it equal to our generateHex function and calls it.
    //ADD NEWLY GENERATED HEX TO INITIALCOLOURS ARRAY
    if (div.classList.contains("locked")) {
      initialColours.push(hexText.innerText);
      return;
    } else {
      initialColours.push(chroma(randomColour).hex());
    }

    //TURN OUR NEW HEX INTO THE BACKGROUND OF EACH DIV
    div.style.backgroundColor = randomColour; //sets div style background colour to equal our random hex code generaor
    hexText.innerText = randomColour; //sets our div h2s to equal our random hex code too

    //check luminance contrast with checkTextContrast function
    checkTextContrast(randomColour, hexText); //run checkTextContrast func with radomcolour and hextext fed into colour and text parameters
    //Initial colour for sliders
    const color = chroma(randomColour);
    const sliders = div.querySelectorAll(".sliders input"); //targets our 3 inputs on each colour

    const hue = sliders[0]; //sets const hue to our hue slider
    const brightness = sliders[1];
    const saturation = sliders[2];

    colourizeSliders(color, hue, brightness, saturation);
  });
  //Reset input sliders
  resetInputs();
  //button contrast check
  adjustButton.forEach((button, index) => {
    checkTextContrast(initialColours[index], button);
    checkTextContrast(initialColours[index], lockButton[index]);
  });
}

//QUICK CHECK TO SEE IF OUR LUMINANCE IS LOW OR HIGH - CHANGE H2 COLOUR TO CONTRAST IN EACH CASE
function checkTextContrast(colour, text) {
  const luminance = chroma(colour).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}
//ADD our colour sliders
function colourizeSliders(color, hue, brightness, saturation) {
  //scale saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  //Update input colours
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;

  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)}, ${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue"); //gets index of slider clicked on
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]'); //selects all sliders
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColour = initialColours[index];
  let colour = chroma(bgColour)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colourDivs[index].style.backgroundColor = colour;

  //update slider colours

  colourizeSliders(colour, hue, brightness, saturation);
}

function updateTextUI(index) {
  const activeDiv = colourDivs[index];
  const colour = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = colour.hex();
  //check text contrast
  checkTextContrast(colour, textHex);
  for (icon of icons) {
    checkTextContrast(colour, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColour = initialColours[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColour).hsl()[0]; //set hue value to chroma value of index 0 - our hue
      slider.value = Math.floor(hueValue); //set slider value to hue value
    }
    if (slider.name === "brightness") {
      const brightColour = initialColours[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColour).hsl()[2]; //set hue value to chroma value of index 0 - our hue
      slider.value = Math.floor(brightValue * 100) / 100; //set slider value to hue value
    }
    if (slider.name === "saturation") {
      const satColour = initialColours[slider.getAttribute("data-sat")];
      const satValue = chroma(satColour).hsl()[1]; //set hue value to chroma value of index 0 - our hue
      slider.value = Math.floor(satValue * 100) / 100; //set slider value to hue value
    }
  });
}

function copyToClipboard(hex) {
  const el = document.createElement("textarea"); //creates a text area element
  el.value = hex.innerText; //sets it to the value of hex
  document.body.appendChild(el);
  el.select(); // use select method to select contents of textarea (equivalent of manually selecting it with your mouse, or Ctrl + A)
  document.execCommand("copy"); //execute command method to 'copy' our selection
  document.body.removeChild(el); //removes our new textarea element from existence
  //POPUP AND ANIM
  const popupBox = popup.children[0]; //Creates popupbox from child of popup(defined at beginning as our invisible div  - .copy-containter)
  popup.classList.add("active");
  popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
  slideContainers[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
  slideContainers[index].classList.remove("active");
}

//Local storage

const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".save-close");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

function openPalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}

function closePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}

function savePalette(e) {
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const name = saveInput.value;
  const colours = [];
  currentHexes.forEach((hex) => {
    colours.push(hex.innerText);
  });
  //Generate Obj

  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  if (paletteObjects) {
    paletteNr = paletteObjects.length;
  } else {
    paletteNr = savedPalettes.length;
  }

  const paletteObj = { name, colours, nr: paletteNr };
  savedPalettes.push(paletteObj); //push new paletteObj to savedPalettes
  //push to local storage
  savetoLocal(paletteObj); //run function savetolocal, pass in palleteObj
  saveInput.value = ""; //reset input value to blank
  //Palette generation for library storage
  const palette = document.createElement("div"); //create empty palette div
  palette.classList.add("custom-palette"); // add custom palette class
  const title = document.createElement("h4"); //add a title
  title.innerText = paletteObj.name; // make new title = name of our palette object
  const preview = document.createElement("div"); //create a load of small divs that loop over the saved colours
  preview.classList.add("small-preview");
  paletteObj.colours.forEach((smallColour) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColour;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "Select";

  //palette select event listener
  paletteBtn.addEventListener("click", (e) => {
    closeLibrary();
    const paletteIndex = e.target.classList[1];
    initialColours = [];
    savedPalettes[paletteIndex].colours.forEach((colour, index) => {
      initialColours.push(colour);
      colourDivs[index].style.backgroundColor = colour;
      const text = colourDivs[index].children[0];
      checkTextContrast(colour, text);
      updateTextUI(index);
    });
    resetInputs();
  });

  //append all the stuff we've generated to the library
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
}

function savetoLocal(paletteObj) {
  if (localStorage.getItem("palettes") === null) {
    // if localstorage is empty
    localPalettes = []; //set localpalettes to empty array
  } else {
    //otherwise....
    localPalettes = JSON.parse(localStorage.getItem("palettes")); //...push contents of localpalettes to local storage
  }
  localPalettes.push(paletteObj); //push paletteObj to localPalettes
  localStorage.setItem("palettes", JSON.stringify(localPalettes)); //stringify palettes, store in localpalettes
}
function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}
function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}

function getLocal() {
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));

    savedPalettes = [...paletteObjects];
    paletteObjects.forEach((paletteObj) => {
      const palette = document.createElement("div"); //create empty palette div
      palette.classList.add("custom-palette"); // add custom palette class
      const title = document.createElement("h4"); //add a title
      title.innerText = paletteObj.name; // make new title = name of our palette object
      const preview = document.createElement("div"); //create a load of small divs that loop over the saved colours
      preview.classList.add("small-preview");
      paletteObj.colours.forEach((smallColour) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColour;
        preview.appendChild(smallDiv);
      });
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.nr);
      paletteBtn.innerText = "Select";

      //palette select event listener

      paletteBtn.addEventListener("click", (e) => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColours = [];
        paletteObjects[paletteIndex].colours.forEach((colour, index) => {
          initialColours.push(colour);
          colourDivs[index].style.backgroundColor = colour;
          const text = colourDivs[index].children[0];
          checkTextContrast(colour, text);
          updateTextUI(index);
        });
        resetInputs();
      });

      //append all the stuff we've generated to the library
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette);
    });
  }
}

getLocal();
randomColours();
