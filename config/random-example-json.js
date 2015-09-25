module.exports = {
    name: 'random-example-json',
    elements: [{
        comment: 'Grouping Level 1',
        field: 'groupingLevel1',
        caption: 'grouping_level1',
        type: 'picklist',
        picklistData: 'groupings_level1'
    }, {
        comment: 'Grouping Level 2',
        field: 'groupingLevel2',
        caption: 'grouping_level2',
        type: 'picklist',
        picklistData: 'groupings_level2',
        dataDependency: 'groupingLevel1'
    }, {
        comment: 'Grouping Level 3',
        field: 'groupingLevel3',
        caption: 'grouping_level3',
        type: 'picklist',
        picklistData: 'groupings_level3',
        dataDependency: 'groupingLevel1,categoryLevel2'
    }, {
        comment: 'Incident Type',
        field: 'incidentType',
        caption: 'incident_type',
        type: 'picklist',
        picklistData: 'incident_types'
    }, {
        comment: 'Incident Name',
        field: 'incidentName',
        caption: 'incident_name',
        type: 'textbox'
    }, {
        name: 'Incident Assignment Section',
        type: 'section',
        caption: 'incident_assignment',
        elements: [{
            name: 'Assign To',
            field: 'owner',
            caption: 'assign_to',
            type: 'picklist'
        }, {
            name: 'Is this incident ready for closing?',
            caption: 'is_this_incident_ready_for_closing',
            field: 'incidentReadyForClosing',
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
            displayRule: 'incidentIsReadyForClosing',
            type: 'picklist',
            picklistData: 'close_reasons'
        }]
    }]
};
