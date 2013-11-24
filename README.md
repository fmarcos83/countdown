# js-countdown

A library for easy countdown management

## how to use

```javascript
    //countdown to 5 seconds in the future
    //will output the deadline object
    var countdown = new Coundown({
        deadLineDate : new Date(Date.now()+5000)
        callback: function(deadLineDate){console.log(deadLineDate);}
    });
```

## installing

### bower

```bash
bower install js-countdown
```
