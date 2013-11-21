require('../deadline.js');

describe('required configuration on DeadLine instantatation', function(){

    it('config not present throws exception', function(){
        var deadLineInstantation = function() {
            new DeadLine();
        };
        expect(deadLineInstantation).toThrow({
            name: 'Error',
            message: 'a configuration object is required'
        });
    });

    it('deadLineDate not present throws exception', function(){
        var deadLineInstantation = function() {
            new DeadLine({});
        };
        expect(deadLineInstantation).toThrow({
            name: 'Error',
            message: 'deadLineDate is required to be a valid Date'
        });
    });

    it('startDate not present throws exception', function(){
        var deadLineInstantation = function() {
            new DeadLine({deadLineDate: new Date()});
        };
        expect(deadLineInstantation).toThrow({
            name: 'Error',
            message: 'startDate is required to be a valid Date'
        });
    });

});

describe('a startDate cannot be older than endDate', function(){

    var now                     = Date.now();
    var nextYearInMilliseconds  = now+365*24*1000*3600;
    var yesterdayInMilliseconds = now-24*3600;

    it('it throws an exception if startDate is older than endDate', function(){

        var instantatation = function(){
            new DeadLine({
                deadLineDate : new Date(now-1),
                startDate    : new Date(now)
            });
        };

        expect(instantatation).toThrow({
            name: 'Error',
            message: 'deadLineDate is expected to be less than startDate'
        });

    });

});

describe('a deadline is finished or not according to the deadLine date', function(){

    var now                     = Date.now();
    var nextYearInMilliseconds  = now+365*24*1000*3600;
    var yesterdayInMilliseconds = now-24*3600;
    var nextYearDate            = null;
    var yesterDayDate           = null;
    var nowDate                 = new Date();
    var nowBuiltinFunction      = Date.now;

    beforeEach(function(){
        nextYearDate = new Date(nextYearInMilliseconds);
        yesterDayDate = new Date(yesterdayInMilliseconds);
        //stoping the clocks :) Date.now it's going to
        //read the time in millisecons on top of this test
        Date.now = function(){ return now; };
    });

    afterEach(function(){
        //restoring Date.now to it's former self :)
        Date.now = nowBuiltinFunction;
    });

    it('is finished', function() {
        var deadLine = new DeadLine({
            deadLineDate : yesterDayDate,
            startDate    : new Date(yesterdayInMilliseconds-1)
        });
        expect(deadLine.isFinished()).toBe(true);
    });

    it('remainigMilliseconds is -0 < 0 if finished', function(){
        var deadLine = new DeadLine({
            deadLineDate : yesterDayDate,
            startDate    : new Date(yesterdayInMilliseconds-1)
        });
        expect(deadLine.getTimeLeft()).toBeLessThan(0);
    });

    it('remainigMilliseconds is 0 if just finished', function(){
        var deadLine = new DeadLine({
            deadLineDate : nowDate,
            startDate    : new Date(yesterdayInMilliseconds)
        });
        expect(deadLine.isFinished()).toBe(true);
        expect(deadLine.getTimeLeft()).toBe(0);
    });

    //TODO: some testing is needed to check for especial
    //conditions on max values

    it('it\'s not finished', function() {
        var deadLine = new DeadLine({
            deadLineDate : nextYearDate,
            startDate    : new Date(Date.now())
        });
        expect(deadLine.isFinished()).toBe(false);
    });

    it('testing Date adjustment to 1 milliseconds', function(){
        var deadLine = new DeadLine({
            deadLineDate : new Date(now+1),
            startDate    : new Date(Date.now())
        });
        expect(deadLine.isFinished()).toBe(false);
        expect(deadLine.getTimeLeft()).toBe(1);
    });

});

describe('percentage completed', function(){

    var now = Date.now();
    var nowBuiltinFunction = Date.now;
    var startDate = new Date('0000');
    var endDate   = new Date('0100');
    var multi = 0;
    initialTime = startDate.getTime();
    leap = 24*3600*1000*365;

    var yearLeap  = function(){
        return initialTime+(leap*multi++);
    };

    beforeEach(function(){
        Date.now =  yearLeap;
    });

    afterEach(function(){
        //restoring Date.now to it's former self :)
        Date.now = nowBuiltinFunction;
    });

    it('check percentage completed', function(){

        var deadLine = new DeadLine({
            deadLineDate : endDate,
            startDate    : startDate
        });

        for (i=0;i<100;i++) {
            expect(deadLine.getPercentageCompleted()).toBe(i);
        }

    });
});
