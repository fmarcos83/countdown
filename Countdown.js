Countdown = function(config){

    //all this can be refactored into a validation system
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

    //TODO set pollyfills to check the environment and
    //allow more performance with postMessage
    var MIN_REPEAT_INTERVAL = 10;


    var deadLineDate       = config.deadLineDate,
        startDate          = config.startDate,
        repeatInterval     = config.repeatInterval||MIN_REPEAT_INTERVAL,
        intervalId         = null,
        callback           = config.callback,
        signalSystem       = signals.Signal,
        me                 = this,
        //signals
        updated            = new signalSystem(),
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

    var removeAllSignalListeners = function(){
        stopped.removeAll();
        updated.removeAll();
    };

    var stop = function(){
        intervalId = clearInterval(intervalId);
        stopped.dispatch(me);
        callback = undefined;
        removeAllSignalListeners();
    };

    var interceptCallBack = function(){
        (!deadLine.isFinished())||stop();
        updated.dispatch(me);
        !callback||callback(deadLine);
    };

    getDeadLine = function() {
        return deadLine;
    };

    //TODO hack with the public private
    //methods learn why
    me.getDeadLine = getDeadLine;

    return {

        stopped: stopped,

        updated: updated,

        //TODO: check why this happens
        getDeadLine: function(){
            return getDeadLine();
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
