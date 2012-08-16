$(function () {

    var compiled = dust.compile($("#dustPhotoTemplate").html(), "photo");
    var editCompiled = dust.compile($("#editTemplate").html(), "editPhoto");

    dust.loadSource(compiled);

    var Photo = Backbone.Model.extend({
        defaults: {
            name: "",
            filename: "blank.png",
            caption: "",
            photographer: "",
            license: "",
            album: ""
        },
        validate: function (attrs) {
            var error = null;
            _.each(attrs, function (val) {
                if (val === "") error = "Please complete all fields";
            });

            if (error) return error;
        }
    });

    var Album = Backbone.Collection.extend({
        model: Photo,
        url: "/Photo/",
        initialize: function () {
            this.on("change", function (model) {
                if (!_.isEqual(model.previousAttributes(), model.attributes)) {
                    this.url = "/Photo/Edit/";
                    model.save(model.changedAttributes());
                }
            });
        }
    });

    var PhotoView = Backbone.View.extend({
        tagName: "figure",
        attributes: {
            class: "photo"
        },
        initialize: function () {
            this.model.on("error", function (model, err) {
                console.log(err);
                this.render("editPhoto")
            }, this);
        },
        render: function (template) {
            var view = this;
            dust.render(template, this.model.toJSON(), function (err, out) {
                view.$el.html(out);
            });

            return this;
        },
        events: {
            "click #edit": "editModel",
            "click #cancel": "cancelSave",
            "click #save": "saveUpdate",
            "click #delete": "deleteModel"
        },
        editModel: function (e) {
            e.preventDefault();

            if (!dust.cache.editPhoto) {
                dust.loadSource(editCompiled);
            }

            this.render("editPhoto");
        },
        cancelSave: function (e) {
            e.preventDefault();

            this.render("photo");
        },
        saveUpdate: function () {
            var formData = {};
            this.$el.find("input").each(function () {
                $input = $(this);
                formData[$input.attr("id")] = $input.val();
            });

            _.each(formData, function (value, key) {
                if (value !== this.model.get(key)) {
                    this.model.set(key, value, { silent: true });
                }
            }, this);

            this.render("photo");

            if (this.model.changedAttributes() != false) {
                this.model.change();
            }
        },
        deleteModel: function (e) {
            e.preventDefault();

            bikes.collection.url = "/Photo/Delete";

            this.remove();

            this.model.destroy();
        }
    });

    var AddView = Backbone.View.extend({
        tagName: "figure",
        attributes: {
            class: "photo",
            id: "add"
        },
        render: function () {
            var view = this;
            dust.render("editPhoto", {}, function (err, out) {
                view.$el.html(out);
            });

            return this;
        },
        events: {
            "click #cancel": "cancelAdd",
            "click #save": "addPhoto"
        },
        cancelAdd: function (e) {
            e.preventDefault();

            this.remove();
        },
        addPhoto: function () {
            var formData = {};
            this.$el.find("input").each(function () {
                $input = $(this);
                formData[$input.attr("id")] = $input.val();
            });

            var newModel = new Photo(formData);
            newModel.set("album", bikes.collection.at(0).get("album"), { silent: true });

            bikes.collection.create(newModel, { wait: true });

            this.remove();

            var photo = new PhotoView({
                model: newModel
            });

            bikes.$el.append(photo.render("photo").el);
        }
    });

    var AlbumView = Backbone.View.extend({
        el: $("#album"),
        initialize: function () {
            this.collection = new Album(photos);
            this.render("Bikes");

            _.each(_.uniq(this.collection.pluck("album")), function (album) {
                $("<option />", {
                    text: album,
                    value: album
                }).appendTo("#albums");
            });

            this.appRouter = new PhotoRouter();

            Backbone.history.start({ pushState: true });
        },
        render: function (album) {
            modelsToRender = _.filter(this.collection.models, function (item) {
                return item.get("album") === album;
            });

            _.each(modelsToRender, function (photoModel) {
                var photo = new PhotoView({
                    model: photoModel
                });

                this.$el.append(photo.render("photo").el);
            }, this);
        },
        events: {
            "click #addPhoto": "createPhoto",
            "change #albums": "changeAlbum"
        },
        createPhoto: function (e) {
            e.preventDefault();

            if (!dust.cache.editPhoto) {
                dust.loadSource(editCompiled);
            }

            var newView = new AddView();

            this.$el.append(newView.render("editPhoto").el);

            this.appRouter.navigate("Photo/Create");
        },
        changeAlbum: function (e) {
            this.$el.find("figure").remove();

            this.render(e.target.value);
        }
    });

    var PhotoRouter = Backbone.Router.extend({
        routes: {
            "": "defaultState",
            "Photo/Create": "addModel"
        },
        defaultState: function () {
            if ($("#add").length) {
                $("#add").remove();
            }
        },
        addModel: function () {
            if (!dust.cache.editPhoto) {
                dust.loadSource(editCompiled);
            }

            var newView = new AddView();

            $("#album").append(newView.render("editPhoto").el);
        }
    });

    var bikes = new AlbumView();

});