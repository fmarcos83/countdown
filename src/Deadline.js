DeadLine = function(config){

    var deadLineDate,
        startDate,
        deadLineDateTime,
        startDateTime;

    if (!(config instanceof Object)) {
        throw {
            name    : 'Error',
            message : 'a configuration object is required'
        };
    }

    if (!(config.deadLineDate instanceof Date)) {
        throw {
            name    : 'Error',
            message : 'deadLineDate is required to be a valid Date'
        };
    }

    if (!(config.startDate instanceof Date)) {
        throw {
            name    : 'Error',
            message : 'startDate is required to be a valid Date'
        };
    }

    deadLineDate     = config.deadLineDate;
    startDate        = config.startDate;
    deadLineDateTime = deadLineDate.getTime();
    startDateTime    = startDate.getTime();

    if (startDate.getTime() > deadLineDate.getTime()) {
        throw {
            name: 'Error',
            message: 'deadLineDate is expected to be more than startDate'
        };
    }

    //TODO necesary to inject a way to calculate the current
    //now date and create multipliers a callback function should
    //be enough or a stack
    var now = function(){ return Date.now(); };
    var totalTime = deadLineDateTime - startDateTime;

    return {

        isFinished                                : function(){
            return deadLineDate.getTime() <= now();
        },

        getTimeLeft                               : function() {
            return deadLineDate.getTime() - now();
        },

        getPercentageCompleted                    : function() {
            return Math.round(
                (now() - startDateTime)/totalTime*100
            );
        },

        getDeadLineDate                           : function(){
            return deadLineDate;
        },

        getStartDate                              : function(){
            return startDate;
        }
    };
};
