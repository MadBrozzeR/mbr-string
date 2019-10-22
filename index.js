if (mbr === undefined) {
  var mbr = {};
}

(function(){
  mbr.string || (mbr.string = {});

  var SEPARATOR = '\000';
  var DEFAULT_KEY = /\$\{(\w+)\}/g;

  function template(templateString, substitutions) {
    return substitutions instanceof Object
      ? templateString.replace(template.regKey, function (whole, key) {
        return substitutions[key] || '';
      })
      : templateString.replace(template.regKey, substitutions.toString());
  }
  template.regKey = DEFAULT_KEY;
  mbr.string.template = template;

  function cloneRegExp (regExp) {
    return new RegExp(regExp.source, regExp.flags);
  }

  function hashToReadable (hash) {
    return hash.substring(1, hash.length - 1).replace(new RegExp(SEPARATOR, 'g'), ' > ');
  }

  function recursionCheck(map, key, hash) {
    hash || (hash = SEPARATOR);

    if (hash.indexOf(SEPARATOR + key + SEPARATOR) > -1) {
      throw new Error(
        'Circular recursion found\n' +
        'Path: ' + hashToReadable(hash) + '\n' +
        'Recursive key: ' + key + '\n' +
        'Value: ' + map[key]
      );
    }
    var regEx = cloneRegExp(createComplexTemplate.regKey);
    var regMatch;
    hash += key + '\000';

    while (regMatch = regEx.exec(map[key])) {
      recursionCheck(map, regMatch[1], hash);
    }
  }
  function recursiveReplace(value, map) {
    var regExp = cloneRegExp(createComplexTemplate.regKey);

    return value ? value.replace(regExp, function (whole, key) {
      return recursiveReplace(map[key], map);
    }) : '';
  }

  function createComplexTemplate(variables) {
    for (var key in variables) {
      recursionCheck(variables, key);
    }

    return function (template) {
      return recursiveReplace(template, variables);
    };
  }
  createComplexTemplate.regKey = DEFAULT_KEY;
  mbr.string.createComplexTemplate = createComplexTemplate;

  function getPluralIndex (number) {
    var major = ~~(number % 100 / 10);
    var minor = number % 10;

    return (major === 1 || minor === 0 || minor > 4) ? 2 : (minor > 1) ? 1 : 0;
  }
  mbr.string.getPluralIndex = getPluralIndex;
})();

if (typeof exports !== 'undefined') {
  exports.__esModule = true;
  exports.createComplexTemplate = mbr.string.createComplexTemplate;
  exports.template = mbr.string.template;
  exports.getPluralIndex = mbr.string.getPluralIndex;
}
