#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'monocdk';
import {InfraStack} from '../lib/infra-stack';

const app = new cdk.App();

const commonProps: cdk.StackProps = {
  env: {
    // Cannot use an S3 record alias in region-agnostic stack
    // Using us-east-1 so we can manage ACM certificates used by CloudFront
    // See https://docs.aws.amazon.com/acm/latest/userguide/acm-regions.html
    region: 'us-east-1',
  },
}

new InfraStack(app, 'beta', {
  stackName: 'betaDomainInfraStack',
  domainName: 'dev.boonjiashen.com',
  githubUsername: 'boonjiashen2',
  ...commonProps,
});

new InfraStack(app, 'prod', {
  stackName: 'prodDomainInfraStack',
  domainName: 'boonjiashen.com',
  githubUsername: 'boonjiashen',
  domainVerificationToken:
    'google-site-verification=vdXn5ouve-i3MgKncs1Q2I_t_T1IUrkVtLojnNuBpV8',
  // Taken first from the deployment of the beta stack
  devNameServers: [
    'ns-227.awsdns-28.com',
    'ns-1245.awsdns-27.org',
    'ns-843.awsdns-41.net',
    'ns-1760.awsdns-28.co.uk',
  ],
  ...commonProps,
});
