const btnListAll = document.querySelector('#listAll');
const divOutput = document.querySelector('#output');

btnListAll.addEventListener('click', (e) => {
    const xhttp = new XMLHttpRequest(); 
    // XMLHttpRequest() er det der 'snakker' med serveren (library-api). 
    // "The XMLHttpRequest object can be used to exchange data with a web server behind the scenes. This means that it is possible to update parts of a web page, without reloading the whole page."
    xhttp.onreadystatechange = function () { // hvis der sker ændringer på readystate køres funktionen
        if (this.readyState == 4 && this.status == 200){
            const response = JSON.parse(this.responseText);
            divOutput.innerHTML = '';
            for(let i = 0; i < response.length; i++){
                //divOutput.innerHTML += `${response[i].title}<br/>`;
                const divCharacter = document.createElement('div');
                divCharacter.innerHTML = `${response[i].characAlias}`;   
                divCharacter.addEventListener('click', () => { characterOnClickHandle(response[i].characId)} ); 
                divOutput.appendChild(divCharacter);              
            }
        };
        if (this.readyState == 4 && this.status > 400) {
            divOutput.innerHTML = 'Ooops something went wrong.';
        }
    }
    xhttp.open('GET', 'http://127.0.0.1:8543/api/characters', true);
    xhttp.send();
    // Open(): Specifies the type of request
    // send(): Sends the request to the server (used for GET)
});

function characterOnClickHandle(characId) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            divOutput.innerHTML = this.responseText;
        }
        if (this.readyState == 4 && this.status > 400) {
            divOutput.innerHTML = 'Ooops something went wrong.';
        }
    }
    xhttp.open('GET', `http://127.0.0.1:8543/api/characters/${characId}`, true);
    xhttp.send();
}