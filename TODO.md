* Remove dev domain from search engine crawls
* Add domain verification token for dev domain
* Deduplicate the "mosaic." string from bucket and ARecord. Can't do string manipulation of bucket.BucketName because that's a token rather than the actual bucket name
* Refactor devo endpoint to within boonjiashen.com so that I don't need to pay for two domains
