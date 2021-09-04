import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';
import * as s3deploy from 'monocdk/aws-s3-deployment';
import * as route53 from 'monocdk/aws-route53';
import * as route53Targets from 'monocdk/aws-route53-targets';
import * as acm from 'monocdk/aws-certificatemanager';

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

  /**
   * Used by Google's Webmaster central to verify that you own this domain.
   * The token is a 68-character string that begins with google-site-verification=, followed by 43 additional characters.
   * See also:
   * https://www.google.com/webmasters/verification/details?hl=en-GB&domain=boonjiashen.com
   * https://support.google.com/a/answer/2716802?hl=en
   *
   * Default: no token
   */
  domainVerificationToken?: string;
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
      ttl: cdk.Duration.seconds(60),
    });

    const tldBucket = new s3.Bucket(this.#stack, 'tldBucket', {
      bucketName: hostedZone.zoneName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      publicReadAccess: true,
      // Redirects http://<topLevelDomainName>.s3-website-<region>.amazonaws.com to <blogSubdomain>
      // See https://aws.amazon.com/premiumsupport/knowledge-center/route-53-redirect-to-another-domain/
      websiteRedirect: {
        hostName: blogSubdomain,
        protocol: s3.RedirectProtocol.HTTPS,
      }
    });

    new s3deploy.BucketDeployment(this.#stack, "deployTldBucketAssets", {
      sources: [s3deploy.Source.asset("./assets/tld")],
      destinationBucket: tldBucket,
      retainOnDelete: false,
    });

    new route53.ARecord(this.#stack, 'tldToBlogRedirectRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new route53Targets.BucketWebsiteTarget(tldBucket)),
    });

    new route53.TxtRecord(this.#stack, 'ownershipVerificationRecord', {
      zone: hostedZone,
      values: props.domainVerificationToken ? [props.domainVerificationToken] : ["domain-verification-token-placeholder"],
    });

    // To allow visitors to connect to Elastic Beanstalk via HTTPS
    // See https://aws.amazon.com/premiumsupport/knowledge-center/elastic-beanstalk-https-configuration/
    new acm.Certificate(this.#stack, 'domainCertificate', {
      domainName: "*." + hostedZone.zoneName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const mosaicBucket = new s3.Bucket(this.#stack, "mosaicBucket", {
      bucketName: "mosaic." + hostedZone.zoneName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      publicReadAccess: true,
      // Also enables static website hosting
      websiteIndexDocument: "index.html",
    });

    new s3deploy.BucketDeployment(this.#stack, 'deployMosaicSite', {
      sources: [s3deploy.Source.asset("./assets/mosaic")],
      destinationBucket: mosaicBucket,
      retainOnDelete: false,
    });

    new route53.ARecord(this.#stack, 'mosaicRedirectRecord', {
      zone: hostedZone,
      recordName: "mosaic",
      target: route53.RecordTarget.fromAlias(new route53Targets.BucketWebsiteTarget(mosaicBucket)),
    });
  }
}
