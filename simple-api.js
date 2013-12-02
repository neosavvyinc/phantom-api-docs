var express = require('express');
var validate = require('jsonschema').validate;

var app = express();
app.use(express.bodyParser());

app.post('/api/validate', function (req, res) {
    var result = validate(req.body.response, req.body.schema)
    res.send(result)
});

app.listen(3000);

console.log('Listening on port 3000...');
