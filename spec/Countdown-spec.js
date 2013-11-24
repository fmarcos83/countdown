//require('../bower_components/jasmine-signals/jasmine-signals.js');
//require('../bower_components/js-signals/dist/signals.js');
require('../src/Deadline.js');
require('../src/Countdown.js');

//TODO necesary a refactor to make the tests cleaner
//and now exactly the features

//TODO signals not working learn why maybe it's necesary
//development code :S
signals = {};
signals.Signal = function(){
    var callbacks = [] ;
    return {
        dispatch: function(arg){
            for(var i=0,len=callbacks.length;i<len;i++){
                var target = callbacks[i];
                callbacks[i].call(target, arg);
            }
        },
        add: function(callback){
            callbacks.push(callback);
        },
        remove: function(callback){
            var index = callbacks.indexOf(callback);
            if(index>=0)
                return callbacks.splice(index,1);
        },
        removeAll: function(){
            callbacks=[];
        }
    };
};

describe('configuration required', function(){

    it('should throw exception if not configure object', function(){
        expect(function(){Countdown();}).toThrow(
            {
                name    : 'Error',
                message : 'configuration literal is required'
            }
        );
    });

});

describe('configuration deadLineDate property required', function(){

    it('should throw exception if deadLineDate property not present', function(){
        expect(function(){Countdown({});}).toThrow(
            {
                name    : 'Error',
                message : 'deadLineDate property is required'
            }
        );
    });

});

describe('configuration interval default', function(){

    it('should return default value for deadLineDate', function(){
        var CountdownInstance = new Countdown({
            deadLineDate : new Date(''),
            callback : function(){}
        });
        expect(CountdownInstance.getRepeatInterval()).toBe(10);
    });

});

describe('configuration interval override',function(){

    it('should return countdown overriden interval value', function(){
        var CountdownInstance = new Countdown({
            deadLineDate   : new Date(),
            callback       : function(){},
            repeatInterval : 1000
        });
        expect(CountdownInstance.getRepeatInterval()).toBe(1000);
    });

});

describe('check Countdown calls callback on init', function(){

    var timerCallback;

    beforeEach(function() {
        timerCallback = jasmine.createSpy('timerCallback');
        jasmine.Clock.useMock();
    });

    it('checks callback is called', function(){
        var sut = new Countdown({
            deadLineDate   : new Date('2020'),
            callback       : timerCallback,
            repeatInterval : 1000
        });
        expect(timerCallback).not.toHaveBeenCalled();
        sut.init();
        jasmine.Clock.tick(1001);
        expect(timerCallback.callCount).toEqual(1);
        jasmine.Clock.tick(1001);
        expect(timerCallback.callCount).toEqual(2);
    });

});

describe('check Countdown doesnt calls callback on init if deadLineDate is meeted', function(){

    var timerCallback;

    beforeEach(function() {
        timerCallback = jasmine.createSpy('timerCallback');
        jasmine.Clock.useMock();
    });

    it('checks callback is not called', function(){
        var sut = new Countdown({
            deadLineDate   : new Date(),
            callback       : timerCallback,
            repeatInterval : 1000
        });
        sut.init();
        //TODO: check bette ways to improve this checking
        //with toHaveBeenCalled
        expect(timerCallback).not.toHaveBeenCalled();
        jasmine.Clock.tick(1001);
        expect(timerCallback.callCount).toEqual(0);
    });

});

describe('check interval is clearead on deadLine', function(){

    var timeCallback;

    beforeEach(function(){
        timerCallback = jasmine.createSpy('timerCallback');
        jasmine.Clock.useMock();
    });

    it('checks interval is cleared on deadLine', function(){
        var sut = new Countdown({
            deadLineDate   : new Date(),
            callback       : timerCallback,
            repeatInterval : 1000
        });
        sut.init();
        var intervalId = sut.getIntervalId();
        jasmine.Clock.tick(1001);
        expect(sut.getIntervalId()).toBeUndefined();
        expect(intervalId).not.toBeUndefined();
    });

});

describe('check callback receives a DeadLine object', function(){

    var timerCallback;

    beforeEach(function(){
        timerCallback = jasmine.createSpy('timerCallback');
        jasmine.Clock.useMock();
    });

    it('checks callback receives a DeadLine object', function(){
        var sut = new Countdown({
            deadLineDate   : new Date('2020'),
            callback       : timerCallback,
            repeatInterval : 30
        });
        sut.init();
        jasmine.Clock.tick(2000);
        expect(timerCallback).toHaveBeenCalledWith(sut.getDeadLine());
    });

});

describe('check interval is not longer created on init', function(){

    var timeCallback;
    var nextYear = new Date(Date.now()+365*24*3600*1000);

    beforeEach(function(){
        timerCallback = jasmine.createSpy('timerCallback');
        jasmine.Clock.useMock();
    });

    it('checks interval is not created on succesive init calls', function(){
        var sut = new Countdown({
            deadLineDate   : nextYear,
            callback       : timerCallback,
            repeatInterval : 4
        });
        sut.init();
        var intervalId = sut.getIntervalId();
        jasmine.Clock.tick(3);
        sut.init();
        jasmine.Clock.tick(3);
        expect(intervalId).toBe(sut.getIntervalId());
        sut.init();
        expect(intervalId).toBe(sut.getIntervalId());
    });

    it('checks intervalId differs when stopped', function(){
        var sut = new Countdown({
            deadLineDate   : nextYear,
            callback       : timerCallback,
            repeatInterval : 4
        });
        sut.init();
        var intervalId = sut.getIntervalId();
        jasmine.Clock.tick(3);
        expect(intervalId).toBe(sut.getIntervalId());
        sut.stop();
        sut.init();
        jasmine.Clock.tick(3);
        expect(intervalId).not.toBe(sut.getIntervalId());
    });

});

//signal dispatching testing
describe('signal testing', function(){
    var timeCallback;
    var timerCallbackStopped;
    var nextYear = new Date(Date.now()+365*24*3600*1000);
    var repeatInterval = 1000;
    var tickRepeatInterval = repeatInterval+1;
    var sut = null;

    beforeEach(function(){
        timerCallback = jasmine.createSpy('timerCallback');
        timerCallbackStopped = jasmine.createSpy('timerCallbackStopped');
        jasmine.Clock.useMock();
        sut = new Countdown({
            deadLineDate: nextYear,
            repeatInterval:tickRepeatInterval,
            callback:function(){}
        });
    });

    it('check stopped is dispatched', function(){
        jasmine.Clock.tick(tickRepeatInterval);
        sut.stopped.add(timerCallback);
        var formerNow = Date.now;
        Date.now = function(){ return nextYear.getTime();}
        sut.init();
        jasmine.Clock.tick(tickRepeatInterval);
        expect(timerCallback.callCount).toBe(1);
        Date.now = formerNow;
    });

    it('check updated is dispatched', function(){
        sut.updated.add(timerCallback);
        sut.init();
        jasmine.Clock.tick(tickRepeatInterval);
        expect(timerCallback.callCount).toBe(1);
        jasmine.Clock.tick(tickRepeatInterval);
        expect(timerCallback.callCount).toBe(2);
    });

    it('check updated listeners are not called on stop and stop signal is dispatched', function(){
        sut.updated.add(timerCallback);
        sut.stopped.add(timerCallbackStopped);
        sut.init();
        jasmine.Clock.tick(tickRepeatInterval);
        expect(timerCallback.callCount).toBe(1);
        var formerNow = Date.now;
        Date.now = function(){ return nextYear.getTime();}
        jasmine.Clock.tick(tickRepeatInterval);
        expect(timerCallback.callCount).toBe(1);
        expect(timerCallbackStopped.callCount).toBe(1);
        jasmine.Clock.tick(tickRepeatInterval);
        expect(timerCallback.callCount).toBe(1);
        Date.now = formerNow;
    });

    it('check stopped is not longer dispatched after stop', function(){
        sut.updated.add(timerCallback);
        sut.stopped.add(timerCallbackStopped);
        sut.init();
        var formerNow = Date.now;
        Date.now = function(){ return nextYear.getTime();}
        jasmine.Clock.tick(tickRepeatInterval);
        expect(timerCallbackStopped.callCount).toBe(1);
        jasmine.Clock.tick(tickRepeatInterval);
        expect(timerCallbackStopped.callCount).toBe(1);
        Date.now = formerNow;
    });

});
