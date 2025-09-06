const textInput = document.getElementById("textInput")
const excludeSpace = document.getElementById("excludeSpace")
const setLimit = document.getElementById("setLimit")
const limitCharacter = document.getElementById("limitCharacter")
const limitMessage = document.getElementById("limitMessage")

const charCount = document.getElementById("charCount")
const wordCount = document.getElementById("wordCount")
const sentenceCount = document.getElementById("sentenceCount")
const readingTime = document.getElementById("readingTime")
const letterDensity = document.getElementById("letterDensity")
const toggleView = document.getElementById("toggleView")

const toggleTheme = document.getElementById("toggleTheme");
const moonIcon = document.getElementById("moonIcon");

let showAllLetters = false;

textInput.addEventListener("input", updateStats);
excludeSpace.addEventListener("change", updateStats);
setLimit.addEventListener("change", () => {
    if(setLimit.checked) {
        limitCharacter.classList.remove("hidden");
        limitCharacter.classList.add("block");
    } else {
        limitCharacter.classList.add("hidden");
        limitCharacter.classList.remove("block");
        limitCharacter.value = "";
    }
    updateStats();
});

limitCharacter.addEventListener("input", updateStats);

// text input auto resize
textInput.addEventListener("input", () => {
  textInput.style.height = "auto";   // reset
  textInput.style.height = textInput.scrollHeight + "px"; // grow
});


// Local storage for Toggle Theme

if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
        moonIcon.src = "/assets/images/icon-sun.svg";
        moonIcon.alt = "icon-sun";
    } else {
        document.documentElement.classList.remove("dark");
        moonIcon.src = "/assets/images/icon-moon.svg";
        moonIcon.alt = "icon-moon";
    }


// toggle theme
toggleTheme.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")){
        localStorage.setItem("theme", "dark");
        moonIcon.src = "/assets/images/icon-sun.svg";
        moonIcon.alt = "icon-sun";
    } else {
        localStorage.setItem("theme", "light");
        moonIcon.src = "/assets/images/icon-moon.svg";
        moonIcon.alt = "icon-moon";
    }
});

toggleView.addEventListener ("click", () => {
    showAllLetters = !showAllLetters;
    updateStats();
})

function updateStats() {
    let text = textInput.value;

    // Apply limit if enabled
    if(setLimit.checked && limitCharacter.value) {
        const limit = parseInt(limitCharacter.value, 10) || 0;
        
        if (text.length > limit) {
            text = text.slice(0, limit);
            textInput.value = text;
            limitMessage.innerHTML = `Limit Reached! Your text exceeds ${limit} characters.`;
            limitMessage.classList.add("text-orange-800", "tp-4")
        } else {
            limitMessage.innerHTML = "";
            limitMessage.className = "";
        }
    }

    // Exclude spaces if checked
    let charLength = excludeSpace.checked 
    ? text.replace(/\s/g, "").length
    : text.length;

    // Word & sentence counts
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim() !== "").length;
    
    // Reading time
    const readTime = words / 200;
    const readTimeText = words === 0 ? "0 minute" :
        readTime < 1 ? "< 1 minute" : `${Math.ceil(readTime)} minute`;

    // Letter frequency calculation
    const freq = {};
    for (let char of text.toUpperCase()) {
        if (/[A-Z]/.test(char)) {
            freq[char] = (freq[char] || 0) + 1;
        }
    }
    
    let sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1]);

    if(!showAllLetters) {
        sorted = sorted.slice(0, 5);
    }

    // Update UI
    charCount.textContent = charLength.toString().padStart(2, "0");
    wordCount.textContent = words.toString().padStart(2, "0");
    sentenceCount.textContent = sentences.toString().padStart(2, "0");
    readingTime.innerHTML = `Approx. reading time: ${readTimeText}`;

    // Letter Density UI
    if(charLength === 0) {
        letterDensity.innerHTML = `<p class="tp-4 text-neutral-600 dark:text-neutral-200">No characters found. Start typing to see letter density.</p>`;
        toggleView.style.display ="none";
    } else {
        letterDensity.innerHTML = sorted.map(([letter, count]) => {
            const percent = ((count / charLength) * 100).toFixed(2);
            return `
            <div class="flex items-center gap-3">
                <div class="tp-4 text-neutral-900 dark:text-neutral-200">${letter}</div>
                <div class="h-3 w-56 bg-neutral-100 dark:bg-neutral-800 rounded-full mx-4 md:w-full">
                    <div 
                        class="h-3 rounded-full bg-purple-400" 
                        style="width:${percent}%">
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <p class="tp-4 text-neutral-900 dark:text-neutral-200">${count}</p>
                    <p class="tp-4 text-neutral-900 dark:text-neutral-200">(${percent}%)</p>
                </div>
            </div>
            `
        }). join("");

        // Show button only if there are more than 5 letters

        if(Object.keys(freq).length > 5) {
            toggleView.style.display = "inline-block";
            toggleView.style.cursor = "pointer";
            toggleView.innerHTML = `
                <span class="tp-3 text-neutral-900 dark:text-neutral-200">
                    ${showAllLetters ? "See Less ⌃" : "See more ⌄"}
                </span>
            `;
        } else {
            toggleView.style.display = "none";
        }

    }
}

updateStats();