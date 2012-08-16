var Templates = {
    Photo:      '<img src="/img/<%- filename %>" alt="<%- name %>" />'
                +'<figcaption> <%= caption %> </figcaption>'
                +'<footer>'
                +'<small>Photo taken by <%= photographer %> <a class="license" href="#" title="<%- license %>">License Information </a></small>'
                + '<a href="#" id="edit"   title="Edit this photo">Edit</a>'
                + '</footer>',

    EditPhoto: function () {
            var editTemplate = this.inputFor(["name", "filename", "caption", "photographer", "license"]);
            editTemplate += '<footer>';
            editTemplate += '<button id="save">Save</button>';
            editTemplate += '<a href="#" id="cancel" title="Cancel">Cancel</a>';
            editTemplate += '</footer>';

            return editTemplate;
        },
    
    inputFor: function (field) {
        var template = "";
        if ( field.push ) {
            for (var i = 0; i < field.length; i++) {
                template += this.inputFor(field[i]);
            }
        }
        else {
            return '<input id=' + field + ' value="<%- ' + field + ' %>" />';
        }
        return template;
    }
};