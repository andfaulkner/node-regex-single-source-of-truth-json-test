var domain = require('domain');
var _ = require('lodash');
var XRegExp = require('xregexp').XRegExp;
var colors = require('colors');

_.merge(XRegExp, require('xregexp-lookbehind'));

// console.log(XRegExp.matchAllLb("Catwoman's cats are fluffy cats", '(?i)(?<!fluffy\\W+)', /cat\w*/i));




var miniJSON = {
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
                type: 'picklist'
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
                name: 'Close Reason',
                field: 'closeReason',
                caption: 'close_reason',
                displayRule: 'caseIsReadyForClosure',
                type: 'picklist',
                picklistData: 'close_reasons'
            }]
        }
    ]
};



//VALIDATION STUFF//
var validateType = function validateType(curNode, newField, continueOnFail){
    if (newField.type !== 'picklist') {
        try {
            if (curNode.picklistData) {
                throw new Error('picklistData property defined for element of type "' + 
                    newField.type + '" in element "' + curNode.fieldName + 
                    '". picklistData prop may only be defined for picklists.\n' + 
                    '------------------------------------------------------'.red.bgBlack.bold);
            }
        } catch (e) {
            console.error('------------------------------------------------------'.red.bgBlack.bold + 
                            '\n' + 'Invalid field type for "picklistData" '.red.bgBlack.bold +
                            ' in field element:: '.red.bgBlack.bold + '\n' +
                            '  ' + curNode.fieldName.white.bgRed.bold.underline + '\n',
                          e.toString().red.bgBlack.bold + '\n');
            if (!continueOnFail) { 
                 console.trace(validateType);
                 process.exit(1);
            }
        }
    } else {
        // TODO set up the reverse of the if condition    
    }
};
///////////////////


/**
 * Contains functions to ease creation of certain output properties from 
 * 'expandable' input properties
 */
var makeOutputTreeProp = {
    
    field: function field(text){
        console.log('makeOutputTreeProp.field:: ' + text);
        return (XRegExp.replaceLb(text, '(?<=[A-Za-z0-9])', /\s./g, function($1) {
                return $1.charAt(1).toUpperCase();
            })).replace(/^(.)/g, function($1) { 
                return $1.toLowerCase(); 
            }).replace(/\?$/g, '');
    },
    
    caption: function makeCaption(text) {
        return (text.replace(/\s/g, '_').toLowerCase()
            .replace(/_([0-9][0-9]?)$/, function($1){
                return _.last($1);
            }).replace(/\?$/g, ''));
    }
};


var handleElementsTreeNodes = function handleElementsTreeNodes(curNode, next){
    //handle tree nodes of type 'elements' 
    if (curNode.elements) {
        console.log('curNode has elements!');
        console.log('curNode.name::: ' + curNode.name);
        console.log('________ RECURSE RETURNING...____________');
         return {
            name: curNode.name || curNode.fieldName,
            type: curNode.type || 'section',
            caption: makeOutputTreeProp.caption(curNode.name || curNode.fieldName),
            elements: parseTreeNode(curNode.elements)
        };
    } else {
        return next(curNode);
    }

//var outObj = [];
};





/**
 * parse single node of 'single source of truth' data object
 */
var parseTreeNode = function parseTreeNode(curNode) {

    console.log('entered parseTreeNode');
    console.log('curNode.field || curNode.fieldName::: ' + (curNode.field || curNode.fieldName));

    var curOutputTreeNode = {};

    return handleElementsTreeNodes(curNode, function(curElemNode){

        return _.map(curElemNode, function(curNodeInElemNode){ 
                    
            return handleElementsTreeNodes(curNodeInElemNode, function(el){

                console.log('********************************* ENTERED forOwn loop **********************************');
                console.log('another spin of forOwn!');
                console.log('el.field || el.fieldName::: ' + (el.field || el.fieldName));
                console.log('el?');
                console.dir(el, { depth: 20 });
        
                var newField = {
                    type: el.type || ((el.picklistData) ? 'picklist' : 'textbox'),
                    comment: (el.comment ||el.fieldName),
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
                            console.log("in isArray for el");
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
                console.log(finalObj);
                console.log('END OF PARSE FN');
                return finalObj;
           });
       });
   });

};

console.dir(parseTreeNode(miniJSON), { depth: Infinity } );
