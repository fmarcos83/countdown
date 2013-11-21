window.onload=function(){
    var view = document.getElementById('countdown');
    var viewText = document.getElementById('countdowntext');
    var viewTextS = document.getElementById('countdowntextstart');
    var viewTextR = document.getElementById('remainingtime');
    var callBackFunction = function(deadLine){
        view.textContent = deadLine.getPercentageCompleted();
        viewText.textContent = deadLine.getDeadLineDate();
        viewTextS.textContent = deadLine.getStartDate();
        var time = deadLine.getTimeLeft();
        var day = Math.floor(time/(1000*3600*24));
        viewTextR.textContent = day;
    };
    var cd = new countDown({
        repeatInterval : 10,
        deadLineDate   : new Date(Date.now()+3600*1000*24),
        callback: callBackFunction
    });
    var cd2 = new countDown({
        repeatInterval : 20,
        deadLineDate   : new Date('2014'),
        callback: callBackFunction
    });
    cd2.init();
}
