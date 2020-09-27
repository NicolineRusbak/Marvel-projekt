const btnListAll = document.querySelector('#listAll');
const divOutput = document.querySelector('#output');
const btnListAllMovies = document.querySelector('#listAllMovies');
const divOutputMovie = document.querySelector('#outputMovie');
const btnListAllQuotes = document.querySelector('#listAllQuotes');
const divOutputQuote = document.querySelector('#outputQuote');


btnListAll.addEventListener('click', (e) => {
    const xhttp = new XMLHttpRequest();
    // XMLHttpRequest() er det der 'snakker' med serveren (library-api). 
    // "The XMLHttpRequest object can be used to exchange data with a web server behind the scenes. This means that it is possible to update parts of a web page, without reloading the whole page."
    xhttp.onreadystatechange = function () { // hvis der sker ændringer på readystate køres funktionen
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            divOutput.innerHTML = '';
            for (let i = 0; i < response.length; i++) {
                //divOutput.innerHTML += `${response[i].title}<br/>`;
                const divCharacter = document.createElement('div');
                divCharacter.innerHTML = `${response[i].characAlias}`;
                divCharacter.addEventListener('click', () => { characterOnClickHandle(response[i].characId) });
                divOutput.appendChild(divCharacter);
            }
        };
        if (this.readyState == 4 && this.status > 400) {
            divOutput.innerHTML = 'Ooops something went wrong.';
        }
    }
    xhttp.open('GET', 'http://127.0.0.1:8537/api/characters', true);
    xhttp.send();
    // Open(): Specifies the type of request
    // send(): Sends the request to the server (used for GET)
});

function characterOnClickHandle(characId) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            for (let i = 0; i < response.length; i++) {
                divOutput.innerHTML = `<p>First name: ${response[i].characFirstName} <p/>
                                        <p>Last name: ${response[i].characLastName} <p/>
                                        <p>Alias: ${response[i].characAlias} <p/>
                                        <p>Date of Birth: ${response[i].characDateOfBirth} <p/>
                                        <p>Gender: ${response[i].characGender} <p/>
                                        <p>Job: ${response[i].characJob} <p/>
                                        <p>Origin: ${response[i].characOrigin} <p/>
                                        <p>Ability: ${response[i].characAbility} <p/>
                                        <p>Weakness: ${response[i].characWeakness} <p/>
                                        <p>Artefact: ${response[i].characArtefact} <p/>
                                        <p>Actor: ${response[i].characActor} <p/>
                                        <p>Movies: ${response[i].movies} <p/>
                                        `;
            }
        }
        if (this.readyState == 4 && this.status > 400) {
            divOutput.innerHTML = 'Ooops something went wrong.';
        }
    }
    xhttp.open('GET', `http://127.0.0.1:8537/api/characters/${characId}`, true);
    xhttp.send();
};

btnListAllMovies.addEventListener('click', (e) => {
    const xhttp = new XMLHttpRequest();
    // XMLHttpRequest() er det der 'snakker' med serveren (library-api). 
    // "The XMLHttpRequest object can be used to exchange data with a web server behind the scenes. This means that it is possible to update parts of a web page, without reloading the whole page."
    xhttp.onreadystatechange = function () { // hvis der sker ændringer på readystate køres funktionen
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            divOutputMovie.innerHTML = '';
            for (let i = 0; i < response.length; i++) {
                //divOutput.innerHTML += `${response[i].title}<br/>`;
                const divMovie = document.createElement('div');
                divMovie.innerHTML = `${response[i].movieTitle}`;
                divMovie.addEventListener('click', () => { movieOnClickHandle(response[i].movieId) });
                divOutputMovie.appendChild(divMovie);
            }
        };
        if (this.readyState == 4 && this.status > 400) {
            divOutputMovie.innerHTML = 'Ooops something went wrong.';
        }
    }
    xhttp.open('GET', 'http://127.0.0.1:8537/api/movies', true);
    xhttp.send();
    // Open(): Specifies the type of request
    // send(): Sends the request to the server (used for GET)
});

function movieOnClickHandle(movieId) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            divOutputMovie.innerHTML = this.responseText;
        }
        if (this.readyState == 4 && this.status > 400) {
            divOutputMovie.innerHTML = 'Ooops something went wrong.';
        }
    }
    xhttp.open('GET', `http://127.0.0.1:8537/api/movies/${movieId}`, true);
    xhttp.send();
};

btnListAllQuotes.addEventListener('click', (e) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            divOutputQuote.innerHTML = '';
            for (let i = 0; i < response.length; i++) {
                divOutputQuote.innerHTML += `"${response[i].quoteText}", ${response[i].characAlias}, ${response[i].quoteMovie}<br/>`;
            }
        };
        if (this.readyState == 4 && this.status > 400) {
            divOutput.innerHTML = 'Ooops something went wrong.';
        }
    }
    xhttp.open('GET', 'http://127.0.0.1:8537/api/quotes', true);
    xhttp.send();
    // Open(): Specifies the type of request
    // send(): Sends the request to the server (used for GET)
});