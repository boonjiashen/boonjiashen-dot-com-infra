# About

[CDK](https://docs.aws.amazon.com/cdk) package to manage the infrastructure of [boonjiashen.com](http://boonjiashen.com/)

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

# Fix formatting

Run `npm run lint` to run linter

Run `npm run fix` to fix formatting/linting problems, if possible.


# Deploy

The production stack manages [boonjiashen.com](http://boonjiashen.com/) while the beta (development) stack manages [dev.boonjiashen.com](http://dev.boonjiashen.com/). The beta stack is meant for development before pushing changes to production, and isn't meant to serve production traffic.

```bash
# To deploy the beta stack (dev.boonjiashen.com)
cdk deploy beta
```

```bash
# To deploy the prod stack (boonjiashen.com)
cdk deploy prod
```

```bash
# To deploy all stacks
cdk deploy --all
```
