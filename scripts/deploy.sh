#!/bin/bash

# Deploy script for My Microservices to Kubernetes
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
REGISTRY=${REGISTRY:-"localhost:5000"}
IMAGE_PREFIX=${IMAGE_PREFIX:-"my-microservices"}
TAG=${TAG:-"latest"}

echo -e "${GREEN}🚀 Starting deployment to Kubernetes${NC}"

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

# Create namespace if it doesn't exist
echo -e "${YELLOW}📁 Creating namespace $NAMESPACE if it doesn't exist...${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Update values.yaml with current image tags
echo -e "${YELLOW}📝 Updating Helm values...${NC}"
sed -i.bak "s|your-registry/my-microservices|$REGISTRY/$IMAGE_PREFIX|g" helm/values.yaml
sed -i.bak "s|tag: \"latest\"|tag: \"$TAG\"|g" helm/values.yaml

# Deploy using Helm
echo -e "${YELLOW}📦 Deploying with Helm...${NC}"
helm upgrade --install $RELEASE_NAME ./helm \
    --namespace $NAMESPACE \
    --set image.repository=$REGISTRY/$IMAGE_PREFIX \
    --set image.tag=$TAG \
    --wait \
    --timeout=10m

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Helm deployment completed successfully!${NC}"
else
    echo -e "${RED}❌ Helm deployment failed${NC}"
    exit 1
fi

# Wait for deployments to be ready
echo -e "${YELLOW}⏳ Waiting for deployments to be ready...${NC}"
kubectl rollout status deployment/$RELEASE_NAME-api-gateway -n $NAMESPACE --timeout=300s
kubectl rollout status deployment/$RELEASE_NAME-api-users -n $NAMESPACE --timeout=300s
kubectl rollout status deployment/$RELEASE_NAME-web-portal -n $NAMESPACE --timeout=300s
kubectl rollout status deployment/$RELEASE_NAME-rabbitmq -n $NAMESPACE --timeout=300s

# Show deployment status
echo -e "${BLUE}📊 Deployment Status:${NC}"
echo -e "${YELLOW}Pods:${NC}"
kubectl get pods -n $NAMESPACE -l app.kubernetes.io/instance=$RELEASE_NAME

echo -e "${YELLOW}Services:${NC}"
kubectl get services -n $NAMESPACE -l app.kubernetes.io/instance=$RELEASE_NAME

echo -e "${YELLOW}Ingress:${NC}"
kubectl get ingress -n $NAMESPACE -l app.kubernetes.io/instance=$RELEASE_NAME

# Show service URLs
echo -e "${BLUE}🌐 Service URLs:${NC}"
API_GATEWAY_IP=$(kubectl get service $RELEASE_NAME-api-gateway -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
API_USERS_IP=$(kubectl get service $RELEASE_NAME-api-users -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
WEB_PORTAL_IP=$(kubectl get service $RELEASE_NAME-web-portal -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

if [ ! -z "$API_GATEWAY_IP" ]; then
    echo -e "${GREEN}API Gateway: http://$API_GATEWAY_IP:3000${NC}"
fi
if [ ! -z "$API_USERS_IP" ]; then
    echo -e "${GREEN}API Users: http://$API_USERS_IP:3001${NC}"
fi
if [ ! -z "$WEB_PORTAL_IP" ]; then
    echo -e "${GREEN}Web Portal: http://$WEB_PORTAL_IP:3000${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"

# Optional: Show logs
if [ "$SHOW_LOGS" = "true" ]; then
    echo -e "${YELLOW}📋 Recent logs:${NC}"
    kubectl logs -n $NAMESPACE -l app.kubernetes.io/instance=$RELEASE_NAME --tail=50
fi
