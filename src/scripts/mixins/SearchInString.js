// var SearchItemInArray = function(items, input) {

//   var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');

//   return items.filter(function(item) {
//     if (item.match(reg)) {
//       return item;
//     }
//   });
// }

var SearchInString = function(search, string) {

  // var reg = new RegExp('"(\\d+) ([^"]*' + search + '[^"]*)"','gi');
  var reg = new RegExp("'(\\d+) ([^'']*" + search + "[^']*)'",'gi');

  var matches = reg.exec(string);

  var id = null;

  if (matches) {
    id = matches[1];
  }

  return id;

};

module.exports = SearchInString;
