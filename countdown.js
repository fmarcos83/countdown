countDown = function(config){
    //TODO how to add constants in JS
    countDown.interval = 100;
    if (config===undefined) {
        throw {
            name: 'Error',
            message: 'configuration literal is required'
        };
    }
    if (config.deadLine===undefined) {
        throw {
            name: 'Error',
            message: 'deadLine property is required'
        };
    }
    var deadLine   = new Date(config.deadLine);
    var repeatInterval   = config.interval||100;
    var intervalId = null;
    var callback = config.callback||function(){};
    return {
        getDeadLine: function(){
            return deadLine;
        },
        getInterval: function(){
            return repeatInterval;
        },
        init: function(){
            intervalId = intervalId||setInterval(callback, repeatinterval);
        },
        stop: function(){
            clearInterval(intervalId);
        }
    };
};
