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
        }
    ]
};



//VALIDATION STUFF//
function validateType(el, newField, continueOnFail){
    if (newField.type !== 'picklist') {
        try {
            if (el.picklistData) {
                throw new Error('picklistData property defined for element of type "' + 
                    newField.type + '" in element "' + el.fieldName + 
                    '". picklistData prop may only be defined for picklists.\n' + 
                    '------------------------------------------------------'.red.bgBlack.bold);
            }
        } catch (e) {
            console.error('------------------------------------------------------'.red.bgBlack.bold + 
                            '\n' + 'Invalid field type for "picklistData" '.red.bgBlack.bold +
                            ' in field element:: '.red.bgBlack.bold + '\n' +
                            '  ' + el.fieldName.white.bgRed.bold.underline + '\n',
                          e.toString().red.bgBlack.bold + '\n');
            if (!continueOnFail) { 
                 console.trace(validateType);
                 process.exit(1);
            }
        }
    } else {
        // TODO set up the reverse of the if condition    
    }
}
///////////////////



var outObj = { 
    name: miniJSON.name,
    elements: []
};

miniJSON.elements.forEach(function(el) {
    function makeFieldName(text){
        return (XRegExp.replaceLb(text, '(?<=[A-Za-z0-9])', /\s./g, function($1) {
            return $1.charAt(1).toUpperCase();
        })).replace(/^(.)/g, function($1) { 
            return $1.toLowerCase(); 
        });
    }

    function makeCaption(text) {
        return (el.fieldName.replace(/\s/g, '_').toLowerCase()
                    .replace(/_([0-9][0-9]?)$/, function($1){
                        return _.last($1);
                    }));
    }

    var newField = {
        comment: (el.comment || el.fieldName),
        field: (el.field || makeFieldName(el.fieldName)),
        caption: (el.caption || makeCaption(el.fieldName)), 
        type: el.type || ((el.picklistData) ? 'picklist' : 'textbox')
    };

    validateType(el, newField, true);

    if (newField.type === 'picklist') {
       newField.picklistData = el.picklistData || newField.caption + 's'; 
    }

    if (!!el.dataDependency) {
        if (_.isArray(el.dataDependency) === true) {
            newField.dataDependency = [];
            el['dataDependency'].forEach(function(fieldDepOn) {
                newField['dataDependency'].push(makeFieldName(fieldDepOn));
            });
        } else if (_.includes(el.dataDependency, ',')) {
            newField['dataDependency'] = el.dataDependency.split(',');
        } else {
            newField['dataDependency'] = el.dataDependency;
        }
    } 

    outObj.elements.push(newField);
});

console.dir(outObj, { depth: Infinity } );
