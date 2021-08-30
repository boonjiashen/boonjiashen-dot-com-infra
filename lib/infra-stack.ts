import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import {Duration} from '@aws-cdk/core';
import { hostname } from 'os';

export interface InfraStackProps {
  /**
   * The top-level domain name that this stack manages.
   * Examples: `example.com`, `boonjiashen.com`.
   *
   * Outside of management by CDK, `blog.{topLevelDomainName}` should be
   * set as the custom domain of {@link githubUsername}, in
   * https://github.com/{githubUsername}/{githubUsername}.github.io/settings/pages
   */
  topLevelDomainName: string;

  /**
   * The username of the [Github Page]{@link https://pages.github.com/} that
   * this stack manages. Assumes that this Github account has a published
   * Github Page.
   * Example: `boonjiashen` (for the {@link boonjiashen.github.io} page
   * controlled by {@link https://github.com/boonjiashen/boonjiashen.github.io}.
   */
  githubUsername: string;
}

export class InfraStack {
  #stack: cdk.Stack;

  constructor(scope: cdk.Construct, id: string, props: InfraStackProps) {
    this.#stack = new cdk.Stack(scope, id, {
      description: `Manages the infrastructure for ${props.topLevelDomainName}`,
      env: {
        // Cannot use an S3 record alias in region-agnostic stack
        region: "ap-northeast-1",
      }
    });

    /**
     * [After cdk-deploy] This zone will include automatically created name servers, which you will need to
     * be provided to the domain registrar, e.g.,
     * {@link https://console.aws.amazon.com/route53/home#DomainDetail:boonjiashen-dev.com}
     */
    const hostedZone = new route53.HostedZone(this.#stack, 'hostedZone', {
      zoneName: props.topLevelDomainName,
      comment: 'Managed by CDK',
    });

    const blogSubdomain = 'blog.' + props.topLevelDomainName;
    const blogGithubDomain = props.githubUsername + '.github.io';
    new route53.CnameRecord(this.#stack, 'blogRecord', {
      zone: hostedZone,
      domainName: blogGithubDomain,
      recordName: blogSubdomain,
      ttl: Duration.seconds(60),
    });

    const tldBucket = new s3.Bucket(this.#stack, 'tldBucket', {
      bucketName: hostedZone.zoneName,
      versioned: true,
      // Redirects http://<topLevelDomainName>.s3-website-<region>.amazonaws.com to <blogSubdomain>
      // See https://aws.amazon.com/premiumsupport/knowledge-center/route-53-redirect-to-another-domain/
      websiteRedirect: {
        hostName: blogSubdomain,
        protocol: s3.RedirectProtocol.HTTPS,
      }
    });

    new route53.ARecord(this.#stack, 'tldToBlogRedirectRecord', {
      zone: hostedZone,
      recordName: hostedZone.zoneName,
      target: route53.RecordTarget.fromAlias(new route53Targets.BucketWebsiteTarget(tldBucket)),
    });
  }
}
