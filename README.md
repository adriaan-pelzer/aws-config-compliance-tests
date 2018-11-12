# aws-config-compliance-rules

## contents

* Readme.md - the docs you're reading right now
* build.sh - a shell script to run the deployment
* deploy.json - cloudformation template that builds the config rules and lambdas. The rules and Lambda functions herein are extended by the user over time.
* src/index.js - the lambda function that gets called by all rules
* src/compliance-rules.js - the rules used by the lambda function, each confgured as a named asynchronous function. Each rule calls back the string 'COMLIANT', 'NON_COMPLIANT', or 'NOT_APPLICABLE', depending on its evaluation results. These rules are extended by the user over time.
