var options_picklists = {
    'email_templates': {
        parents: ['languages'],
        url: '/standard_response',
        text: 'name',
        value: 'name'
    },
    'templates': {
        url: '/template',
        text: 'name',
        value: 'id'
    },
    // Picklist Module
    'cancel_reasons': {
        text: 'value',
        value: 'value'
    },
    'case_assignment_statuses': {
        text: 'value',
        value: 'value'
    },
    'case_statuses': {
        text: 'value',
        value: 'value'
    },
    'case_types': {
        text: 'value',
        value: 'value'
    },
    'categories_level1': {
        text: 'value',
        value: 'value'
    },
    'categories_level2': {
        parents: ['categories_level1'],
        text: 'value',
        value: 'value'
    },
    'categories_level3': {
        parents: ['categories_level1', 'categories_level2'],
        text: 'value',
        value: 'value'
    },
    'close_reasons': {
        text: 'value',
        value: 'value'
    },
    'countries': {
        text: 'value',
        value: 'value'
    },
    'currencies': {
        text: 'value',
        value: 'value'
    },
    'decline_reasons': {
        text: 'value',
        value: 'value'
    },
    'escalation_triggers': {
        text: 'value',
        value: 'value'
    },
    'file_kinds': {
        text: 'value',
        value: 'value'
    },
    'file_types': {
        text: 'value',
        value: 'value'
    },
    'languages': {
        text: 'value',
        value: 'value'
    },
    'note_types': {
        text: 'value',
        value: 'value'
    },
    'party_types': {
        text: 'value',
        value: 'value'
    },
    'reassign_reasons': {
        text: 'value',
        value: 'value'
    },
    'reopen_reasons': {
        text: 'value',
        value: 'value'
    },
    'searchable_entity_types': {
        text: 'value',
        value: 'value'
    },
    'states_and_provinces': {
        text: 'value',
        value: 'value'
    },
    'template_file_types': {
        text: 'value',
        value: 'value'
    },
    'todo_types': {
        text: 'value',
        value: 'value'
    }
};



var caseCaptureForm = {
    name: 'case-capture',
    elements: [{
        comment: 'Category Level 1',
        field: 'categoryLevel1',
        caption: 'category_level1',
        type: 'picklist',
        picklistData: 'categories_level1'
    }, {
        comment: 'Category Level 2',
        field: 'categoryLevel2',
        caption: 'category_level2',
        type: 'picklist',
        picklistData: 'categories_level2',
        dataDependency: 'categoryLevel1'
    }, {
        comment: 'Category Level 3',
        field: 'categoryLevel3',
        caption: 'category_level3',
        type: 'picklist',
        picklistData: 'categories_level3',
        dataDependency: 'categoryLevel1,categoryLevel2'
    }, {
        comment: 'Case Type',
        field: 'caseType',
        caption: 'case_type',
        type: 'picklist',
        picklistData: 'case_types'
    }, {
        comment: 'Case Title',
        field: 'caseTitle',
        caption: 'case_title',
        type: 'textbox'
    }, {
        name: 'Case Assignment Section',
        type: 'section',
        caption: 'case_assignment',
        elements: [{
            name: 'Assign To',
            field: 'owner',
            caption: 'assign_to',
            type: 'picklist'
        }, {
            name: 'Is this case ready for closure?',
            caption: 'is_this_case_ready_for_closure',
            field: 'caseReadyForClosure',
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
    }]
};



/***************************************************************************************************
 *
 *       Defines the HTML field components used by the
 *       Case Overview view. This configuration will
 *       provide the front-end with what it needs to generate the form
 *       for this view.
 *
 *       Elements will be displayed on the form in the order
 *       they appear here.
 */

var caseOverviewForm = {
    name: 'case-overview',
    elements: [{
        comment: 'Category Level 1',
        caption: 'category_level1',
        field: 'categoryLevel1',
        type: 'picklist',
        picklistData: 'categories_level1'
    }, {
        comment: 'Category Level 2',
        caption: 'category_level2',
        field: 'categoryLevel2',
        type: 'picklist',
        picklistData: 'categories_level2',
        dataDependency: 'categoryLevel1'
    }, {
        comment: 'Category Level 3',
        caption: 'category_level3',
        field: 'categoryLevel3',
        type: 'picklist',
        dataDependency: 'categoryLevel1,categoryLevel2'
    }, {
        comment: 'Case Type',
        field: 'caseType',
        caption: 'case_type',
        type: 'statictext'
    }, {
        comment: 'Case Title',
        field: 'caseTitle',
        caption: 'case_title',
        type: 'textbox'
    }]
};



var sys_case_entity = {
    entity: {
        base: 'sys',
        name: 'case'
    },
    diff: true,
    'reverse-denormalize': [{
        triggerAttr: [
            'caseStatus',
            'caseType',
            'owner',
            'investigativeTeamMembers',
            'userBlacklist'
        ],
        set: {
            entity: [{
                base: 'sys',
                name: 'party',
                referenceAttr: 'id',
                lookupAttr: 'caseId'
            }, {
                base: 'sys',
                name: 'attachment',
                referenceAttr: 'id',
                lookupAttr: 'caseId'
            }, {
                base: 'sys',
                name: 'note',
                referenceAttr: 'id',
                lookupAttr: 'caseId'
            }, {
                base: 'sys',
                name: 'todo',
                referenceAttr: 'id',
                lookupAttr: 'caseId'
            }, {
                base: 'sys',
                name: 'email',
                referenceAttr: 'id',
                lookupAttr: 'caseId'
            }],
            attr: 'caseData',
            value: function(caseObj) {
                return _.pick(caseObj, [
                    'caseStatus',
                    'caseType',
                    'owner',
                    'investigativeTeamMembers',
                    'userBlacklist'
                ]);
            }
        }
    }],
    denormalize: [{
        referenceAttr: 'owner',
        join: {
            entity: {
                base: 'sys',
                name: 'user'
            },
            set: 'ownerName',
            value: function(user) {
                return user.firstName + ' ' + user.lastName;
            }
        }
    }],
    search: {
        localeSortableFields: [
            'caseStatus'
        ]
    },
    api: {
        writableFields: [
            'id',
            'assignedBy',
            'assignedTo',
            'isActiveRecord',
            'caseSource',
            'categoryLevel1',
            'categoryLevel2',
            'categoryLevel3',
            'caseTitle',
            'caseNumber',
            'closeReason',
            'cancelReason',
            'reopenReason',
            'cancelDate',
            'caseStatus',
            'caseType',
            'parent',
            'owner',
            'investigativeTeamMembers',
            'userBlacklist',
            'assignmentStatus',
            'declineReason',
            'reassignReason'
        ]
    }
};


/**
 * This defines own Parambulator(https://github.com/rjrodger/parambulator) rules to
 * generate error messages.
 *
 * You can find more details about how to define custom rules
 * at: https://github.com/rjrodger/parambulator#rules-1
 */
var entity_rules__ruleset = [{
        entity: 'sys/case',
        rules: {
            dependentRequired$: [{
                when: {
                    caseReadyForClosure: [true, 'true']
                },
                dependents: ['closeReason']
            }],
            dependentNotempty$: [{
                when: {
                    caseReadyForClosure: [true, 'true']
                },
                dependents: ['closeReason']
            }]
        }
    }, {
        entity: 'sys/todo',
        rules: {
            mandatory$: [
                'caseId',
                'todoType',
                'details',
                'responsible'
            ],
            dependentRequired$: [{
                when: {
                    todoType: 'Other'
                },
                dependents: ['other'], // ...then require that these properties are present
                descriptions: ['ToDo Type - Other Description']
            }],
            dependentNotempty$: [{
                when: {
                    todoType: 'Other'
                },
                dependents: ['other'], // ...then require that these properties are not empty
                descriptions: ['ToDo Type - Other Description']
            }, {
                when: {
                    emailReminder: null // emailReminder > 0 || 'truthy'
                },
                dependents: ['due'], // ...then require the due date
                descriptions: ['ToDo Due']
            }],
            dateRange$: [{
                date: 'due',
                minimumDate: {
                    date: 'createdDate'
                }
            }],
            caseId: {
                type$: 'string'
            },
            // dateCompleted: {type$: 'date'},
            details: {
                type$: 'string'
            },
            // due: {type$: 'date'},
            emailReminder: {
                type$: 'integer'
            },
            responsible: {
                type$: 'string'
            },
            todoType: {
                type$: 'string'
            }
        }
    }, {
        entity: 'sys/note',
        rules: {
            mandatory$: [
                'caseId',
                'noteType'
            ],
            caseId: {
                type$: 'string'
            },
            details: {
                type$: 'string'
            },
            noteType: {
                type$: 'string'
            }
        }
    },

    {
        entity: 'sys/comment',
        rules: {
            mandatory$: [
                'details'
            ]
        }
    },

    {
        entity: 'sys/user',
        rules: {
            mandatory$: [
                'firstName',
                'lastName',
                'ssoUser',
                'locale',
                'active',
                'email',
                'nick'
            ],

            dependentRequired$: [{
                when: {
                    action: ['change_password']
                },
                dependents: ['oldPassword', 'pass', 'confirmedPassword'],
                descriptions: ['Old Password', 'New Password', 'Confirmed Password']
            }],

            dependentNotempty$: [{
                when: {
                    action: ['change_password']
                },
                dependents: ['oldPassword', 'pass', 'confirmedPassword'],
                descriptions: ['Old Password', 'New Password', 'Confirmed Password']
            }],

            firstName: {
                type$: 'string'
            },
            lastName: {
                type$: 'string'
            },
            pass: {
                type$: 'string'
            },
            locale: {
                type$: 'string'
            },
            email: {
                type$: 'string'
            },
            email$: ['email'],
            ssoUser: {
                type$: 'boolean'
            },
            active: {
                type$: 'boolean'
            },
            nick: {
                type$: 'string'
            }

        }
    },
    //********************************** PARTY **********************************
    {
        entity: 'sys/party',
        rules: {
            mandatory$: [
                'caseId',
                'partyType'
            ]
        }
    }, {
        entity: 'sys/emailtemplate',
        rules: {
            mandatory$: [
                'name',
                'body'
            ]
        }
    }, {
        entity: 'sys/case_link',
        rules: {
            mandatory$: [
                'caseId',
                'linkedCaseId',
                'reason'
            ]
        }
    }, {
        entity: 'sys/email',
        rules: {
            dependentRequired$: [{
                when: {
                    action: ['user_create', 'user_edit']
                },
                dependents: ['caseId', 'subject', 'body', 'recipients'],
                descriptions: ['Email Content']
            }],
            dependentNotempty$: [{
                when: {
                    action: ['user_create', 'user_edit']
                },
                dependents: ['caseId', 'subject', 'body', 'recipients'],
                descriptions: ['Email Content']
            }]
        }
    }, {
        entity: 'sys/emailTemplate',
        rules: {
            mandatory$: [
                'locale',
                'name',
                'body'
            ]
        }
    }, {
        entity: 'sys/attachment',
        rules: {
            mandatory$: [
                'caseId',
                'kind'
            ],
            dependentRequired$: [{
                when: {
                    kind: ['generated_template']
                },
                dependents: ['templateId'],
                descriptions: ['Template Name']
            }, {
                when: {
                    kind: ['file_upload']
                },
                dependents: ['fileType'],
                descriptions: ['File Type']
            }],
            dependentNotempty$: [{
                when: {
                    kind: ['generated_template']
                },
                dependents: ['templateId'],
                descriptions: ['Template Name']
            }, {
                when: {
                    kind: ['file_upload']
                },
                dependents: ['fileType'],
                descriptions: ['File Type']
            }]
        }
    }, {
        entity: 'sys/searches',
        rules: {
            mandatory$: [
                'searchName'
            ],
            caseId: {
                type$: 'string'
            }
        }
    }, {
        entity: 'sys/document',
        rules: {
            mandatory$: [
                'description',
                'filename'
            ],
            caseId: {
                type$: 'string'
            }
        }
    }, {
        entity: 'sys/template',
        rules: {
            mandatory$: [
                'name',
                'locale',
                'fileType'
            ]
        }
    }, {
        entity: 'sys/holiday_entry',
        rules: {
            mandatory$: [
                'dateFrom',
                'dateTo',
                'name'
            ]
        }
    }
];


/**
 * config_base_v5/data/fields
 */
var sys_case__fields = [{
    "entity": "sys/case",
    "name": "assignedBy",
    "type": "sys/user"
}, {
    "entity": "sys/case",
    "name": "assignedTo",
    "type": "sys/user"
}, {
    "entity": "sys/case",
    "name": "caseNumber",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "caseOpenDate",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "dateClosed",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "closeReason",
    "type": "listItem",
    "list": "close_reasons"
}, {
    "entity": "sys/case",
    "name": "cancelReason",
    "type": "listItem",
    "list": "cancel_reasons"
}, {
    "entity": "sys/case",
    "name": "reopenDate",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "reopenReason",
    "type": "listItem",
    "list": "reopen_reasons"
}, {
    "entity": "sys/case",
    "name": "cancelDate",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "caseStatus",
    "type": "listItem",
    "list": "case_statuses"
}, {
    "entity": "sys/case",
    "name": "caseTitle",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "caseType",
    "type": "listItem",
    "list": "case_types"
}, {
    "entity": "sys/case",
    "name": "parent",
    "type": "sys/case"
}, {
    "entity": "sys/case",
    "name": "city",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "actualLoss",
    "type": "number"
}, {
    "entity": "sys/case",
    "name": "avertedLoss",
    "type": "number"
}, {
    "entity": "sys/case",
    "name": "dateConfirmed",
    "type": "date"
}, {
    "entity": "sys/case",
    "name": "caseSubStatus",
    "type": "listItem",
    "list": "case_sub_statuses"
}, {
    "entity": "sys/case",
    "name": "correctiveActionTaken",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "disposition",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "dispositionSummaryNotes",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "dateDue",
    "type": "date"
}, {
    "entity": "sys/case",
    "name": "owner",
    "type": "sys/user"
}, {
    "entity": "sys/case",
    "name": "resolutionDescription",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "resolutionOutcome",
    "type": "listItem",
    "list": "resolution_outcomes"
}, {
    "entity": "sys/case",
    "name": "reportedBy",
    "type": "sys/user"
}, {
    "entity": "sys/case",
    "name": "investigativeTeamMembers",
    "type": "sys/user[]"
}, {
    "entity": "sys/case",
    "name": "userBlacklist",
    "type": "sys/user[]"
}, {
    "entity": "sys/case",
    "name": "dateAssigned",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "assignmentStatus",
    "type": "listItem",
    "list": "case_assignment_statuses"
}, {
    "entity": "sys/case",
    "name": "declineReason",
    "type": "listItem",
    "list": "decline_reasons"
}, {
    "entity": "sys/case",
    "name": "reassignReason",
    "type": "listItem",
    "list": "reassign_reasons"
}, {
    "entity": "sys/case",
    "name": "dateOwnershipDecision",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "reassignCloneId",
    "type": "sys/case"
}, {
    "entity": "sys/case",
    "name": "caseReadyForClosure",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "dateRecorded",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "ownerName",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "openedByBusinessGroup",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "categoryLevel1",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "categoryLevel2",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "categoryLevel3",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "projectCodeWord",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "incidentDate",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "reportNarrative",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "division",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "didTheIncidentOccurAtACorningFacility",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "facilityCountry",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilityState",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilityCity",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilityBuildingId",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilityLocation",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilityBuildingAddress",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilityLocationCategory",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilityStateCode",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilityRegion",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "facilitySubregion",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "exactLocationWithinTheFacility",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "region",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "subregion",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "country",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "state",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "locationWhereIncidentOccurred",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "restrictedCase",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "privilegedCase",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "tatCase",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "issueInvestigationDetails",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "issueInvestigationSummary",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "workPlanScope",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "anyCctvInAreaOfIncident",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "cameraNumbers",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "timeSpentReviewingVideo",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "natureOfInjury",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "medicalServicesProvider",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "itemVandalized",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "typeOfVandalism",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "nameOfHazourdousMaterial",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "itemDescription",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "serialNumber",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "awarenessTime",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "timeOnScene",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "timeSceneIsStable",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "timeOfNormalcy",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "totalResponseTime",
    "type": "time"
}, {
    "entity": "sys/case",
    "name": "typeOfWeaponBroughtOnProperty",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "unsecuredDoorResultOfTechnicalMalfunction",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "numberOfServiceRequestTicketSubmitted",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "wasSecuritySupportRequested",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "dateTimeItemWasInPosession",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "isMissingItemPropertyOfCorning",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "approxValueOfItem",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "reportsOfMissingItmesInGeneralWorkArea",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "itemsReportedMissingFromGeneralWorkArea",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "propertyDamageResultOfMva",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "didInjuriesOccur",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "originOfConcern",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "relationship",
    "type": ""
}, {
    "entity": "sys/case",
    "name": "substanceUsageConcerns",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "escalatedIntoInvestigation",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "demotedToIncident",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "dispositionDetails",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "daysToClose",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "dateReclosed",
    "type": "datetime"
}, {
    "entity": "sys/case",
    "name": "closeCaseReason",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "estimatedLoss",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "estimatedLossCurrency",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "avertedLossCurrency",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "correctiveActionRemediation",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "rootCauseDetermination",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "isInvestigationReadyForClosure",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "isIncidentReadyForClosure",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "allRelevantWitnessInterviewed",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "relevantRecordsUploadedToCase",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "allEvidenceObtainedAdmittedToCase",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "hasSubjectInterviewBeenCompleted",
    "type": "boolean"
}, {
    "entity": "sys/case",
    "name": "subjectInterviewNotCompletedReason",
    "type": "string"
}, {
    "entity": "sys/case",
    "name": "createdBy",
    "type": "sys/user"
}, {
    "entity": "sys/case",
    "name": "createdDate",
    "type": "datetime"
}];

