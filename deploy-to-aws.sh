#!/bin/bash

# AWS S3 + CloudFront Deployment Script
# Make sure to configure these variables before running

BUCKET_NAME="your-app-bucket-name"
DISTRIBUTION_ID="YOUR_CLOUDFRONT_DISTRIBUTION_ID"
REGION="us-east-1"

echo "🚀 Starting deployment to AWS S3 + CloudFront..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors and try again."
    exit 1
fi

# Check if bucket exists, create if not
echo "🪣 Checking S3 bucket..."
if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "✅ Bucket exists"
else
    echo "📝 Creating S3 bucket..."
    aws s3 mb "s3://$BUCKET_NAME" --region $REGION
    
    # Configure static website hosting
    echo "🌐 Configuring static website hosting..."
    aws s3 website "s3://$BUCKET_NAME" \
        --index-document index.html \
        --error-document index.html
    
    # Apply bucket policy for public read access
    echo "🔓 Setting bucket policy..."
    cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket $BUCKET_NAME \
        --policy file://bucket-policy.json
    
    rm bucket-policy.json
fi

# Upload files to S3
echo "📤 Uploading files to S3..."
aws s3 sync out/ "s3://$BUCKET_NAME" --delete

# Set cache headers for static assets
echo "⚡ Setting cache headers..."
aws s3 cp "s3://$BUCKET_NAME" "s3://$BUCKET_NAME" \
    --recursive \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "*.json"

# Set short cache for HTML files
aws s3 cp "s3://$BUCKET_NAME" "s3://$BUCKET_NAME" \
    --recursive \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html"

# Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$DISTRIBUTION_ID" ] && [ "$DISTRIBUTION_ID" != "YOUR_CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
    echo "✅ Cache invalidation created"
else
    echo "⚠️  CloudFront distribution ID not configured. Skipping cache invalidation."
    echo "   Update DISTRIBUTION_ID in this script after creating your CloudFront distribution."
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. If this is your first deployment, create a CloudFront distribution pointing to your S3 bucket"
echo "2. Configure custom error pages (404 -> /index.html with 200 status)"
echo "3. Update DISTRIBUTION_ID in this script for future deployments"
echo "4. Consider setting up a custom domain with Route 53"
echo ""
echo "🌐 S3 Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"