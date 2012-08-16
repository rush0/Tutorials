/// <reference path="../jquery-1.7.2.min.js" />
/// <reference path="../underscore-min.js" />
/// <reference path="../backbone-min.js" />
/// <reference path="Model.js" />

var Album = Backbone.Collection.extend({
    model: Photo,
    url: "/Photo/"
});
