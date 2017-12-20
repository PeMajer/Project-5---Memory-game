let seconds = 0, minutes = 0, hours = 0;
let t;

function addTime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }  
     $('.timer').text(  ((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds)) );
    timer();
}

function timer() {
    t = setTimeout(addTime, 1000);
}

function startWatch () {
   timer(); 
}

function stopWatch() {
    clearTimeout(t);
}

function clearWatch (argument) {
    $('.timer').text('00:00:00');
    seconds = 0; 
    minutes = 0; 
    hours = 0; 
}
