* Remove dev domain from search engine crawls
* Add domain verification token for dev domain
* Add ACM record to route53. Why is this needed? Ref: https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html
* Deduplicate the "mosaic." string from bucket and ARecord. Can't do string manipulation of bucket.BucketName because that's a token rather than the actual bucket name
