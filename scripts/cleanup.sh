#!/bin/bash

# Cleanup script for My Microservices from Kubernetes
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE=${NAMESPACE:-"production"}
RELEASE_NAME=${RELEASE_NAME:-"my-microservices"}

echo -e "${YELLOW}🧹 Starting cleanup process${NC}"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed. Please install kubectl first.${NC}"
    exit 1
fi

# Check if Helm is installed
if ! command -v helm &> /dev/null; then
    echo -e "${RED}❌ Helm is not installed. Please install Helm first.${NC}"
    exit 1
fi

# Check if we can connect to Kubernetes cluster
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig.${NC}"
    exit 1
fi

# Confirm deletion
echo -e "${YELLOW}⚠️  This will delete the following resources:${NC}"
echo -e "${YELLOW}   - Helm release: $RELEASE_NAME${NC}"
echo -e "${YELLOW}   - Namespace: $NAMESPACE (if empty)${NC}"
echo -e "${YELLOW}   - All associated resources (deployments, services, ingress, etc.)${NC}"

read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Cleanup cancelled${NC}"
    exit 0
fi

# Uninstall Helm release
echo -e "${YELLOW}🗑️  Uninstalling Helm release...${NC}"
helm uninstall $RELEASE_NAME -n $NAMESPACE --wait --timeout=5m

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Helm release uninstalled successfully!${NC}"
else
    echo -e "${RED}❌ Failed to uninstall Helm release${NC}"
    exit 1
fi

# Delete namespace if it's empty
echo -e "${YELLOW}🗑️  Checking if namespace is empty...${NC}"
RESOURCES=$(kubectl get all -n $NAMESPACE --no-headers 2>/dev/null | wc -l)

if [ "$RESOURCES" -eq 0 ]; then
    echo -e "${YELLOW}🗑️  Namespace is empty, deleting...${NC}"
    kubectl delete namespace $NAMESPACE
    echo -e "${GREEN}✅ Namespace deleted successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Namespace is not empty, skipping deletion${NC}"
    echo -e "${YELLOW}Remaining resources:${NC}"
    kubectl get all -n $NAMESPACE
fi

# Clean up local Docker images (optional)
if [ "$CLEANUP_IMAGES" = "true" ]; then
    echo -e "${YELLOW}🐳 Cleaning up local Docker images...${NC}"
    docker rmi $(docker images | grep my-microservices | awk '{print $3}') 2>/dev/null || true
    echo -e "${GREEN}✅ Docker images cleaned up!${NC}"
fi

echo -e "${GREEN}🎉 Cleanup completed successfully!${NC}"
