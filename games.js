var result = document.getElementById("result");
const batu = document.getElementById("batu");
const gunting = document.getElementById("gunting");
const kertas = document.getElementById("kertas");
const batuCom = document.getElementById("batu-com");
const guntingCom = document.getElementById("gunting-com");
const kertasCom = document.getElementById("kertas-com");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");

button1.addEventListener("click", disabledButtons);
button2.addEventListener("click", disabledButtons);
button3.addEventListener("click", disabledButtons);
button4.addEventListener("click", enabledButtons);

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

function getComputerChoice() {
    var rps = ['r', 'p', 's'];
    const randomChoice = Math.floor(Math.random() * rps.length);
    return rps[randomChoice];
}

function changeColor(result) {
    result.style.color = "white";
    result.style.fontSize = "36px";
    result.style.transform = 'rotate(-30deg)';
    return result;
}

function userWin() {
    result = changeColor(result);
    result.style.background = '#52CC7A';
    result.innerText = 'PLAYER 1 WIN';
}

function userLose() {
    result = changeColor(result);
    result.style.background = '#52CC7A';
    result.innerText = 'COM WIN';
}

function Draw() {
    result = changeColor(result);
    result.style.background = '#35824E';
    result.innerText = 'DRAW';
}

function ulang() {
    result.style.background = 'none';
    result.style.color = 'red';
    result.style.fontSize = '80px';
    result.style.transform = 'rotate(0deg)';
    result.innerText = 'VS';
    gunting.style.background = 'none';
    batu.style.background = 'none';
    kertas.style.background = 'none';
    guntingCom.style.background = 'none';
    batuCom.style.background = 'none';
    kertasCom.style.background = 'none';
}

function game(userChoice) {
    const computerChoice = getComputerChoice();
    switch (userChoice + computerChoice) {
        case 'sp':
            gunting.style.background = '#c4c4c4';
            kertasCom.style.background = '#c4c4c4';
            userWin();
            break;
        case 'rs':
            batu.style.background = '#c4c4c4';
            guntingCom.style.background = '#c4c4c4';
            userWin();
            break;
        case 'pr':
            kertas.style.background = '#c4c4c4';
            batuCom.style.background = '#c4c4c4';
            userWin();
            break;
        case 'sr':
            gunting.style.background = '#c4c4c4';
            batuCom.style.background = '#c4c4c4';
            userLose();
            break;
        case 'rp':
            batu.style.background = '#c4c4c4';
            kertasCom.style.background = '#c4c4c4';
            userLose();
            break;
        case 'ps':
            kertas.style.background = '#c4c4c4';
            guntingCom.style.background = '#c4c4c4';
            userLose();
            break;
        case 'rr':
            batu.style.background = '#c4c4c4';
            batuCom.style.background = '#c4c4c4';
            Draw();
            break;
        case 'pp':
            kertas.style.background = '#c4c4c4';
            kertasCom.style.background = '#c4c4c4';
            Draw();
            break;
        case 'ss':
            gunting.style.background = '#c4c4c4';
            guntingCom.style.background = '#c4c4c4';
            Draw();
            break;
    }
}