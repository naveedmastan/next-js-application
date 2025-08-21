# AWS S3 + CloudFront Deployment Guide

This guide explains how to deploy your Next.js 15 static export application to AWS S3 with CloudFront for global distribution and proper client-side routing support.

## Prerequisites

- AWS CLI installed and configured with appropriate permissions
- Node.js and npm installed
- Your Next.js application built for static export

## Step 1: Build the Application

```bash
npm run build
```

This creates a static export in the `out/` directory that can be deployed to S3.

## Step 2: Create S3 Bucket

Replace `your-app-bucket-name` with your desired bucket name:

```bash
# Create the S3 bucket
aws s3 mb s3://your-app-bucket-name

# Enable static website hosting
aws s3 website s3://your-app-bucket-name \
  --index-document index.html \
  --error-document index.html
```

## Step 3: Configure S3 Bucket Policy

Create a bucket policy to allow public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-app-bucket-name/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket your-app-bucket-name \
  --policy file://bucket-policy.json
```

## Step 4: Upload Files to S3

```bash
# Upload all files from the out directory
aws s3 sync out/ s3://your-app-bucket-name --delete

# Set proper content types for static assets
aws s3 cp s3://your-app-bucket-name s3://your-app-bucket-name \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

# Set shorter cache for HTML files
aws s3 cp s3://your-app-bucket-name s3://your-app-bucket-name \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html"
```

## Step 5: Create CloudFront Distribution

Create a CloudFront distribution configuration file (`cloudfront-config.json`):

```json
{
  "CallerReference": "my-app-$(date +%s)",
  "Comment": "My App - Next.js Static Export",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-app-bucket-name",
        "DomainName": "your-app-bucket-name.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-app-bucket-name",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

Create the distribution:

```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

## Step 6: Alternative - Using AWS Console

### S3 Configuration via Console:

1. Go to S3 Console and create a new bucket
2. Enable "Static website hosting" in Properties tab
3. Set Index document: `index.html`
4. Set Error document: `index.html` (crucial for client-side routing)
5. In Permissions tab, add the bucket policy above
6. Upload your `out/` directory contents

### CloudFront Configuration via Console:

1. Go to CloudFront Console and create a new distribution
2. **Origin Settings:**
   - Origin Domain: Select your S3 bucket
   - Origin Path: Leave empty
   - Origin Access: Public (or use OAC for better security)

3. **Default Cache Behavior:**
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
   - Cache key and origin requests: Use legacy cache settings
   - Headers: None
   - Query strings: None
   - Cookies: None

4. **Distribution Settings:**
   - Price Class: Use Only U.S., Canada and Europe (or your preferred regions)
   - Default Root Object: `index.html`

5. **Custom Error Pages (CRITICAL for SPA routing):**
   - Error Code: 404, Response Page Path: `/index.html`, HTTP Response Code: 200
   - Error Code: 403, Response Page Path: `/index.html`, HTTP Response Code: 200

## Step 7: Update and Deploy

For future deployments, just run:

```bash
# Build the app
npm run build

# Sync to S3
aws s3 sync out/ s3://your-app-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Important Notes

1. **Error Document Configuration**: Setting both S3 error document and CloudFront custom error pages to return `index.html` with a 200 status is crucial for client-side routing to work properly.

2. **Cache Headers**: HTML files should have short cache times while static assets (JS, CSS, images) can have longer cache times.

3. **HTTPS**: Always use HTTPS in production. CloudFront provides free SSL certificates.

4. **Domain**: You can add a custom domain to your CloudFront distribution and configure Route 53 for DNS.

## Troubleshooting

- **404 on direct route access**: Ensure error documents are configured correctly
- **Caching issues**: Use CloudFront invalidation to clear cache
- **CORS issues**: Not typically needed for static sites, but can be configured in S3 if required

## Security Considerations

- Use Origin Access Control (OAC) instead of public bucket access for better security
- Configure proper IAM policies for deployment automation
- Consider using AWS Secrets Manager for sensitive configuration