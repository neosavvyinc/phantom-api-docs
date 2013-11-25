var express = require('express');
var app = express();
app.use(express.static('src/main/resources'));

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

app.get('/api/dudes', function (req, res) {
    res.send(dudes);
});

app.get('/api/dudes/:id', function (req, res) {
    res.send(dudes.filter(function (val) {
        return req.params.id == val.id 
    })[0]);
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
