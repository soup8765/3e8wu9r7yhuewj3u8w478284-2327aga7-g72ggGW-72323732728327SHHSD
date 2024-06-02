// Global variables
let counter = 2;
let shuffle = false;
let strokeMode = true;
let normalMode = true;
let currentProgress = 0;
let data, backupData;
let question, A;
let consecutiveAns = 0;
let wrong = true;
let canBeDone = true

let doAmount = 1;

const filePathArray = [
  "flashcards/Book 1.md",
  "flashcards/Holidays + Seasons.md",
  "flashcards/HSK 1.md",
  "flashcards/Words + Definitions.md",
  "flashcards/words and phrases Chinese.md",
  "flashcards/Computing.md"
]

// Shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (j !== 1 && j !== 0) {
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

// Returns random number
function randomNum(min, max, notIncludes) {
  let numCheck;
  do {
    const ranNum = Math.floor(Math.random() * (max - min) + min);
    if (notIncludes) {
      if (ranNum !== notIncludes) {
        numCheck = ranNum;
      }
    } else {
      numCheck = ranNum;
    }
  } while (!Number.isInteger(numCheck));
  return numCheck;
}

function addAnimation(animation, element) {
  // Remove all animation classes to reset them
  const animations = ['swipe-down-animation', 'shake-animation', 'swipe-up-animation']; // Add other animation class names here as needed
  animations.forEach(anim => element.classList.remove(anim));
 
  // Force a reflow to reset the animation state
  void element.offsetWidth;
 
  // Re-add the new animation class to restart the animation
  element.classList.add(animation);
 }

function promptNumber() {
  let input;
  while (true) {
    input = prompt("Enter Index:", 1);
    // Cancels
    if (input === null) {
      return null;
    } else if (input === "" || isNaN(input)) {
      alert("Please input a valid number.");
    } else {
      return parseInt(input);
    }
  }
}

function toggleSidebar() {
  var sidebar = document.getElementById('sidebarContainer');
  var mainContent = document.getElementById('mainContent');
  
  // Check if sidebar is open
  if (sidebar.classList.contains('open')) {
    // If sidebar is open, close it
    sidebar.classList.remove('open');
    mainContent.classList.remove('expanded');
  } else {
    // If sidebar is closed, open it
    sidebar.classList.add('open');
    mainContent.classList.add('expanded');
  }
}

function updateProgressBar(currentProgress) {
  
  const progressBar = document.getElementById('progress-bar');
  if (normalMode) {
    progressBar.style.width = 0 + '%';
  } else {
    progressBar.style.width = currentProgress + '%';
  }
}

async function findTxtFiles(file) {
  try {
    const response = await fetch('flashcards/HSK 1.md');
    if (file) {
      data = file;
    } else {
      data = await response.text();
    }

    if (data.includes("```\n") && data.includes("\n```")) {

      data = data.replace('```\n', "");
      data = data.replace('\n```', "");
    }
    console.log(data)
    data = data.split("\n").map(element => element.replace("\r", ""));
    backupData = data.slice();
    console.log([data, "backup ↓", backupData]);

    parseFile();
  } catch (error) {
    console.error('Error loading text file:', error);
  }
}

findTxtFiles();
sidebarFiles();

function shuffleFunction() {
  if (shuffle) {
    // When turned off
    document.getElementById("shuffle").textContent = "Shuffle: OFF";
    data = backupData.slice();
  } else {
    // When turned on
    document.getElementById("shuffle").textContent = "Shuffle: ON";
    shuffleArray(data);
  }
  shuffle = !shuffle;
  counter = 2;
  parseFile();
}

function toggleStrokeMode() {
  if (strokeMode) {
    // When turned off
    document.getElementById("stroke-mode").textContent = "Stroke-Mode: OFF";
  } else {
    // When turned on
    document.getElementById("stroke-mode").textContent = "Stroke-Mode: ON";
  }
  strokeMode = !strokeMode;
  parseFile();
}

function toggleNormalMode() {
  if (normalMode) {
    // When turned off
    document.getElementById("normal").textContent = "Normal-Mode: OFF";
    doAmount = 25;
  } else {
    // When turned on
    document.getElementById("normal").textContent = "Normal-Mode: ON";
    doAmount = 1;
  }
  normalMode = !normalMode;
  updateProgressBar(0);
  parseFile();
}

function toggleElementsVisibility() {


  const isStrokeModeVisible = Math.random() < 0.5;
   
   
  if (isStrokeModeVisible) {

     document.querySelectorAll(".char").forEach(element => element.removeAttribute("style"))
     document.querySelectorAll(".answer").forEach(element => element.style.display = "none");
  } else {

     document.querySelectorAll(".char").forEach(element => element.style.display = "none")
     document.querySelectorAll(".answer").forEach(element => element.removeAttribute('style'));
  }
 }
 

function progressInput() {
  const userInput = promptNumber();
  if (userInput) {
    if (userInput >= 1 && userInput <= document.getElementById("progress").textContent.split("/")[1]) {
      counter = userInput + 1;
      consecutiveAns = 0;
      parseFile();
    }
  }
}



async function sidebarFiles() {
  try {
    const parentElement = document.getElementById("container-files");
    for (const path of filePathArray) {
      const response = await fetch(path);
      if (!response.ok) { // Check if the response was successful
        throw new Error(`Failed to load ${path}`);
      }
      const newDiv = document.createElement("div");
      const newContent = document.createTextNode(path.replace("flashcards/", "").replace(".md", ""));
      newDiv.onclick = () => loadFile(path); // Pass the file content to loadFile
      newDiv.appendChild(newContent);
      newDiv.className = 'sidebar-element';
      parentElement.appendChild(newDiv);
    }
  } catch (error) {
    console.error('Error loading text file:', error);
  }
}



// Gets file, then parses
async function loadFile(filepath) {
  const file = await fetch(filepath);
  const content = await file.text()
  console.log(content)

  findTxtFiles(content);
}

// Parses file
function parseFile() {
  
  const contents = data;
  // Gets the indexes of both question and term in txt file
  let details = contents[0].split("|");
// Collect all indices for "question" and "term" elements
let allIndices = [];
details.forEach((element, index) => {
    if (element === "question" || element === "term") {
        allIndices.push(index);
    }
});

// Initialize indexQ and indexTerms
let indexQ = [];
let indexTerms = [];

// Populate indexQ and indexTerms based on the collected indices
allIndices.forEach((index) => {
    if (details[index] === "question") {
        indexQ.push(index);
    } else if (details[index] === "term") {
        indexTerms.push(index);
    }
});

// If indexQ is empty, populate it with a random index that is not in indexTerms
if (indexQ.length === 0) {
    // If there are available indices in indexTerms, select one at random
    if (indexTerms.length > 0) {
        const randomIndex = indexTerms[Math.floor(Math.random() * indexTerms.length)];
        indexQ.push(randomIndex);

        // Remove the selected index from indexTerms
        indexTerms = indexTerms.filter(index => index !== randomIndex);
    }
}

  // Array for answers
  let arrayOfA = [];
  const termsByCounter = contents[counter].split("|");
  // Gets all other answers by term & lang
  const answerIndex = indexTerms[randomNum(0, indexTerms.length)];
  let indexForPotentialA = [];
  contents[1].split("|").forEach((element, index) => {
    if (indexTerms.includes(index) && contents[1].split("|")[answerIndex] === element) {
      indexForPotentialA.push(index);
    }
  });
  // Fills answer array
  while (arrayOfA.length < 4) {
    const potentialIndexs = randomNum(3, contents.length);
    const potentialT = contents[potentialIndexs].split("|")[indexForPotentialA[randomNum(0, indexForPotentialA.length)]];
    if (!termsByCounter.includes(potentialT) && !arrayOfA.includes(potentialT)) {
      arrayOfA.push(potentialT);
    }
  }
  // Adds answer to answer array
  A = termsByCounter[answerIndex];
  arrayOfA[randomNum(0, arrayOfA.length)] = A;

    currentProgress = ((counter - 1) / (contents.length - 2)) * 100;
    document.getElementById("progress").textContent = `${counter - 1}/${contents.length - 2}`;

  question = termsByCounter[indexQ[randomNum(0, indexQ.length)]];

  display(arrayOfA);
}

// Displays content
function display(answerArray) {

  // hides char mode
  document.querySelectorAll(".char").forEach(element => element.style.display = "none")
  document.querySelectorAll(".answer").forEach(element => element.removeAttribute('style'));

  for (let i = 0; i < 4; i++) {
    document.getElementById(`a${i + 1}`).setAttribute("data-term", answerArray[i]);
    document.getElementById(`a${i + 1}`).textContent = answerArray[i];
  }
  document.getElementById("question").textContent = question;
  if (strokeMode) {
    let toBeWrit;
    const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\u{f900}-\u{faff}]|[\u{3300}-\u{33ff}]|[\u{fe30}-\u{fe4f}]|[\u{f900}-\u{faff}]|[\u{2f800}-\u{2fa1f}]/u;
    if (REGEX_CHINESE.test(question)) {
      canBeDone = true;
      toBeWrit = question;
      displayChar(toBeWrit);
    } else if (REGEX_CHINESE.test(A)) {
      canBeDone = true;
      toBeWrit = A;
      displayChar(toBeWrit);
    } else {
      canBeDone = false;
      displayChar(canBeDone);
    }
  }

}

function displayChar(characterStr) {

  // removes all previous SVG boxes created
  const parent = document.getElementById("grid-container2");
  while (parent.firstChild) {
    parent.firstChild.remove();
  }

  if (characterStr) {

  console.log(characterStr, characterStr.split(""));

  // var
  const grid2 = document.getElementById('grid-container2');
  let charArr = [];
  const amountOfChar = characterStr.split("").length;

  // Get the first.char element to determine its width
  const cardElement = document.querySelector('.card');
  if (!cardElement) {
    console.error('No.card element found.');
    return; // Exit the function early if no.char element is found
  }

  const style = window.getComputedStyle(cardElement);
  const paddingLeft = parseInt(style.paddingLeft);
  const paddingRight = parseInt(style.paddingRight);

  // Use 30% the width of the.char element for sizeOfBox
  const sizeOfBox = (cardElement.clientWidth - (paddingLeft + paddingRight));

  // creates box + quiz for each char
  characterStr.split("").forEach((element, index) => {

  // Define the SVG namespace
  const svgNS = "http://www.w3.org/2000/svg";

  // Create the SVG element
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttributeNS(null, "width", sizeOfBox);
  svg.setAttributeNS(null, "height", sizeOfBox);
  svg.setAttributeNS(null, "id", "grid-background-target");

  // Create and append the line elements
  const lines = [
    { x1: 0, y1: 0, x2: sizeOfBox, y2: sizeOfBox },
    { x1: sizeOfBox, y1: 0, x2: 0, y2: sizeOfBox },
    { x1: sizeOfBox / 2, y1: 0, x2: sizeOfBox / 2, y2: sizeOfBox },
    { x1: 0, y1: sizeOfBox / 2, x2: sizeOfBox, y2: sizeOfBox / 2 }
  ];

  // SVG dashed box
  lines.forEach(function (line) {
    const lineElement = document.createElementNS(svgNS, "line");
    lineElement.setAttributeNS(null, "x1", line.x1);
    lineElement.setAttributeNS(null, "y1", line.y1);
    lineElement.setAttributeNS(null, "x2", line.x2);
    lineElement.setAttributeNS(null, "y2", line.y2);
    lineElement.setAttributeNS(null, "stroke", "#DDD");
    lineElement.setAttributeNS(null, "opacity", "0.15");
    lineElement.setAttributeNS(null, "stroke-dasharray", "4,10");
    svg.appendChild(lineElement);
  });

  // sets id and class, referenced
  svg.setAttribute("id", "character" + index);
  svg.setAttribute("class", "char");

  // apphends to grid2
  grid2.style.gridTemplateColumns = `repeat(${grid2.childElementCount}, 1fr)`;
  grid2.appendChild(svg);

  // loads character quiz in SVG box
  HanziWriter.loadCharacterData(element, options = {});
  charArr.push(HanziWriter.create(svg, element, {
    width: sizeOfBox,
    height: sizeOfBox,
    showHintAfterMisses: 1,
    highlightCompleteColor: 'rgb(107, 155, 115)',
    /*radicalColor: '#337ab7', // blue */
    strokeColor: 'rgb(204, 204, 204)', // light grey
    showCharacter: false,
    showOutline: false,
    drawingWidth: 20
  }));
    grid2.style.gridTemplateColumns = `repeat(${grid2.childElementCount}, 1fr)`;
  });

  charArr.forEach((char, index) => {
    char.quiz({

      onMistake: function() {
        addAnimation('shake-animation', document.getElementById("mainContent"));
      },

      onComplete: function () {
        // if current completed char is the last one, it resets
        if (index === characterStr.split("").length - 1) {
          consecutiveAns++;
          updateProgressBar((consecutiveAns/doAmount) * 100);

          // checks if consecutiveAns meets amount, then moves on to next one
          if (consecutiveAns === doAmount) {
            consecutiveAns = 0;
            updateProgressBar((consecutiveAns/doAmount) * 100);
            if (counter === data.length - 1) {
              counter = 2;
            } else {
              counter++;
            }
          }

          setTimeout(() => {
            addAnimation('swipe-down-animation', document.getElementById("mainContent"));
            parseFile();
          }, 1000);
        }

      }
    });
  });

  document.querySelectorAll(".char").forEach(element => {
    element.style.display = "none";
  });

  // 50/50
  toggleElementsVisibility();
  }

}

// On click, check and colour
function input(event) {
  // Prevent further interaction if the element has already been clicked
  if (event.target.disabled) {
      return;
  }

  console.log(event.target.dataset.term);

  // if correct answer is clicked
  if (event.target.dataset.term == A) {
    // updates progress bar
    consecutiveAns++
    updateProgressBar((consecutiveAns/doAmount) * 100);

    // green effect
    event.target.style.cssText = "background-color: rgb(107, 155, 115); opacity: 1; transition: background-color 0.4s, opacity 0.5s;";
    event.target.disabled = true; // Disable the element

    // checks if consecutiveAns meets amount, then moves on to next one
    if (consecutiveAns === doAmount) {
        consecutiveAns = 0;
        updateProgressBar((consecutiveAns/doAmount) * 100);
        if (counter === data.length - 1) {
            counter = 2;
        } else {
            counter++;
        }
    }

    // after red/green animation, resets flashcards
    setTimeout(() => {
        event.target.removeAttribute('style');
        event.target.disabled = false; // Enable the element again
        addAnimation('swipe-down-animation', document.getElementById("mainContent"));
        parseFile();
    }, 1000);

} else {
    addAnimation('shake-animation', document.getElementById("mainContent"));

    consecutiveAns = 0;
    updateProgressBar((consecutiveAns/doAmount) * 100);
    
    // plays red animation
    event.target.style.cssText = "background-color: rgb(163, 80, 79); opacity: 1; transition: background-color 0.4s, opacity 0.5s;";
    event.target.disabled = true; // Disable the element

    // gives second chance, removes red.
    setTimeout(() => {
        event.target.removeAttribute('style');
        event.target.disabled = false; // Enable the element again
    }, 1000);

  }
}

// liveServer.settings.useLocalIp
