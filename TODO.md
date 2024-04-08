* Add domain verification token for dev domain
* Deduplicate the "mosaic." string from bucket and ARecord. Can't do string manipulation of bucket.BucketName because that's a token rather than the actual bucket name
* Invert dependency so that dev stack depends on prod for the hosted zone rather than prod depending on dev for name servers, since dependency should flow in the direction of higher stability.
* Get dev blog to link to dev assets, e.g., resume in dev asset bucket. Right now it links to the resume in the prod asset bucket
