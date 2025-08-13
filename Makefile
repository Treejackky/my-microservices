# Makefile for My Microservices
.PHONY: help install build test lint clean docker-build docker-push deploy undeploy status logs

# Configuration
REGISTRY ?= localhost:5000
IMAGE_PREFIX ?= my-microservices
TAG ?= latest
NAMESPACE ?= production
RELEASE_NAME ?= my-microservices

# Colors
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm ci

build: ## Build all applications
        @echo "$(GREEN)Building applications...$(NC)"
        npx nx build api-gateway
        npx nx build api-users
        npx nx build api-products
        npx nx build web-portal

test: ## Run tests
	@echo "$(GREEN)Running tests...$(NC)"
	npm test

lint: ## Run linting
	@echo "$(GREEN)Running linting...$(NC)"
	npm run lint

clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	npx nx reset
	rm -rf dist/
	rm -rf .nx/

docker-build: ## Build Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	@chmod +x scripts/build.sh
	./scripts/build.sh

docker-push: ## Build and push Docker images
	@echo "$(GREEN)Building and pushing Docker images...$(NC)"
	@chmod +x scripts/build.sh
	PUSH_IMAGES=true ./scripts/build.sh

deploy: ## Deploy to Kubernetes
	@echo "$(GREEN)Deploying to Kubernetes...$(NC)"
	@chmod +x scripts/deploy.sh
	./scripts/deploy.sh

undeploy: ## Remove from Kubernetes
	@echo "$(GREEN)Removing from Kubernetes...$(NC)"
	@chmod +x scripts/cleanup.sh
	./scripts/cleanup.sh

status: ## Show Kubernetes deployment status
	@echo "$(GREEN)Deployment Status:$(NC)"
	kubectl get pods -n $(NAMESPACE) -l app.kubernetes.io/instance=$(RELEASE_NAME)
	@echo "$(YELLOW)Services:$(NC)"
	kubectl get services -n $(NAMESPACE) -l app.kubernetes.io/instance=$(RELEASE_NAME)
	@echo "$(YELLOW)Ingress:$(NC)"
	kubectl get ingress -n $(NAMESPACE) -l app.kubernetes.io/instance=$(RELEASE_NAME)

logs: ## Show application logs
	@echo "$(GREEN)Application logs:$(NC)"
	kubectl logs -n $(NAMESPACE) -l app.kubernetes.io/instance=$(RELEASE_NAME) --tail=100 -f

dev: ## Start development environment
	@echo "$(GREEN)Starting development environment...$(NC)"
	docker-compose up -d

dev-down: ## Stop development environment
	@echo "$(GREEN)Stopping development environment...$(NC)"
	docker-compose down

# CI/CD shortcuts
ci-build: install test lint build docker-build ## Run CI build pipeline
ci-deploy: docker-push deploy ## Run CI deploy pipeline

# Development shortcuts
setup: install ## Setup development environment
all: install test lint build docker-build deploy ## Run complete pipeline
