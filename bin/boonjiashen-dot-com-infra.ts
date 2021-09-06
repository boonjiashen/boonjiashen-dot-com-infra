#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'monocdk';
import {InfraStack} from '../lib/infra-stack';

const app = new cdk.App();

new InfraStack(app, 'infraStackBeta', {
  domainName: 'dev.boonjiashen.com',
  githubUsername: 'boonjiashen2',
});

new InfraStack(app, 'infraStackProd', {
  domainName: 'boonjiashen.com',
  githubUsername: 'boonjiashen',
  domainVerificationToken: "google-site-verification=vdXn5ouve-i3MgKncs1Q2I_t_T1IUrkVtLojnNuBpV8",
  // Taken first from the deployment of the beta stack
  devNameServers: [
    "ns-1969.awsdns-54.co.uk",
    "ns-1479.awsdns-56.org",
    "ns-259.awsdns-32.com",
    "ns-784.awsdns-34.net",
  ],
});
