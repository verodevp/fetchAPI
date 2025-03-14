const search = document.getElementById("search");
const input = document.getElementById("testo");

search.addEventListener("click", () => {
    let testoDigitato = input.value.trim();

    if (!testoDigitato) return;

    const apiURL = `https://openlibrary.org/subjects/${testoDigitato}.json`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta");
            }
            return response.json();
        })
        .then(data => {
            console.log(data.works);
            const tagUl = document.querySelector(".wrapper");
            tagUl.innerHTML = ""; // Pulisco la lista prima di aggiornare

            data.works.forEach(element => {
                let listItem = document.createElement("li");

                // Creazione del titolo come link
                let titleLink = document.createElement("a");
                titleLink.href = "#";
                titleLink.textContent = element.title;
                titleLink.dataset.key = element.key; // Salvo la key del libro
                titleLink.addEventListener("click", function (event) {
                    event.preventDefault();
                    fetchBookDetails(this.dataset.key, listItem);
                });

                // Creazione del paragrafo con gli autori
                let authorsParagraph = document.createElement("p");
                authorsParagraph.textContent = "Authors: " + element.authors.map(author => author.name).join(", ");

                // Creazione del div per la descrizione (inizialmente vuoto e nascosto)
                let descriptionDiv = document.createElement("div");
                descriptionDiv.classList.add("description");
                descriptionDiv.style.display = "none";

                // Aggiungo gli elementi al listItem
                listItem.appendChild(titleLink);
                listItem.appendChild(authorsParagraph);
                listItem.appendChild(descriptionDiv);

                // Aggiungo il listItem alla lista
                tagUl.appendChild(listItem);
            });
        })
        .catch(error => console.error(error));
});

// Funzione per recuperare e mostrare la descrizione
function fetchBookDetails(bookKey, listItem) {
    const detailUrl = `https://openlibrary.org${bookKey}.json`;

    fetch(detailUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nel recupero della descrizione");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            let descriptionDiv = listItem.querySelector(".description");

            if (data.description) {
                // Se la descrizione è un oggetto, prendo la proprietà "value"
                descriptionDiv.textContent = typeof data.description === "object" ? data.description.value : data.description;
            } else {
                descriptionDiv.textContent = "Descrizione non disponibile.";
            }

            // Mostro la descrizione
            descriptionDiv.style.display = "block";
        })
        .catch(error => console.error(error));
}
