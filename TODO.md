* Add domain verification token for dev domain
* Deduplicate the "mosaic." string from bucket and ARecord. Can't do string manipulation of bucket.BucketName because that's a token rather than the actual bucket name
* Serve assets over HTTPs. See https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-serve-static-website/