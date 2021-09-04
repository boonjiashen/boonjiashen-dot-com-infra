#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'monocdk';
import {InfraStack} from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'infraStackBeta', {
  topLevelDomainName: 'boonjiashen-dev.com',
  githubUsername: 'boonjiashen2',
});
