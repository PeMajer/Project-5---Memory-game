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
     $('.timer').text( ((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds)) );
}

function startWatch () {
   t = setInterval(addTime, 1000);
}

function stopWatch() {
    clearInterval(t);
}

function clearWatch() {
    $('.timer').text('00:00:00');
    seconds = 0; 
    minutes = 0; 
    hours = 0; 
}
