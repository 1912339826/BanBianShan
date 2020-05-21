import Validator from './validator'

const format = function(template, vars) {
  return template.replace(/\$\{([^\{\}]*)\}/g, function(_, name) {
    const value = vars[name.trim()];
    return value == null ? '' : value + '';
  });
};

const toLen = function(source, len) {
  return (Array.prototype.join.call({
    length: len + 1
  }, '0') + source).slice(-len);
};

const formatDate = function(template, date) {
  if (!date) {
    return '';
  }
  template = template.replace(/\$([a-zA-Z])/g, function(_, key) {
    return '${' + key + '}';
  });
  date = new Date(date);
  const DAY = ['日', '一', '二', '三', '四', '五', '六'];
  return format(template, {
    Y: toLen(date.getFullYear(), 4),
    y: toLen(date.getFullYear(), 2),
    M: toLen(date.getMonth() + 1),
    d: toLen(date.getDate()),
    D: DAY[date.getDay()],
    H: toLen(date.getHours(), 2),
    m: toLen(date.getMinutes(), 2),
    s: toLen(date.getSeconds(), 2)
  });
};

export default {
  formatDate,
  Validator
}