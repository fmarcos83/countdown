DeadLine = function(config){
    var deadLineDate,
        startDate;

    if (!(config.deadLineDate instanceof Date)) {
        throw {
            name: 'Error',
            message: 'deadLineDate is required to be a valid Date'
        };
    }

    if (!(config.startDate instanceof Date)) {
        throw {
            name: 'Error',
            message: 'startDate is required to be a valid Date'
        };
    }

    deadLineDate = config.deadLineDate;
    startDate    = config.startDate;

    var now = function(){ return Date.now(); };

    return {
        isFinished               : function(){
            return deadLineDate.getTime()<=now();
        },
        getRemainingMilliseconds : function(){
            return deadLineDate.getTime()-now();
        },
        getDeadLineDate          : function(){
            return deadLineDate;
        },
        getStartDate             : function(){
            return getStartDate;
        }
    };
};
