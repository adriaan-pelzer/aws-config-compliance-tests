'use strict'

const aws = require ( 'aws-sdk' );
const complianceRules = require ( './compliance-rules.js' );

const runRule = rule => ( { invokingEvent, ruleParameters, resultToken, ...rest }, context, callback ) => {
    const config = new aws.ConfigService ( { region: process.env.REGION } );

    const ruleParametersJson = JSON.parse ( ruleParameters );
    const invokingEventJson = JSON.parse ( invokingEvent );
    const { configurationItem: { resourceId, resourceType }, notificationCreationTime } = invokingEventJson;

    console.log ( resourceId, resourceType );

    return rule ( {
        configurationItem: invokingEventJson.configurationItem,
        ruleParameters: ruleParametersJson
    }, ( error, ComplianceType ) => {
        return error ? callback ( error ) : config.putEvaluations ( {
            ResultToken: resultToken,
            Evaluations: [
                {
                    ComplianceResourceId: resourceId,
                    ComplianceResourceType: resourceType,
                    ComplianceType,
                    OrderingTimestamp: new Date ( notificationCreationTime )
                }
            ],
            TestMode: false
        }, ( error, result ) => error ? callback ( error ) : callback ( null, result ) );
    } );
};

complianceRules.forEach ( rule => module.exports[rule.name] = runRule ( rule.rule ) );
