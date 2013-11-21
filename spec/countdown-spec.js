require('../deadline.js');
require('../countdown.js');

describe('configuration required', function(){

    it('should throw exception if not configure object', function(){
        expect(function(){countDown();}).toThrow(
            {
                name    : 'Error',
                message : 'configuration literal is required'
            }
        );
    });

});

describe('configuration deadLineDate property required', function(){

    it('should throw exception if deadLineDate property not present', function(){
        expect(function(){countDown({});}).toThrow(
            {
                name    : 'Error',
                message : 'deadLineDate property is required'
            }
        );
    });

});

describe('configuration interval default', function(){

    it('should return default value for deadLineDate', function(){
        var countDownInstance = new countDown({
            deadLineDate : new Date(''),
            callback : function(){}
        });
        expect(countDownInstance.getRepeatInterval()).toBe(10);
    });

});

describe('configuration interval override',function(){

    it('should return countdown overriden interval value', function(){
        var countDownInstance = new countDown({
            deadLineDate   : new Date(),
            callback       : function(){},
            repeatInterval : 1000
        });
        expect(countDownInstance.getRepeatInterval()).toBe(1000);
    });

});

describe('check countDown calls callback on init', function(){

    var timerCallback;

    beforeEach(function() {
        timerCallback = jasmine.createSpy('timerCallback');
        jasmine.Clock.useMock();
    });

    it('checks callback is called', function(){
        var sut = new countDown({
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

describe('check countDown doesnt calls callback on init if deadLineDate is meeted', function(){

    var timerCallback;

    beforeEach(function() {
        timerCallback = jasmine.createSpy('timerCallback');
        jasmine.Clock.useMock();
    });

    it('checks callback is not called', function(){
        var sut = new countDown({
            deadLineDate   : new Date(),
            callback       : timerCallback,
            repeatInterval : 1000
        });
        sut.init();
        //TODO: check bette ways to improve this checking
        //with toHaveBeenCalled
        expect(timerCallback).not.toHaveBeenCalled();
        jasmine.Clock.tick(1002);
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
        var sut = new countDown({
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
        var sut = new countDown({
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
        var sut = new countDown({
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
        var sut = new countDown({
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
