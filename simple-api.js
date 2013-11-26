var express = require('express');
var validate = require('jsonschema').validate;

var app = express();
app.use(express.static('src/main/resources'));
app.use(express.bodyParser());

var dudes = [
    {
        id: 1,
        name: 'Adam Parrish',
        home: 'Brooklyn'
    },
    {
        id: 2,
        name: 'Trevor Ewen',
        home: 'Queens'
    },
    {
        id: 3,
        name: 'Chris Caplinger',
        home: 'Brooklyn'
    },
];

app.post('/api/validate', function (req, res) {
    var result = validate(req.body.response, req.body.schema)
    res.send(result)
});

app.get('/api/dudes', function (req, res) {
    res.send(dudes);
});

app.get('/api/dudes/:id', function (req, res) {
    res.send(dudes.filter(function (val) {
        return req.params.id == val.id 
    })[0]);
});

app.post('/api/dudes', function (req, res) {
    res.send(dudes.concat({
        id: 4,
        name: 'Miley Cyrus',
        home: 'Hell'
    }));
});

app.get('/api/dudes/:id/home', function (req, res) {
    res.send(dudes.filter(function (val) {
        return req.params.id == val.id 
    })
    .map(function (val) {
        return val.home;
    }));
});

app.listen(3000);
console.log('Listening on port 3000...');
