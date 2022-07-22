var minutes = 25;
var seconds = myRound(0);
var running = false;
var myConsole = document.getElementById('textBox');
var display = document.getElementById('timer');
var interval;
var intervalMessage;
var endMessage = "Por agora é só!";
var interruptMessage = "Contador pausado";

var pomodoroLoop = document.getElementById('loop'); // Campo que define o número de loops
var breakRepeat = document.getElementById('breakRepeat'); // Campo que define o tempo das repetições

var pomodoroQtd;
var definedM;
var definedS;

for (var i = 0; i < 6; i++) { // Preenche values possiveis de loops
    if (i + 1 == 4)
        pomodoroLoop.innerHTML += '<option value="' + (i + 1) + '" selected>' + (i + 1) + "X" + '</option>';
    else
        pomodoroLoop.innerHTML += '<option value="' + (i + 1) + '">' + (i + 1) + "X" + '</option>';
}

for (i = 0; i < 4; i++) { // Preenche values possiveis de tempo
    let timeBase = 5;
    if (i + 1 == 1)
        breakRepeat.innerHTML += '<option value="' + ((i + 1) * timeBase) + '" selected>' + ((i + 1) * timeBase) + ":00" + '</option>';
    else
        breakRepeat.innerHTML += '<option value="' + ((i + 1) * timeBase) + '">' + ((i + 1) * timeBase) + ":00" + '</option>';
}

function myRound(x) { // Arredonda o número
    Math.round(x); // Tipo number
    if (x < 10) {
        x = '0' + x; // Tipo string
    }
    return x;
}

function checkSettings() {
    pomodoroQtd = pomodoroLoop.value;
    definedM = minutes;
    definedS = seconds;
    console.log(pomodoroQtd);
    console.log(typeof interval);
    //console.log(pomodoroQtd);
}

// minutes = 25;
// seconds = myRound(0);
// checkSettings();

/*minutes = myRound(0); //Para testes
seconds = 10;*/

setInterval(function () {
    display.childNodes[1].innerHTML = minutes + ":" + seconds;
    // progressTimer(minutes, seconds); //Verificar barra de progresso !!!
    //if (!running) //Repensar isto
    //    checkSettings();
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

function showMessage(msg) {
    intervalMessage = setInterval(function () {
        //Executa uma mensagem de 5s
        myConsole.childNodes[2].innerHTML = msg;
    }, 5000);
    clearInterval(intervalMessage);
}


function stopInterval() { //Apaga/pausa a mensagem temporaria
    clearInterval(intervalMessage);
    myConsole.childNodes[2].innerHTML = "";
}

/*function msgInterval() { //Executa uma mensagem de 5s
    myConsole.childNodes[2].innerHTML = interruptMessage;
}*/

function consoleNotification(run) {
    if (run) {
        stopTime();
        $("#stop").click();

        //msgInterval();
        var intervalMessage = setInterval(function () {
            //Executa uma mensagem de 5s
            myConsole.childNodes[2].innerHTML = interruptMessage;
        }, 5000);
        clearInterval(intervalMessage);
    }
}

function alterateTime(x) { //Botões de alterar valor do relogio
    minutes = Number(minutes);
    switch (x) {
        case 1:
            minutes += 1;
            consoleNotification(running);
            break;
        case 2:
            minutes += 5;
            consoleNotification(running);
            break;
        case -1:
            if (minutes > 0) {
                minutes -= 1;
                consoleNotification(running);
            }
            break;
        case -2:
            if (minutes > 0) {
                minutes -= 5;
                consoleNotification(running);
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

function progressTimer(min, sec) {
    document.getElementById('timeProgress').value = ((min * 60) + sec);
}

function progressMax(min, sec) {
    document.getElementById('timeProgress').max = ((min * 60) + sec);
    //return (min * 60) + sec;
}

function startTime() { //Inicia o relogio
    if (pomodoroQtd < 0) {
        if (!running) { //Testa se o relogio chegou ao fim
            minutes = definedM;
            seconds = definedS;
            progressMax(minutes, seconds);
        }
        progressMax(minutes, seconds); //Esse
        interval = setInterval(function () {

            //if (!running)
            //    progressMax(minutes, seconds);

            running = true;

            seconds--;
            if (seconds <= 0) {
                if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                    if (seconds == 59 && minutes == 0)
                        minutes = myRound(minutes);
                } else {
                    document.getElementById('alarm').play();
                    myConsole.childNodes[2].innerHTML = endMessage;
                    clearInterval(interval);
                    //$("#stop").click();
                    pomodoroQtd--;

                    running = false;
                    startBreak();
                }
            }
            seconds = myRound(seconds);
        }, 1000)
    }
}

function startBreak() {
    progressMax(minutes, seconds);
    if (pomodoroQtd >= 0) {
        //minutes = myRound(0);
        //seconds = myRound(5);
        minutes = myRound(pomodoroLoop.value);
        seconds = myRound(0);
        progressMax(minutes, seconds);
        if (pomodoroQtd == 0) {
            //minutes = myRound(0);
            //seconds = 5 * 3;
            minutes = myRound(pomodoroLoop.value * 3);
            seconds = myRound(0);
            progressMax(minutes, seconds);
        }


        progressMax(minutes, seconds);
        interval = setInterval(function () {
            running = true;

            seconds--;
            if (seconds <= 0) {
                if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                    if (seconds == 59 && minutes == 0)
                        minutes = myRound(minutes);
                } else {
                    document.getElementById('alarm').play();
                    myConsole.childNodes[2].innerHTML = endMessage;
                    clearInterval(interval);
                    //$("#stop").click();

                    running = false;
                    startTime();
                }
            }
            seconds = myRound(seconds);
        }, 1000)
    }
}

function stopTime() {
    clearInterval(interval);
    //running = false;
}