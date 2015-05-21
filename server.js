"use strict"

require('babel/register')

var express = require('express')
var Parse = require('parse').Parse

Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")

var app = require('./src/js/server/server.js')

app.use(express.static(__dirname + '/build'))
