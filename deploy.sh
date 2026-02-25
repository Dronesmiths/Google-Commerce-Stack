#!/bin/bash

# 🚀 Commerce Engine Deployment Script
# Usage: ./deploy.sh [BUCKET_NAME] [CLOUDFRONT_DIST_ID]

BUCKET_NAME=$1
DIST_ID=$2

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}Error: Bucket name is required.${NC}"
    echo "Usage: ./deploy.sh [BUCKET_NAME] [CLOUDFRONT_DIST_ID (optional)]"
    exit 1
fi

echo -e "${BLUE}Starting deployment to S3: s3://$BUCKET_NAME...${NC}"

# Sync files to S3
# --delete ensures files removed locally are also removed from S3
aws s3 sync ./ecommerce-template/storefront s3://$BUCKET_NAME --delete

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully synced to S3!${NC}"
else
    echo -e "${RED}S3 sync failed. Please check your AWS credentials and bucket name.${NC}"
    exit 1
fi

# Handle CloudFront Invalidation if ID is provided
if [ ! -z "$DIST_ID" ]; then
    echo -e "${BLUE}Invalidating CloudFront cache for: $DIST_ID...${NC}"
    aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}CloudFront invalidation triggered!${NC}"
    else
        echo -e "${RED}CloudFront invalidation failed.${NC}"
    fi
fi

echo -e "${GREEN}Deployment Complete! 🚀${NC}"
