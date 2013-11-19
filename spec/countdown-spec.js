require('../countdown.js');

describe('configuration required', function(){
    it('should throw exception if not configure object', function(){
        expect(function(){countDown();}).toThrow(
            {
                name: 'Error',
                message: 'configuration literal is required'
            }
        );
    });
});

describe('configuration deadLine property required', function(){
    it('should throw exception if deadLine property not present', function(){
        expect(function(){countDown({});}).toThrow(
            {
                name: 'Error',
                message: 'deadLine property is required'
            }
        );
    });
});

describe('configuration interval default', function(){
    it('should return default value for deadLine', function(){
        var countDownInstance = new countDown({deadLine:''});
        expect(countDownInstance.getInterval()).toBe(countDown.interval);
    });
});

describe('configuration interval override',function(){
    it('should return countdown overriden interval value', function(){
        var countDownInstance = new countDown({deadLine:'',interval:1000});
        expect(countDownInstance.getInterval()).toBe(1000);
    });
});

describe
