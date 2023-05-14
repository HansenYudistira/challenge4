'use strict';
const camelCase = require('lodash.camelcase');
const set = require('lodash.set');
const merge = require('lodash.merge');

module.exports = (prefix, envvars) => {
  const getObject = (tokens, value) => {
    const majorTokens = tokens.split('__');
    const topObj = {};
    const path = majorTokens.map((token) => camelCase(token)).join('.');
    set(topObj, path, value);
    return topObj;
  };
  const allFields = envvars !== undefined ? envvars : process.env;
  const outputFields = {};
  Object.keys(allFields).forEach((key) => {
    const tokens = key.split('_');
    if (tokens[0] === prefix.toUpperCase()) {
      merge(outputFields, getObject(key.replace(`${prefix.toUpperCase()}_`, ''), allFields[key]));
    }
  });
  return outputFields;
};
