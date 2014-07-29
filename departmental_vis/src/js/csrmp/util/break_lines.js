module.exports = function(string) {
  if(string) return '<p>' + string.replace(/\n([ \t]*\n)+/g, '</p><p>')
                 .replace('\n', '<br />') + '</p>';
}
