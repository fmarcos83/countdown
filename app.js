var CountDown = CountDown||{};
CountDown.init = function(config){
    var config = config || {};
    this.delay = config.delay||1000;
    var deadLine = config.deadLine||'';
    var deadLineTime = new Date(deadLine);
    CountDown.deadLineTime = deadLineTime;
    CountDown.interval = CountDown.interval || window.setInterval(CountDown.render, this.delay);
    CountDown.renderNode = window.document.getElementById('countdown');
};
CountDown.stop = function(){
    CountDown.interval = !CountDown.interval || window.clearInterval(CountDown.interval);
};
CountDown.secondsLeft = function(){
    var deadLine = CountDown.deadLineTime;
    var secondsLeft = (deadLine-Date.now())/1000;
    return parseInt(secondsLeft);
};
CountDown.render = function(){
    var secondsLeft = parseInt(CountDown.secondsLeft());
    var hoursLeft = parseInt(secondsLeft/3600);
    var daysLeft = parseInt(hoursLeft/24);
    var message = 'Vuelta a casaaaa !!!';
    if (secondsLeft>0) {
        message = 'Quedan %h horas'.replace(/%h/g,hoursLeft);
        message = 'Quedan %d dias'.replace(/%d/g,daysLeft);
        message = 'Quedan %s segundos'.replace(/%s/g,secondsLeft);
    }else{
        CountDown.stop();
    }
    CountDown.display(CountDown.renderNode, message);
};
CountDown.display = function(node, message){
    node.textContent = message;
}
window.onload=function(){
    CountDown.init({deadLine:'2014-09-01'});
}
