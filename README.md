# aws-config-compliance-rules

## contents

* **Readme.md** - the docs you're reading right now
* **build.sh** - a shell script to run the deployment
* **deploy.json** - cloudformation template that builds the config rules and lambdas. The rules and Lambda functions herein are extended by the user over time.
* **src/index.js** - the base function (a lambda function) that gets called by all rules
* **src/compliance-rules.js** - the rules used by the base function, each configured as a named asynchronous function. These rules are extended by the user over time.

## Adding a new rule:

### Create the rule function

In _src/compliance-rules.js_, create a new object in the array, with an export name, and a function that accepts two attributes in the object passed as its first argument: _configurationItem_ and _ruleParameters_.

* **configurationItem** - this reflects the state of the resource.
* **ruleParameters** - this is set by you in the cloudFormation template, and gives you a certain degree of flexibility over the evaluation of your rule. Strictly speaking, a rule should check a specific attribute or state in the resource against constraints passed in the ruleParameters, so that constraints can be changed without redefining the function.

Your rule should call back one of the following strings:

* **COMPLIANT**
* **NON_COMPLIANT**
* **NOT_APPLICABLE**

or an error, depending on its evaluation results.

### Create the rule and lambda function

In _deploy.json_, a set of resources of types _AWS::Lambda::Function_, _AWS::Config::ConfigRule_ and _AWS::Lambda::Permission_ should be created for your new rule. (copy these from another rule, and give them unique logical ID's).
The following lines need to be changed:

* **Lambda Function**
    - Change the _FunctionName_ parameter to a descriptive name derived from your test name.
    - Change the _Handler_ parameter to index._rule.name_ (where _rule.name_ is whatever you named your rule in _src/compliance-rules.js_)
* **Config Rule**
    - Change the _ConfigRuleName_ parameter to a descriptive name derived from your test name.
    - Change the _Scope.ComplianceResourceTypes_ parameter to reflect the list of resource types you want your rule to be run against. Delete the _Scope_ parameter altogether to run it against all resource types.
