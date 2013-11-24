var cd = {};
window.onload=function(){
    var view = document.getElementById('countdown');
    var viewText = document.getElementById('countdowntext');
    var viewTextS = document.getElementById('countdowntextstart');
    var viewTextR = document.getElementById('remainingtime');
    var callBackFunction = function(cd){
        var deadLine = cd.getDeadLine();
        var percentage = deadLine.getPercentageCompleted();
        view.textContent = (percentage<100)?percentage:100;
        viewText.textContent = deadLine.getDeadLineDate();
        viewTextS.textContent = deadLine.getStartDate();
        var time = deadLine.getTimeLeft();
        var day = Math.floor(time/(1000*3600*24));
        viewTextR.textContent = (time>0)?Math.floor(time)/1000:0;
    };
    cd = new Countdown({
        deadLineDate   : new Date(Date.now()+(1*1000)),
        callback: function(){}
    });
    cd.updated.add(callBackFunction);
    cd.stopped.add(callBackFunction);
    cd.init();
}
