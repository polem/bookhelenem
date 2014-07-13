'use strict';

var prismic = require('prismic.io').Prismic;
var yaml = require('js-yaml');

var fs = require('fs');

var generateWorkFile = function(datas, slug) {

  var frontMatter = datas;
  frontMatter.category = 'work';
  frontMatter.layout   = 'work';

  var date = '2011-12-31';

  var content = "";
  content += "---\n"
  content += yaml.safeDump(frontMatter);
  content += "---\n";
  content += "# " + datas.title;

  fs.writeFile("_posts/work/" + date + '-' + slug + ".md", content, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  }); 
}

prismic.Api('https://book-helenem.prismic.io/api', function(error, api) {
  if (error) { console.log(error); return; }
  var predicat = "[[:d = at(document.type, \"work\")]]";

  api
    .form('everything')
    .ref(api.master())
    .query(predicat)
    .submit(function(error, data) {
      data.results.forEach(function(item) {

        var work = {
          'title'  : item.fragments['work.name'].value[0]['text'],
          'client' : item.fragments['work.client'].value[0]['text']
        };

        work.gallery = [];

        if(typeof item.fragments['work.gallery'] !== 'undefined') {
          item.fragments['work.gallery'].value.forEach(function(data) {

            var image = {
              'icon'   : data.image.value.views.icon.url,
              'wide'   : data.image.value.views.wide.url,
              'column' : data.image.value.views.column.url
            }
            work.gallery.push(image);
          });
        }

        if(typeof item.fragments['work.image'] !== 'undefined') {
          work.image = {
            'icon'   : item.fragments['work.image'].value.views.icon.url,
            'wide'   : item.fragments['work.image'].value.views.wide.url,
            'column' : item.fragments['work.image'].value.views.column.url
          }
        }

        generateWorkFile(work, item.slug);

      });
    });
},
null,
null
);


