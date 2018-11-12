module.exports = [
    {
        name: 'testTags',
        rule: ( { configurationItem, ruleParameters }, callback ) => callback ( null, typeof configurationItem.tags === 'object' ?
            ruleParameters.TagSpecs.reduce ( ( ComplianceType, TagSpec ) => ComplianceType === 'NON_COMPLIANT' ?
                'NON_COMPLIANT' :
                (
                    typeof configurationItem.tags[TagSpec.TagKey] === 'string' ?
                    ( configurationItem.tags[TagSpec.TagKey].match ( new RegExp ( TagSpec.TagRegEx ) ) ?  'COMPLIANT' : 'NON_COMPLIANT' ) :
                    ( TagSpec.Required ?  'NON_COMPLIANT' : 'COMPLIANT' )
                ), 'COMPLIANT' ) :
            'NOT_APPLICABLE'
        )
    }
];


