#!/bin/bash

# Build script for My Microservices
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY=${REGISTRY:-"localhost:5000"}
IMAGE_PREFIX=${IMAGE_PREFIX:-"my-microservices"}
TAG=${TAG:-"latest"}
SERVICES=("api-gateway" "api-users" "api-products" "web-portal")

echo -e "${GREEN}🚀 Starting build process for My Microservices${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
npm test

# Run linting
echo -e "${YELLOW}🔍 Running linting...${NC}"
npm run lint

# Build applications
echo -e "${YELLOW}🔨 Building applications...${NC}"
for service in "${SERVICES[@]}"; do
    echo -e "${YELLOW}Building $service...${NC}"
    npx nx build $service
done

# Build Docker images
echo -e "${YELLOW}🐳 Building Docker images...${NC}"
for service in "${SERVICES[@]}"; do
    echo -e "${YELLOW}Building Docker image for $service...${NC}"
    docker build -f Dockerfile.$service -t $REGISTRY/$IMAGE_PREFIX-$service:$TAG .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully built $service image${NC}"
    else
        echo -e "${RED}❌ Failed to build $service image${NC}"
        exit 1
    fi
done

echo -e "${GREEN}🎉 All builds completed successfully!${NC}"

# Optional: Push images to registry
if [ "$PUSH_IMAGES" = "true" ]; then
    echo -e "${YELLOW}📤 Pushing images to registry...${NC}"
    for service in "${SERVICES[@]}"; do
        echo -e "${YELLOW}Pushing $service image...${NC}"
        docker push $REGISTRY/$IMAGE_PREFIX-$service:$TAG
    done
    echo -e "${GREEN}✅ All images pushed successfully!${NC}"
fi

echo -e "${GREEN}🏁 Build process completed!${NC}"
