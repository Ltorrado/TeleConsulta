
var startTime;
var seguirContandoTiempo=true;
$('[data-toggle="tooltip"]').tooltip();  
function display() {
    // later record end time
    var endTime = new Date();

    // time difference in ms
    var timeDiff = endTime - startTime;

    // strip the miliseconds
    timeDiff /= 1000;

    // get seconds
    var seconds = Math.round(timeDiff % 60);
    if(seconds.toString().length==1){
      seconds="0"+seconds;
   }
    // remove seconds from the date
    timeDiff = Math.floor(timeDiff / 60);

    // get minutes
    var minutes = Math.round(timeDiff % 60);
debugger
if(minutes.toString().length==1){
   minutes="0"+minutes;
}

    // remove minutes from the date
    timeDiff = Math.floor(timeDiff / 60);

    // get hours
    var hours = Math.round(timeDiff % 24);

    // remove hours from the date
    timeDiff = Math.floor(timeDiff / 24);

    // the rest of timeDiff is number of days
    var days = timeDiff;

   var tiempo= document.getElementById("time");
   tiempo.innerHTML=( hours + ":" + minutes + ":" + seconds);
   if(seguirContandoTiempo){
    setTimeout(display, 1000);
   }
  
}

function empezarTiempo(){
  startTime = new Date();
  setTimeout(display, 1000);
}
