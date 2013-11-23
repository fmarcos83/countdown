Countdown = function(config){

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
            message: 'callback is required to be a Function'
        };
    }

    if ((config.repeatInterval||MIN_REPEAT_INTERVAL)<MIN_REPEAT_INTERVAL) {
        throw {
            name: 'Error',
            message: 'repeatInterval can not be less than '+MIN_VALUE
        };
    }

    var MIN_REPEAT_INTERVAL = 4;

    var deadLineDate       = config.deadLineDate,
        startDate          = config.startDate,
        repeatInterval     = config.repeatInterval||MIN_REPEAT_INTERVAL,
        intervalId         = null,
        callback           = config.callback,
        signalSystem       = signals.Signal,
        stopped            = new signalSystem();

    //it's necesary to set which kind of instance
    //for deadline we want one with boundaries or
    //one that gives us with the proper info
    var deadLine = new DeadLine({
        startDate    : startDate||new Date(),
        deadLineDate : deadLineDate
    });

    var instantiateSignal = function() {
        return new signals.Signal();
    };

    var isDeadLine = function() {
        return deadLine.isFinished();
    };

    var stop = function(){
        intervalId = clearInterval(intervalId);
        stopped.dispatch(deadLine);
        callback = undefined;
    };

    var interceptCallBack = function(){
        !callback||callback(deadLine);
        (!deadLine.isFinished())||stop();
    };

    return {

        stopped: stopped,

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
            stop();
        }

    };

};
