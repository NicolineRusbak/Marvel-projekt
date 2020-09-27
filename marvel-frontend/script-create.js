const characSubmit = document.querySelector('#characSubmit');
const characFN = document.querySelector('#characFN');
const characLN = document.querySelector('#characLN');
const characAlias = document.querySelector('#characAlias');
const characDoB = document.querySelector('#characDoB');
const characGender = document.querySelector('#characGender');
const characJob = document.querySelector('#characJob');
const characOrigin = document.querySelector('#characOrigin');
const characAbility = document.querySelector('#characAbility');
const characWeakness = document.querySelector('#characWeakness');
const characArtefact = document.querySelector('#characArtefact');
const characActor = document.querySelector('#characActor');
const movieSubmit = document.querySelector('#movieSubmit');
const movieTitle = document.querySelector('#movieTitle');
const movieDescription = document.querySelector('#movieDescription');
const movieReleaseYear = document.querySelector('#movieReleaseYear');
const quoteSubmit = document.querySelector('#quoteSubmit');
const quoteText = document.querySelector('#quoteText');
const quoteMovie = document.querySelector('#quoteMovie');

characSubmit.addEventListener('click', (characSubmit) => {
    characSubmit.preventDefault();
    if (!(characFN.value && characAlias.value && characGender.value && characOrigin.value && characAbility.value && characWeakness.value && characActor.value)) {
        alert('Enter all necessary information.');
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                alert(`Character submission successful: ${xhttp.responseText}`);
                const response = JSON.parse(xhttp.responseText);
            }
            if (this.readyState == 4 && this.status >= 400) {
                alert(`Character submission unsuccessful: ${this.status}`);
            }
        }
        // xhttp.open('GET', 'http://127.0.0.1_8537/api/users/protected');

        // if (myStorage.getItem('currentUser')) {
        // const { token } = JSON.parse(myStorage.getItem('currentUser'));
        // xhttp.setRequestHeader('x-authentication-token', token);
        // }
        // xhttp.send();
        xhttp.open('POST', 'http://127.0.0.1:8537/api/characters', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        const payload = {
            characFirstName: characFN.value,
            characLastName: characLN.value,
            characAlias: characAlias.value,
            characDateOfBirth: characDoB.value,
            characGender: characGender.value,
            characJob: characJob.value,
            characOrigin: characOrigin.value,
            characAbility: characAbility.value,
            characWeakness: characWeakness.value,
            characArtefact: characArtefact.value,
            characActor: characActor.value
        }
        xhttp.send(JSON.stringify(payload));
    }
});

movieSubmit.addEventListener('click', (movieSubmit) => {
    movieSubmit.preventDefault();
    if (!(movieTitle.value && movieDescription.value && movieReleaseYear.value)) {
        alert('Enter all necessary information.');
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                alert(`Movie submission successful: ${xhttp.responseText}`);
                const response = JSON.parse(xhttp.responseText);
            }
            if (this.readyState == 4 && this.status >= 400) {
                alert(`Movie submission unsuccessful: ${this.status}`);
            }
        }
        // xhttp.open('GET', 'http://127.0.0.1_8537/api/users/protected');

        // if (myStorage.getItem('currentUser')) {
        // const { token } = JSON.parse(myStorage.getItem('currentUser'));
        // xhttp.setRequestHeader('x-authentication-token', token);
        // }
        // xhttp.send();
        xhttp.open('POST', 'http://127.0.0.1:8537/api/movies', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        const payload = {
            movieTitle: movieTitle.value,
            movieDescription: movieDescription.value,
            movieReleaseYear: movieReleaseYear.value
        }
        xhttp.send(JSON.stringify(payload));
    }
});

quoteSubmit.addEventListener('click', (quoteSubmit) => {
    quoteSubmit.preventDefault();
    if (!(quoteText.value && quoteMovie.value)) {
        alert('Enter all necessary information.');
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                alert(`Quote submission successful`);
            }
            if (this.readyState == 4 && this.status >= 400) {
                alert(`Quote submission unsuccessful: ${this.status}`);
            }
        }
        // xhttp.open('GET', 'http://127.0.0.1_8537/api/users/protected');

        // if (myStorage.getItem('currentUser')) {
        // const { token } = JSON.parse(myStorage.getItem('currentUser'));
        // xhttp.setRequestHeader('x-authentication-token', token);
        // }
        // xhttp.send();
        xhttp.open('POST', 'http://127.0.0.1:8537/api/quotes', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        const payload = {
            quoteText: quoteText.value,
            quoteMovie: quoteMovie.value,
        }
        xhttp.send(JSON.stringify(payload));
    }
});