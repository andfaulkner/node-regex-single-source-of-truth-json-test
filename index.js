var _ = require('lodash');
var colors = require('colors');

var XRegExp = require('xregexp').XRegExp;
_.merge(XRegExp, require('xregexp-lookbehind'));


//################################################################################
//#~~~~~~~~~~~~~~~~~~~~~~ EXAMPLE DATA FOR INPUT INTO PARSER ~~~~~~~~~~~~~~~~~~~~~
//################################################################################
var formData = {
    name: 'case-capture',
    elements: [
        { 
            fieldName: 'Category Level 1'
        }, {
            fieldName: 'Category Level 2',
            type: 'picklist',
            picklistData: 'categories_level2'
        }, {
            fieldName: 'Category Level 3',
            dataDependency: 'categoryLevel1,categoryLevel2'
        }, {
            fieldName: 'Case Type',
            type: 'picklist'   
        }, {
            fieldName: 'Close Reason',
            type: 'picklist'      
        }, {
            fieldName: 'Case Title',
            picklistData: 'case_titles'
        }, {
            fieldName: 'City',
        }, {
            fieldName: 'Country',
            type: 'statictext',
            picklistData: 'countries'
        }, {
            fieldName: 'Phone Location 1',
            dataDependency: ['something']
        }, { 
            fieldName: 'Phone Number 1',
            dataDependency: 'something'
        }, {
            fieldName: 'Case Assignment Section',
            type: 'section',
            elements: [{
                fieldName: 'Assign To',
                field: 'owner',
                type: 'picklist',
                picklist: 'assignTos'
            }, {
                fieldName: 'Is this case ready for closure?',
                type: 'radioHorizontal',
                radios: [{
                    caption: 'yes',
                    value: 'true'
                }, {
                    caption: 'no',
                    value: 'false'
                }]
            }, {
                fieldName: 'Close Reason',
                displayRule: 'caseIsReadyForClosure',
                type: 'picklist',
            }]
        }
    ]
};
//#################################################################################


//################################################################################
//#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ACTUAL MODULE BEGINS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//################################################################################

//VALIDATION STUFF//
var validateType = function validateType(curNode, newField, continueOnFail) {
    var errBorder = '\n' + '------------------------------------------------------'.red.bgBlack.bold + '\n';
    if (newField.type !== 'picklist') {
        try {
            if (curNode.picklistData) {
                throw new Error('picklistData property defined for element of type "' + 
                    newField.type + '" in element "' + curNode.fieldName + 
                    '". picklistData prop may only be defined for picklists.' + errBorder); 
            }
        } catch (e) {
            console.error(errBorder + 'Invalid field type for "picklistData" '.red.bgBlack.bold +
                            ' in field element:: '.red.bgBlack.bold + '\n' +
                            '  ' + curNode.fieldName.white.bgRed.bold.underline + '\n',
                          e.toString().red.bgBlack.bold + '\n');
            if (!continueOnFail) { 
                 console.trace(validateType);
                 process.exit(1);
            }
        }
    } /* else if (newField.type === 'picklist') {
        try {
            if (!curNode.picklistData) {
                throw new Error('picklistData property not defined for element of ' +
                                'type picklist. - in field element: ' + curNode.fieldName + 
                                errBorder);
            }
        } catch (e) {
            console.error(errBorder + 
                          'Lack of picklist data property for field: '.red.bgBlack.bold +
                          curNode.fieldName.white.bgRed.bold.underline + '\n',
                          e.toString().red.bgBlack.bold + '\n');
            if (!continueOnFail) { 
                 console.trace(validateType);
                 process.exit(1);
            } 
        }
    } */
};
///////////////////


/**
 * Contains functions to ease creation of certain output properties from 
 * 'expandable' input properties
 */
var makeOutputTreeProp = (function() {

    //Lists some common pluralization issues in form data
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

    /**
     * Converts field name into value intended for use in property named 'field'
     */
    var field = function field(fieldName){
        return (XRegExp.replaceLb(fieldName, '(?<=[A-Za-z0-9])', /\s./g, function($1) {
                return $1.charAt(1).toUpperCase();
            })).replace(/^(.)/g, function($1) { 
                return $1.toLowerCase(); 
            }).replace(/\?$/g, '');
    };
   
    /**
     * Converts field name into caption - for use in property 'caption'
     */
    var caption = function caption(fieldName) {
        return (fieldName.replace(/\s/g, '_').toLowerCase()
            .replace(/_([0-9][0-9]?)$/, function($1){
                return _.last($1);
            }).replace(/\?$/g, ''));
    };

    /**
     * Converts field name into picklist data - for use in property 'picklistData'
     * @param {Boolean} complexCheck - if true, account for certain common abnormal pluralizations
     */
    var picklistData = function picklistData(fieldName, complexCheck) {
        var captionVal = caption(fieldName); 
        if (!complexCheck) {
            return captionVal + 's';
        }
       
        var pluralCaption = _.reduce(pluralizations, function(result, n, key){
            return (_.endsWith(captionVal, key))
                ? (captionVal.replace(key, this[key]))
                : (result);
        }, '', pluralizations);

        return ((pluralCaption === '')
                ? captionVal + 's'
                : pluralCaption);  
    };

    //EXPORTED FUNCTIONS
    return {
        field: field, 
        caption: caption,
        picklistData: picklistData
    };
}());



/**
  * Return treeNodes of type 'elements' - within case definition
  */
var handleElementsTreeNodes = function handleElementsTreeNodes(curNode, next){
    //handle tree nodes of type 'elements' 
    if (curNode.elements) {
         return {
            name: curNode.name || curNode.fieldName,
            type: curNode.type || 'section',
            caption: makeOutputTreeProp.caption(curNode.name || curNode.fieldName),
            elements: parseTreeNode(curNode.elements)
        };
    } else {
        return next(curNode);
    }
};



/**
 * Parse single node of 'single source of truth' data object
 * Tailored to a specific type of node. TODO Requires generification (?)
 */
var parseTreeNode = function parseTreeNode(curNode) {

    console.log('entered parseTreeNode');
    console.log('curNode.field || curNode.fieldName::: ' + (curNode.field || curNode.fieldName));

    var curOutputTreeNode = {};

    return handleElementsTreeNodes(curNode, function(curElemNode){

        return _.map(curElemNode, function(curNodeInElemNode){ 
                    
            return handleElementsTreeNodes(curNodeInElemNode, function(el){

                var newField = {
                    type: el.type || ((el.picklistData) ? 'picklist' : 'textbox'),
                    comment: (el.comment || el.fieldName),
                    field: (el.field || makeOutputTreeProp.field(el.fieldName)),
                    caption: (el.caption || makeOutputTreeProp.caption(el.fieldName)),
                    name: el.fieldName
                };
            
                validateType(el, newField, true);
            
                switch(newField.type) {
                    case "picklist":
                        newField.picklistData = el.picklistData || newField.caption + 's';
                        break;
                    case "section":
                        break;
                    default:
                        console.error('newField.type is of type: ' + newField.type); 
                }
            
            
                if (!!el.dataDependency) {
                    if (_.isArray(el.dataDependency) === true) {
                        newField.dataDependency = [];
                        el.dataDependency.forEach(function(fieldDepOn) {
                            newField.dataDependency.push(makeOutputTreeProp.field(fieldDepOn));
                        });
                    } else if (_.includes(el.dataDependency, ',')) {
                        newField.dataDependency = el.dataDependency.split(',');
                    } else {
                        newField.dataDependency = el.dataDependency;
                    }
                } 
           
                var finalObj = (_.omit(_.defaults(newField, el), 'fieldName'));
                return finalObj;
           });
       });
   });
};


console.dir(parseTreeNode(formData), { depth: Infinity } );
