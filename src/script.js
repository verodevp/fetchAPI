import './style.css'

const search = document.getElementById("search");
const input = document.getElementById("testo");

search.addEventListener("click", (e) => {
  let testoDigitato = input.value.trim().toLowerCase();

  const apiURL = `https://openlibrary.org/subjects/${testoDigitato}.json`;

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nella richiesta");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.works);
      const tagUl = document.querySelector(".wrapper");
      tagUl.innerHTML = "";
      console.log(tagUl);

      data.works.forEach((element) => {
        let tagLi = document.createElement("li");
        let listLink = document.createElement("a");
        listLink.href = "#";
        listLink.textContent = element.title;
        listLink.setAttribute("id", `${element.key}`); //imposto l' attributo id con valore chiave

        listLink.addEventListener("click", function (e) {
          e.preventDefault();
          console.log(this);
          bookDetails(this.getAttribute("id"), tagLi);
        });

        //creazione del paragrafo con gli autori
        let authorsPar = document.createElement("p");
        authorsPar.textContent =
          "Authors: " + element.authors.map((author) => author.name).join(", ");

        //creazione del div per contenere la descrizione
        let description = document.createElement("div");
        description.classList.add("description");
        description.style.display = "none";

        //aggiungo gli element
        tagLi.appendChild(listLink);
        tagLi.appendChild(authorsPar);
        tagLi.appendChild(description);

        tagUl.appendChild(tagLi);
      });
    })
    .catch((e) => {
      console.error(e.message);
      document.querySelector(".wrapper").innerHTML =
        "Errore nel recupero dei dati";
    });
});

function bookDetails(key, item) {
  const detailUrl = `https://openlibrary.org${key}.json`;

  fetch(detailUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nel recupero della descrizione");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let descriptionDiv = item.querySelector(".description");

      if (data.description) {
        // Se la descrizione è un oggetto, prendo la proprietà "value"
        descriptionDiv.textContent =
          typeof data.description === "object"
            ? data.description.value
            : data.description;
      } else {
        descriptionDiv.textContent = "No description available";
      }

      // Mostro la descrizione
      descriptionDiv.style.display = "block";
    })
    .catch((error) => {
      console.error(error.message);
      descriptionDiv.innerHTML = "Errore nel recupero dei dati";
    });
}
