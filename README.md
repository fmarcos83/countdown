# JS-COUNTDOWN

A library for easy countdown management

## Examples

#### Instantiating

```javascript
    //countdown to 5 seconds in the future
    //will output the deadline object
    var countdown = new Coundown({
        deadLineDate : new Date(Date.now()+5000)
        callback: function(deadLineDate){console.log(deadLineDate);}
        [startDate : new Date(Date.now()+4000)],
        [repeatInterval : 1000]
    });
```

#### Init Countdown

```javascript
    //init countdown will
    countdown.init();
```

#### Signal Listener Addition

```javascript
    //init countdown will
    countdown.updated.add(function(){});
    countdown.stopped.add(function(){});
```

## License

[MIT](http://opensource.org/licenes/mit-license.php)

## Dependencies

> js-signals is the defacto signal library for this component
> nevertheless the plan is to create a wrapper so
> anyone can inject it's custom signal library

[js-signals](https://github.com/millermedeiros/js-signals)

## Installing

### Bower

```bash
bower install js-countdown
```

## Build

> to build the release the next tools are needed

### Requirements

    -[jasmine-node](https://github.com/mhevery/jasmine-node)
    -[ant](http://ant.apache.org)

### Tests

```bash
ant test
```
