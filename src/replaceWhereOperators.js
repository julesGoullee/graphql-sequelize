const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Replace a key deeply in an object
 * @param obj
 * @param keyMap
 * @returns {Object}
 */
function replaceKeyDeep(obj, keyMap) {
  return Object.keys(obj).reduce((memo, key)=> {

    // determine which key we are going to use
    let targetKey = keyMap[key] ? keyMap[key] : key;

    // assign the new value
    memo[targetKey] = obj[key];

    // recurse if an array
    if (Array.isArray(memo[targetKey])) {
      memo[targetKey].forEach((val, idx) => {
        if (Object.prototype.toString.call(val) === '[object Object]') {
          memo[targetKey][idx] = replaceKeyDeep(val, keyMap);
        }
      });
    } else if (Object.prototype.toString.call(memo[targetKey]) === '[object Object]') {
      // recurse if Object
      memo[targetKey] = replaceKeyDeep(memo[targetKey], keyMap);
    }

    // return the modified object
    return memo;
  }, {});
}

/**
 * Replace the where arguments object and return the sequelize compatible version.
 * @param where arguments object in GraphQL Safe format meaning no leading "$" chars.
 * @returns {Object}
 */
export function replaceWhereOperators(where) {
  return replaceKeyDeep(where, {
    and: Op.and,
    or: Op.or,
    gt: Op.gt,
    gte: Op.gte,
    lt: Op.lt,
    lte: Op.lte,
    eq: Op.eq,
    ne: Op.ne,
    between: Op.between,
    notBetween: Op.notBetween,
    in: Op.in,
    notIn: Op.notIn,
    notLike: Op.notLike,
    iLike: Op.iLike,
    notILike: Op.notILike,
    like: Op.like,
    overlap: Op.overlap,
    contains: Op.contains,
    contained: Op.contained,
    any: Op.any,
    col: Op.col
  });
}
