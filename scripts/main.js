var minutes = 25;
var seconds = myRound(0);
var running = false;
var myConsole = document.getElementById('textBox');
var display = document.getElementById('timer');
var wiki = document.getElementById('wikiText');
var interval;
var intervalMessage;
var alarm;
var endMessage = "Por agora é só!_";
var interruptMessage = "Contador pausado_";

var pomodoroLoop = document.getElementById('loop'); // Campo que define o número de loops
var breakTime = document.getElementById('breakTime'); // Campo que define o tempo das repetições

var example = 'The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.';
wiki.innerText = example;
//var pomodoroLoop = 4;
//var breakTime = 1;

var pomodoroQtd;
var definedM;
var definedS;

var barMax; // Tempo total em segundos
var currentBar; // Tempo que falta para o fim
var progressSize;
var barSize;

//header('Access-Control-Allow-Origin: *');

function getGitHubProfileInfos() {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&titles=Pomodoro%20Technique&formatversion=latest&srsearch=Pomodoro%20Technique&srnamespace=0&srlimit=1&srsort=relevance`

    fetch(url).then(response => response.json()).then(data => {
        var teste = data.query.search[0].snippet;
        wiki.innerText = teste;
        console.log(teste);
    })
}

getGitHubProfileInfos();

for (var i = 0; i < 6; i++) { // Preenche values possiveis de loops
    if (i + 1 == 4)
        pomodoroLoop.innerHTML += '<option value="' + (i + 1) + '" selected>' + (i + 1) + "X" + '</option>';
    else
        pomodoroLoop.innerHTML += '<option value="' + (i + 1) + '">' + (i + 1) + "X" + '</option>';
}

// Opcao para testes
breakTime.innerHTML += '<option value="' + 1 + '" selected>' + 1 + ":00" + '</option>';
for (i = 0; i < 4; i++) { // Preenche values possiveis de tempo
    let timeBase = 5;
    if (i + 1 == 1)
        breakTime.innerHTML += '<option value="' + ((i + 1) * timeBase) + '" selected>' + ((i + 1) * timeBase) + ":00" + '</option>';
    else
        breakTime.innerHTML += '<option value="' + ((i + 1) * timeBase) + '">' + ((i + 1) * timeBase) + ":00" + '</option>';
}

function myRound(x) { // Arredonda o número
    if (x.toString().length == 2)
        return x;
    else {
        Math.round(x); // Tipo number
        if (x < 10) {
            x = '0' + x; // Tipo string
        }
        return x;
    }
}

function checkSettings() {
    pomodoroQtd = pomodoroLoop.value;
    definedM = minutes;
    definedS = seconds;
    // console.log(definedM);
    // console.log(definedS);
    // console.log(pomodoroQtd);
    // console.log(breakTime.value);

    // console.log(barMax);
    // console.log(currentBar);
    // console.log(progressSize);
    // console.log(barSize);
    // console.log('-----------------');
}

function showMessage(msg) { //Executa uma mensagem de 5s
    myConsole.childNodes[1].innerText = msg;
    intervalMessage = setTimeout(function () {
        myConsole.childNodes[1].innerText = '';
    }, 5000);
    //clearTimeout(intervalMessage);
}

function consoleNotification(run) {
    if (run) {
        showMessage(interruptMessage);
    } else {
        showMessage(endMessage);
    }
}

function testSettings() {
    minutes = myRound(0);
    seconds = myRound(6);
    checkSettings();
    consoleNotification(running);
}

setInterval(function () {
    display.childNodes[1].innerText = minutes + ":" + seconds;
    // progressTimer(minutes, seconds); //Verificar barra de progresso !!!
    //if (!running) //Repensar isto
    //    checkSettings();
    barMax = ((definedM * 60) + parseInt(definedS, 10)); // Tempo total em segundos
    currentBar = ((minutes * 60) + parseInt(seconds, 10)); // Tempo que falta para o fim
    progressSize = barMax - currentBar;
    barSize = parseInt((progressSize * 100) / barMax, 10);
    document.getElementById('progressBar').style.width = `${barSize}%`
})

$(document).ready(function () { // Botão play/stop - mudança de visibilidade
    $('#stop').hide();
    $("#start").click(function () {
        $('#start').hide();
        $('#stop').show();
    });
    $("#stop").click(function () {
        $('#start').show();
        $('#stop').hide();
    });
});

function alterateTime(x) { //Botões de alterar valor do relogio
    minutes = Number(minutes);
    switch (x) {
        case 1:
            minutes += 1;
            break;
        case 2:
            minutes += 5;
            break;
        case -1:
            if (minutes > 0) {
                minutes -= 1;
            }
            break;
        case -2:
            if (minutes > 0) {
                minutes -= 5;
            }
            break;
    }
    if (minutes < 0) {
        minutes = 0;
    }
    minutes = myRound(Number(minutes));
    checkSettings();
}

function resetTime() { //Reseta o relogio para 25 minutos
    minutes = 25;
    seconds = myRound(0);
    //pomodoroQtd = pomodoroLoop.value;
    checkSettings();
    consoleNotification(running);
}

function startTime() { //Inicia o relogio
    if (pomodoroQtd > 0) {
        if (!running) { //Testa se o relogio chegou ao fim (fim = false)
            minutes = myRound(definedM);
            seconds = myRound(definedS);
        }
        interval = setInterval(function () {
            //if (!running)
            running = true; // Indica que o pomodoro esta rodando
            seconds--;
            if (seconds <= 0) {
                if (minutes > 0) {
                    minutes--;
                    minutes = myRound(minutes);
                    seconds = 59;
                    if (seconds == 59 && minutes == 0)
                        minutes = myRound(minutes);
                } else {
                    document.getElementById('alarm').play();
                    //clearTimeout(alarm);
                    alarm = setTimeout(function () {
                        document.getElementById('alarm').pause();
                    }, 3000);
                    //clearTimeout();
                    //document.getElementById('alarm').play();

                    clearInterval(interval); // Pausa o antigo intervalo
                    pomodoroQtd--; // Decrementa o numero de loopings restantes

                    running = false; // Altera o status do relogio
                    startBreak(); // Inicia uma sessao de pausa
                }
            }
            seconds = myRound(seconds);
        }, 1000)
    }
}

function stopTime() { //Pausa o relogio
    clearInterval(interval);
    consoleNotification(running);
}

function startBreak() {
    if (pomodoroQtd >= 0) {
        // minutes = myRound(breakTime.value);
        // seconds = myRound(0);

        minutes = myRound(0); // Definições pra teste
        seconds = parseInt(myRound(definedS / 2), 10);
        if (pomodoroQtd == 0) {
            // minutes = myRound((breakTime.value)*3);
            // seconds = myRound(0);

            minutes = myRound(0); // Definições pra teste
            seconds = myRound((definedS) * 3);
        }

        interval = setInterval(function () {
            running = true; // Indica que o pomodoro esta rodando
            seconds--;
            if (seconds <= 0) {
                if (minutes > 0) {
                    minutes--;
                    minutes = myRound(minutes);
                    seconds = 59;
                    if (seconds == 59 && minutes == 0)
                        minutes = myRound(minutes);
                } else {
                    //document.getElementById('alarm').play();
                    clearInterval(interval);

                    running = false;
                    if (pomodoroQtd == 0) {
                        $("#stop").click();
                        consoleNotification(running);
                    } else {
                        // showMessage(); //Informar proximo pomodoro?
                        startTime();
                    }

                }
            }
            seconds = myRound(seconds);
        }, 1000)
    }
}

// function progressTimer(min, sec) {
//     document.getElementById('timeProgress').value = ((min * 60) + sec);
// }

// function progressMax(min, sec) {
//     document.getElementById('timeProgress').max = ((min * 60) + sec);
//     //return (min * 60) + sec;
// }

// var viewport = window.innerWidth;

// var barMax = ((definedM * 60) + definedS); // Tempo total em segundos
// var currentBar = ((minutes * 60) + seconds); // Tempo que falta para o fim

// var progressSize = barMax - currentBar;

// Tempo           porcentagem
// barMax          100
// progressSize    x

// var barSize = parseInt((progressSize*100)/barMax, 10);

// //var barSize = (viewport/100);

// document.getElementById('progressBar').style.width = `${barSize}%` 

// document.getElementById('progressJS').style.width

var barMax = ((definedM * 60) + definedS); // Tempo total em segundos
var currentBar = ((minutes * 60) + seconds); // Tempo que falta para o fim
var progressSize = barMax - currentBar;
var barSize = parseInt((progressSize * 100) / barMax, 10);
document.getElementById('progressBar').style.width = `${barSize}%` 