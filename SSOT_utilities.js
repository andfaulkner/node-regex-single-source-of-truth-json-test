/* global _ */

/***************************************************************************************************
*
*    Utilities to ease creation of config projects - removes some repetition
*
*/

//IMPORT MODULES
var _ = require('lodash');
var colors = require('colors');
var XRegExp = require('xregexp').XRegExp;
_.merge(XRegExp, require('xregexp-lookbehind'));


//Pluralizations for common terms in form data
var pluralizations = {
   'country': 'countries',
   'category': 'categories',
   'person': 'people',
   'city' : 'cities',
   'loss': 'losses',
   'status': 'statuses',
   'summary': 'summaries',
   'facility': 'facilities',
   'address': 'addresses',
   'injury': 'injuries',
   'property': 'properties',
   'currency': 'currencies',
   'witness': 'witnesses',
   'party': 'parties',
   'company': 'companies',
   'datum': 'data',
   'business': 'businesses',
   'quantity': 'quantities',
   'recovery': 'recoveries',
   'ethnicity': 'ethnicities',
   'methodology': 'methodologies',
   'secondary': 'secondaries',
   'primary': 'primaries',
   'entity': 'entities',
   'severity': 'severities',
   'nationality': 'nationalities',
   'box': 'boxes',
   'supply': 'supplies',
   'history': 'histories',
   'activity': 'activities',
   'man': 'men',
   'woman': 'women',
   'child': 'children',
   'foot': 'feet',
   'aircraft': 'aircraft',
   'series': 'series',
   'media': 'media'
};


//**************************************************************************//
//** NAME (PROPERTY) CONVERSION FUNCTIONS
//*********************************//
/***
 * Converts field name into value intended for use in property named 'field'
 * @example 'Close Reason' --> 'closeReason';
 * @example 'Is this case ready for closure?' --> 'isThisCaseReadyForClosure'
 */
var fieldNameToField = function fieldNameToField(fieldName){
    return (XRegExp.replaceLb(fieldName, '(?<=[A-Za-z0-9])', /\s./g, function($1) {
            return $1.charAt(1).toUpperCase();
        })).replace(/^(.)/g, function($1) {
            return $1.toLowerCase();
        }).replace(/\?$/g, '');
};


/***
 * Converts field name into caption - for use in property 'caption'
 * @example 'Close Reason' --> 'close_reason'
 * @example 'Is this case ready for closure?' --> 'is_this_case_ready_for_closure'
 */
var fieldNameToCaption = function fieldNameToCaption(fieldName) {
    return (fieldName.replace(/\s/g, '_')
        .toLowerCase()
        .replace(/_([0-9][0-9]?)$/, function($1){
            return _.last($1);
        }).replace(/\?$/g, ''));
};


/***
* Converts field name into picklist data name - for use in property 'picklistData'. Does checks
* for pluralization rule exceptions, applies proper pluralization accordingly
*
* @param {Boolean} complexCheck - if true, account for certain common abnormal pluralizations
* @example 'Close Reason' --> 'close_reasons'
* @example 'Country' --> 'countries' [pluralization test generated 'countries' from exception rule]
*/
var fieldNameToPicklistDataProp = function fieldNameToPicklistDataProp(fieldName, complexCheck) {
    var captionVal = fieldNameToCaption(fieldName);

    if (!complexCheck) {
        return captionVal + 's';
    }

    var pluralCaption = _.reduce(pluralizations, function(result, n, key){
        return (_.endsWith(captionVal, key))
            ? (captionVal.replace(key, this[key]))
            : (result);
    }, '', pluralizations);

    return ((pluralCaption === '')
            ? ((_.endsWith(captionVal, 'ss'))
                ? captionVal + 'es'
                : captionVal + 's')
            : pluralCaption);
};


//TODO - ACTUALLY TEST THIS ONE
/***
* Turns lightweight picklist options array into heavyweight consumption-ready picklist options obj
*
* @param {Array<String|Object>} picklistArray - array of picklist names (strings) and/or
*            objs w/ 1 key (whose string becomes the picklist name) containing an object
*            with a set of manually defined option fields that are added to the output
*            picklist options object. Provided properties override default properties.
*
* @return {Object} containis each picklist options definition name as a key, with
*            each key's associated values providing the params of the picklist options.
*/
var picklistOptions = function picklistOptions(picklistArray){
    //default vals for picklist option item; used when only picklist name passed; if object
    //passed, def vals merged in to fill 'text' & 'value' fields if not present in given object
    var def = Object.freeze({ text: 'value', value: 'value' });

    return _.reduce(picklistArray, function(result, val, key){
        if (_.isString(val)){
            result[val] = def;
        }
        if (_.isObject(val)){
            var valKey1 = _.keys(val)[0];
            var objIn1stKey = val[valKey1];
            result[valKey1] = _.defaultsDeep(objIn1stKey, def);
        }
        return result;
    },{});
};
//-- END NAME (PROPERTY) CONVERSION FUNCTIONS --
//**************************************************************************//



//**************************************************************************//
//** MAKE PICKLISTS
//*********************************//
/***
* From an array of picklist names, generates picklists obj with default vals assigned to all items
* @param picklists {Array} list of picklist names
* @return {Object} configs w/ default props assigned for all picklists named in param picklists
*/
var _makeBasePicklistObj = function _makeBasePicklistObj(picklists){
    return _.reduce(picklists, function generatePicklistObj(result, val) {
        result[val] = {
            text: 'value',
            value: 'value'
        };
        return result;
    }, {});
}


/***
* Emits a picklist data object, based on an array of picklist names, default values for each,
* and extra (or alternate) values for picklists with special properties
* @param  {Array} picklistNames
* @param  {Object} picklistOverrides
*         @example Example picklistOverrides object:
*            {
*              'templates': { url: '/template', text: 'name', value: 'id' },
*              'groups_2': { parents: ['groups_1'] }
*            }
* @return {Object} picklist options (akin to output of e.g. public/config/options.picklists.js)
*/
var makePicklistConfig = function makePicklistConfig(picklistNames, picklistOverrides){
    var basePicklistObj = _makeBasePicklistObj(picklistNames);
    var picklistObj = _.defaultsDeep(picklistOverrides, basePicklistObj)
    return picklistObj;
};
//-- END MAKE PICKLISTS --
//**************************************************************************//


//**************************************************************************//
//** WRITEABLE FIELDS ARRAYS
//*********************************//
/***
* Extract field values from a form-layout (e.g. case-resolution-form)
* @param  {Object} formSection Object literal returned by a *-form.js module
* @return {Array} all 'field' string properties from the form in a flat array
*/
var _getFieldsInFormFile = function _getFieldsInFormFile(formSection) {
    return _.chain(formSection.elements)
        .map(function grabFields(el){

            //Recurse by one level if current level has 'elements' property - which contains
            //a nested subform that has multiple extractable 'field' properties.
            if (_.has(el, 'elements')){
                return _getFieldsInFormFile(el);
            }

            //TODO cleanup - messay code
            //If 'field' property in current level of form object is a string, return it; If it's an
            //obj, this is a radio button, so grab the 'edit' property of 'field'. Otherwise error.
            if (_.has(el, 'field')) {
                if (_.isString(el.field)) {
                    return el.field;
                } else if (_.has(el, 'field.edit') && _.isString(el.field.edit)) {
                    return el.field.edit;
                }
            }
            return new Error('No usable field value defined for element in: ' + el);
        })
        .flatten()
        .uniq()
        .value();
};


/**
* Make writeable fields list from set of input files that have objects with extractable field data
*
* @param writeableFlds {Array} list of known writeable field names
* @param formDataSrcFiles {Array} list of objects (files) with extractable field config options
*                                 to merge with writeableFlds list
*
* @return {Array} final list of writeable fields for (e.g.) the config/entities/*.entity.js file
*/
var makeWriteableFieldsList = function makeWriteableFieldsList(writeableFlds, formDataSrcFiles) {
    return _.chain(formDataSrcFiles)
        .reduce(function(result, file){
            return result.concat(_getFieldsInFormFile(file));
        }, writeableFlds || [])
        .uniq()
        .value();
}
//-- END WRITEABLE FIELDS ARRAYS --
//**************************************************************************//


//TODO Figure out what to do with this stylistically
/***
* Get the type of a variable, with high granularity
*
* @param msg {ANY} object/data item to get the type of
* @param noDOMType {Boolean} if true, return only generic 'htmldomelement' (no
*                           specific el type) if DOM element detected
*
* @return {String} name of data type. Possible vals:
*           'array', 'null', 'regexp', 'string', 'typedarray', 'error',
*           'htmldomelement', 'nan', 'boolean', 'undefined', 'number',
*           'object'; or a specific DOM element type e.g. 'htmldivelement'
*/
function getType(msg, noDOMType) {
    var type =
        _.isTypedArray(msg)
            ? 'typedarray'
        : _.isArray(msg)
            ? 'array'
        : _.isNull(msg)
            ? 'null'
        : _.isNaN(msg)
            ? 'nan'
        : _.isRegExp(msg)
            ? 'regexp'
        : _.isError(msg)
            ? 'error'
        : _.isElement(msg) //detect DOM element subtype (or generic DOM type if requested)
            ? (!noDOMType && msg.constructor.name)
                ? msg.constructor.name  //specific DOM element type
                : 'htmldomelement'      //generic DOM type
        : typeof msg; //normal typeof works if other checks return false
    return type;
}


/***
* Test if arg is a (sane) type of object: error, object, or DOM element. Excludes arrays & null
*
* @param arg {ANY} variable to test the type of
* @return {Boolean} true if arg is a type of object
*/
function isObjectType(arg){
    return (getType(arg) === 'error' || _.isElement(arg) || getType(arg) === 'object');
}


// @EXPORTS
module.exports = {
    makePicklistConfig: makePicklistConfig,
    makeWriteableFieldsList: makeWriteableFieldsList,
    getType: getType,
    isObjectType: isObjectType
};