/// <reference path="../jquery-1.7.2.min.js" />
/// <reference path="../underscore-min.js" />
/// <reference path="../backbone-min.js" />
/// <reference path="Model.js" />
/// <reference path="Collection.js" />
/// <reference path="Templates.js" />
/// <reference path="Events.js" />

var PhotoView = Backbone.View.extend({

    tagName: "figure",

    attributes: {
        class: "photo"
    },

    events: Events.Photo,

    editModel: function (e) {
        e.preventDefault();
        this.render(Templates.EditPhoto());
    },

    cancelSave: function (e) {
        e.preventDefault();
        this.render(Templates.Photo);
    },

    saveUpdate: function (e) {
        e.preventDefault();
        var formData = {};

        this.$el.find("input").each(function () {
            formData[$(this).attr("id")] = $(this).val();
        });
        _.each(formData, function (value, key) {
            if (value !== this.model.get(key)) {
                this.model.set(key, value, { silent: true });
            }
        },
        this);
        this.render(Templates.Photo);
        console.log(formData);
    },

    render: function (template) {
        this.$el.html(_.template(template, {}));
        return this; // return element after rendering to allow chaining when render is called from external sources
    }
});

var NewPhotoView = Backbone.View.extend({
    el: "figure",
    
    attributes: {
        class: "photo"
    },

    render: function (template) {
        this.$el.html(_.template(template, this.model.toJSON() ));
    }

});


var AlbumView = Backbone.View.extend({
    el: $("#album"),

    initialize: function () {
        this.collection = new Album(photos);
        this.setAlbumTitle();
        this.render();
    },

    events: Events.Album,

    createPhoto: function (e) {
        e.preventDefault();

        var addView = new NewPhotoView();

        this.$el.append(addView.render(Templates.EditPhoto).el);
    },

    setAlbumTitle: function () {
        $("#albumName").text(this.collection.at(1).get("album"));
    },
    render: function () {
        _.each(this.collection.models, function (photoModel) {
            var photo = new PhotoView({
                model: photoModel
            });
            this.$el.append(photo.render(Templates.Photo).el);
        }, this);
    }
});

