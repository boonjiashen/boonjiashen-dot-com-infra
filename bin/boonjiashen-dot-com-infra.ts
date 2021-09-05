#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'monocdk';
import {InfraStack} from '../lib/infra-stack';

const app = new cdk.App();

new InfraStack(app, 'infraStackBeta', {
  topLevelDomainName: 'boonjiashen-dev.com',
  githubUsername: 'boonjiashen2',
});

new InfraStack(app, 'infraStackProd', {
  topLevelDomainName: 'boonjiashen.com',
  githubUsername: 'boonjiashen',
  domainVerificationToken: "google-site-verification=vdXn5ouve-i3MgKncs1Q2I_t_T1IUrkVtLojnNuBpV8",
});
