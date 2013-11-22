Countdown = function(config){

    var me = this;
    //TODO how to add constants in JS
    var MIN_REPEAT_INTERVAL = 10;

    var deadLineDate,
        deadLine,
        repeatInterval,
        intervalId,
        callback;

    if (config===undefined) {
        throw {
            name: 'Error',
            message: 'configuration literal is required'
        };
    }

    if (!(config.deadLineDate instanceof Date)) {
        throw {
            name: 'Error',
            message: 'deadLineDate property is required'
        };
    }

    if (!(config.callback instanceof Function)) {
        throw {
            name: 'Error',
            message: 'callback'
        };
    }

    deadLineDate   = config.deadLineDate;
    startDate      = config.startDate;
    repeatInterval = config.repeatInterval||MIN_REPEAT_INTERVAL;
    intervalId     = null;
    callback       = config.callback;

    //TODO: seems like a candidate to be refactored
    deadLine       = new DeadLine({
        startDate    : startDate||new Date(),
        deadLineDate : deadLineDate
    });

    var isDeadLine = function() {
        return deadLine.isFinished();
    };

    stop = function(){
        intervalId = clearInterval(intervalId);
        callback = undefined;
    };

    var interceptCallBack = function(){
        //TODO: this doesn't seem a very good practice
        //here seems better an interface
        (!deadLine.isFinished())||stop();
        !callback||callback(deadLine);
    };

    return {
        //deprecated
        getDeadLineDate: function(){
            return deadLineDate;
        },
        getDeadLine: function(){
            return deadLine;
        },
        getRepeatInterval: function(){
            return repeatInterval;
        },
        init: function(){
            intervalId = intervalId||setInterval(interceptCallBack, repeatInterval);
        },
        getIntervalId: function(){
            return intervalId;
        },
        stop: function(){
            return stop();
        }
    };

};
