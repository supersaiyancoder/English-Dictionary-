const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    volume = wrapper.querySelector(".word i"),
    infoText = wrapper.querySelector(".info-text"),
    synonyms = wrapper.querySelector(".synonyms .list"),
    removeIcon = wrapper.querySelector(".search span");

let audio;

function data(result, word) {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    } else {
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
            phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions.definition;

        // Example Section
        if (definitions.example) {
            document.querySelector(".example span").innerText = definitions.example;
            document.querySelector(".example").style.display = "block";
        } else {
            document.querySelector(".example").style.display = "none";
        }

        // Synonyms Section
        if (definitions.synonyms.length > 0) {
            document.querySelector(".synonyms").style.display = "block";
            document.querySelector(".synonyms .list").innerHTML = "";
            for (let i = 0; i < Math.min(5, definitions.synonyms.length); i++) {
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                tag = i === 4 ? `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
                document.querySelector(".synonyms .list").insertAdjacentHTML("beforeend", tag);
            }
        } else {
            document.querySelector(".synonyms").style.display = "none";
        }

        audio = new Audio(result[0].phonetics[0].audio);
    }
}


function search(word) {
    fetchApi(word);
    searchInput.value = word;
}

function fetchApi(word) {
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then(response => response.json())
        .then(result => data(result, word))
        .catch(() => {
            infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
        });
}

searchInput.addEventListener("keyup", e => {
    let word = e.target.value.replace(/\s+/g, ' ');
    if (e.key == "Enter" && word) {
        fetchApi(word);
    }
});

volume.addEventListener("click", () => {
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() => {
        volume.style.color = "#999";
    }, 800);
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});