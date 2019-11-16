import React from 'react';

/**
 * Truncates a string to a maximum length
 * @param {String} str the string to analyze and truncate
 * @param {Number} max the maximum length
 * @returns {String} the original string if shorter than max, or the truncated one
 */
export const truncate = (str, max) => {
  const l = str.length;
  if (l < max) return str;

  return `${str.substring(0, max)}...`;
};


/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
};


export const getChildrenOfType = (children, type) => {
  const childrenArray = React.Children.toArray(children);
  return childrenArray.filter( child => typeof child == 'object' && child.type.displayName.indexOf(type) >= 0 );
};

export const getChildOfType = (children, type) => {
  const arr = getChildrenOfType(children, type);
  return arr.length ? arr[0] : null;
};


/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export const keysEqual = (objA, objB, keys) => {

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keys.length; i++) {
    if (!bHasOwnProperty(keys[i]) || objA[keys[i]] !== objB[keys[i]]) {
      return false;
    }
  }

  return true;
};


/**
 * Retains a set of allowed keys in an object and returns
 * a shallow copy with the allowed properties.
 */
export const filterObject = ( raw, allowed ) => {
  const filtered = Object.keys(raw)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});

  return filtered;
} 



export const hashCode = function( str ) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


export const getSizeOffset = function(size, offset) {
    const sizes = [ 'XS', 'xs', 'sm', 'md', 'lg', 'xl', 'XL' ];
    return sizes[ sizes.indexOf(size) + offset ].toLowerCase();
};


export const typeRegexs = {
  'url': /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
  'email': /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};


/**
 * FontAwesomeIcon component props
 */
export const fontAwesomeIconAllowedProps = [
  'border', 
  'mask', 
  'flip', 
  'listItem', 
  'pull', 
  'pulse',  
  'rotation', 
  'spin', 
  'symbol', 
  'transform', 
];


/**
 * Balloon CSS component props
 */
export const balloonAllowedProps = [
  'data-balloon',
  'data-balloon-pos',
  'data-balloon-length',
];