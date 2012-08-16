/// <reference path="../underscore-min.js" />
/// <reference path="../backbone-min.js" />

var Photo = Backbone.Model.extend({
    defaults: {
        name: "",
        filename: "blank.jpg",
        caption: "",
        photographer: "",
        license: "",
        album: ""
    }
});
