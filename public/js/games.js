const batu = document.getElementById("button1");
const kertas = document.getElementById("button2");
const gunting = document.getElementById("button3");
const batuCom = document.getElementById("computerChoice1");
const kertasCom = document.getElementById("computerChoice2");
const guntingCom = document.getElementById("computerChoice3");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");

button1.addEventListener("click", disabledButtons);
button2.addEventListener("click", disabledButtons);
button3.addEventListener("click", disabledButtons);
button4.addEventListener("click", enabledButtons);

function ulang() {
    game1.result.style.background = 'none';
    game1.result.style.color = 'red';
    game1.result.style.fontSize = '80px';
    game1.result.style.transform = 'rotate(0deg)';
    game1.result.innerText = 'VS';
    gunting.style.background = 'none';
    batu.style.background = 'none';
    kertas.style.background = 'none';
    guntingCom.style.background = 'none';
    batuCom.style.background = 'none';
    kertasCom.style.background = 'none';
}

function disabledButtons() {
    button1.disabled = true;
    button2.disabled = true;
    button3.disabled = true;
    button4.disabled = false;
}

function enabledButtons() {
    button1.disabled = false;
    button2.disabled = false;
    button3.disabled = false;
    button4.disabled = true;
}

class game {
    constructor(userChoice, computerChoice) {
        this.userChoice = userChoice;
        this.computerChoice = computerChoice;
    }

    result = document.getElementById("result");

    rockpaperscissors(userChoice, computerChoice) {
        switch (userChoice + computerChoice) {
            case 'sp':
                gunting.style.background = '#c4c4c4';
                kertasCom.style.background = '#c4c4c4';
                this.#userWin();
                break;
            case 'rs':
                batu.style.background = '#c4c4c4';
                guntingCom.style.background = '#c4c4c4';
                this.#userWin();
                break;
            case 'pr':
                kertas.style.background = '#c4c4c4';
                batuCom.style.background = '#c4c4c4';
                this.#userWin();
                break;
            case 'sr':
                gunting.style.background = '#c4c4c4';
                batuCom.style.background = '#c4c4c4';
                this.#userLose();
                break;
            case 'rp':
                batu.style.background = '#c4c4c4';
                kertasCom.style.background = '#c4c4c4';
                this.#userLose();
                break;
            case 'ps':
                kertas.style.background = '#c4c4c4';
                guntingCom.style.background = '#c4c4c4';
                this.#userLose();
                break;
            case 'rr':
                batu.style.background = '#c4c4c4';
                batuCom.style.background = '#c4c4c4';
                this.#Draw();
                break;
            case 'pp':
                kertas.style.background = '#c4c4c4';
                kertasCom.style.background = '#c4c4c4';
                this.#Draw();
                break;
            case 'ss':
                gunting.style.background = '#c4c4c4';
                guntingCom.style.background = '#c4c4c4';
                this.#Draw();
                break;
        }
    }

    getComputerChoice() {
        var rps = ['r', 'p', 's'];
        const randomChoice = Math.floor(Math.random() * rps.length);
        return rps[randomChoice];
    }

    #userWin() {
        this.result = this.#changeColor(this.result);
        this.result.style.background = '#52CC7A';
        this.result.innerText = 'PLAYER 1 WIN';
    }

    #userLose() {
        this.result = this.#changeColor(this.result);
        this.result.style.background = '#52CC7A';
        this.result.innerText = 'COM WIN';
    }

    #Draw() {
        this.result = this.#changeColor(this.result);
        this.result.style.background = '#35824E';
        this.result.innerText = 'DRAW';
    }

    #changeColor(result) {
        result.style.color = "white";
        result.style.fontSize = "36px";
        result.style.transform = 'rotate(-30deg)';
        return result;
    }
}

let game1 = new game('n', 'n');

function chosen(userChoice) {
    game1.computerChoice = game1.getComputerChoice();
    game1.rockpaperscissors(userChoice, game1.computerChoice);
}