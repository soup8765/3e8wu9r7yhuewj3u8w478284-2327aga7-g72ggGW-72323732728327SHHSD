// Global variables
let counter = 2;
let shuffle = false;
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
  "flashcards/MALAY.md",
  "flashcards/Words + Definitions.md",
  "flashcards/words and phrases Chinese.md"
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
  console.log(file)
  try {
    const response = await fetch('flashcards/HSK 1.md');
    if (file) {
      data = file;
    } else {
      data = await response.text();
    }

data = data.replace(/^```[\n\r]*/, "");  // Remove leading ``` and newlines
data = data.replace(/[\n\r]*```$/, "");  // Remove trailing ``` and newlines

    
    console.log(data)
    data = data.split("\n").map(element => element.replace("\r", ""));
    backupData = data.slice();
    console.log([data, "backup ↓", backupData]);

    parseFile();
  } catch (error) {
    console.error('Error loading text file:', error);
  }
}


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

document.addEventListener("keydown", function(event) {
  // Prevent the default action of the key press
  event.preventDefault();

  // Check if the pressed key is a number between 1 and 4
  if (event.key >= "1" && event.key <= "4") {
    // Simulate clicking the button corresponding to the pressed number
    document.getElementById("a" + event.key).click();
  }
});



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
  console.log("aaaa", contents)
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

console.log(indexQ, indexTerms)

// If indexQ is empty, takes random index from indexTerms, removing it from indexTerms 
if (indexQ.length === 0) {
  const randomIndex = indexTerms[Math.floor(Math.random() * indexTerms.length)];
  indexQ.push(randomIndex);

  // Remove the selected index from indexTerms
  indexTerms = indexTerms.filter(index => index !== randomIndex);
}

console.log(indexQ, indexTerms)

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
      console.log(potentialIndexs, contents[potentialIndexs].split("|"))
    }
  }
  // Adds answer to answer array
  A = termsByCounter[answerIndex];
  arrayOfA[randomNum(0, arrayOfA.length)] = A;

    currentProgress = ((counter - 1) / (contents.length - 2)) * 100;
    document.getElementById("progress").textContent = `${counter - 1}/${contents.length - 2}`;

  question = termsByCounter[indexQ[randomNum(0, indexQ.length)]];

  console.log(arrayOfA);
  display(arrayOfA);
}

// Displays content
function display(answerArray) {

  // removes all previous SVG boxes created
  const parent = document.getElementById("grid-container2");
  while (parent.firstChild) {
    parent.firstChild.remove();
  }

  // hides char mode
  document.querySelectorAll(".char").forEach(element => element.style.display = "none")
  document.querySelectorAll(".answer").forEach(element => element.removeAttribute('style'));

  for (let i = 0; i < 4; i++) {
    document.getElementById(`a${i + 1}`).setAttribute("data-term", answerArray[i]);
    document.getElementById(`a${i + 1}`).textContent = answerArray[i];
  }
  document.getElementById("question").textContent = question;

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
    const greenColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--green')
      .trim();

    // Apply the custom property to the target element
    event.target.style.cssText = `background-color: ${greenColor}; opacity: 1; transition: background-color 0.4s, opacity 0.5s;`;
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
