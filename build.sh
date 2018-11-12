#!/bin/bash

NAMESPACE="config-compliance-tests"
BUCKET="${NAMESPACE}-bucket-$(date +"%s")"
KEY="${NAMESPACE}-lambda.zip"
REGION="eu-west-1"

aws s3 mb s3://${BUCKET} --region ${REGION} || exit 1

cd src
rm *.zip > /dev/null 2>&1
npm install
zip -r ${KEY} *
aws s3 cp ${KEY} s3://${BUCKET}/${KEY} --region ${REGION}
cd ..

aws cloudformation deploy --region ${REGION} --template-file deploy.json --stack-name "${NAMESPACE}" \
    --capabilities \
        CAPABILITY_NAMED_IAM \
    --parameter-overrides \
        ConfigRuleLambdaBucket="${BUCKET}" \
        ConfigRuleLambdaKey="${KEY}" \
    --tags \
        Platform="Compliance" \
        ServerType="Tags" \
        Environment="test"

aws s3 rb s3://${BUCKET} --force --region ${REGION}
