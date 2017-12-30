// muteki-timer.js
var timerId = 0;
onmessage = function(e) {
    if (timerId !== 0) {
        clearInterval(timerId);
        timerId = 0;
    }
    if (e.data > 0) {
        timerId = setInterval(function() {
            postMessage(null);
        }, e.data);
    }
};
