# Azure Functions #

## GetHashKey ##

```javascript
var crypto = require('crypto');
module.exports = function (context, req) {
    if (req.body && req.body.userkey) {

        var hmac = crypto.createHmac('sha256', '_Your_SDK_KEY');
        hmac.update(req.body.userkey);
        var hash = hmac.digest('hex');
        
        context.res = {
            body: hash
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a userkey in the request body"
        };
    }
    context.done();
};
```

## UpdateUserFeature ##

```javascript
var request = require('request');

module.exports = function (context, req) {

    var project = req.body.project;
    var env = req.body.env;
    var feature =req.body.feature;
    var userkey = req.body.userkey;
    var active = req.body.active;

    var options = {
    url: "https://app.launchdarkly.com/api/v2/users/default/test/"+userkey+"/flags/"+feature+"",
    headers: {
        'Authorization': 'api-094bc13b-3545-448b-92a2-7dd1967167d3'
    },
    method : 'PUT',
    json:{
        "setting": active
    }
    };

    function callback(error, response, body2) {
    context.res = {
                // status: 200, /* Defaults to 200 */
                body: response.statusCode
            };
    context.done();
    }
    
    if (req.body) {
        request(options, callback);
    }
};

```