# คู่มือการ Deploy My Microservices บน Kubernetes

## 📋 สิ่งที่ต้องมี

### Prerequisites
- **Kubernetes Cluster** (Minikube, Docker Desktop, หรือ Cloud Provider)
- **kubectl** - Kubernetes command line tool
- **Helm** - Kubernetes package manager
- **Docker** - สำหรับ build images
- **Node.js 18+** - สำหรับ build applications

### การติดตั้ง Tools

#### 1. ติดตั้ง kubectl
```bash
# macOS
brew install kubectl

# Windows
choco install kubernetes-cli

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

#### 2. ติดตั้ง Helm
```bash
# macOS
brew install helm

# Windows
choco install kubernetes-helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

#### 3. ติดตั้ง Minikube (สำหรับ local development)
```bash
# macOS
brew install minikube

# Windows
choco install minikube

# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

## 🚀 การใช้งาน

### 1. การ Setup Local Environment

#### เริ่มต้น Minikube
```bash
minikube start
minikube addons enable ingress
minikube addons enable metrics-server
```

#### ตรวจสอบการเชื่อมต่อ
```bash
kubectl cluster-info
kubectl get nodes
```

### 2. การ Build และ Deploy

#### ใช้ Makefile (แนะนำ)
```bash
# Setup development environment
make setup

# Build และ deploy ทั้งหมด
make all

# หรือแยกขั้นตอน
make install      # ติดตั้ง dependencies
make build        # Build applications
make docker-build # Build Docker images
make deploy       # Deploy to Kubernetes
```

#### ใช้ Scripts โดยตรง
```bash
# Build
./scripts/build.sh

# Deploy
./scripts/deploy.sh

# Cleanup
./scripts/cleanup.sh
```

### 3. การใช้งาน Helm โดยตรง

#### Deploy
```bash
# Deploy ด้วย default values
helm install my-microservices ./helm

# Deploy ด้วย custom values
helm install my-microservices ./helm \
  --set image.repository=my-registry/my-microservices \
  --set image.tag=v1.0.0 \
  --set replicaCount.apiGateway=3

# Deploy ใน namespace เฉพาะ
helm install my-microservices ./helm \
  --namespace production \
  --create-namespace
```

#### Update
```bash
helm upgrade my-microservices ./helm \
  --set image.tag=v1.0.1
```

#### Uninstall
```bash
helm uninstall my-microservices
```

### 4. การตรวจสอบ Deployment

#### ดูสถานะ
```bash
make status
# หรือ
kubectl get pods -n production
kubectl get services -n production
kubectl get ingress -n production
```

#### ดู Logs
```bash
make logs
# หรือ
kubectl logs -n production -l app.kubernetes.io/instance=my-microservices -f
```

#### เข้าไปใน Pod
```bash
kubectl exec -it -n production deployment/my-microservices-api-gateway -- /bin/sh
```

## 🔧 การ Config

### Environment Variables

แก้ไขไฟล์ `helm/values.yaml`:

```yaml
env:
  apiGateway:
    NODE_ENV: production
    PORT: "3000"
    RABBITMQ_URL: amqp://admin:password@rabbitmq:5672
  apiUsers:
    NODE_ENV: production
    PORT: "3001"
    RABBITMQ_URL: amqp://admin:password@rabbitmq:5672
```

### Resource Limits

```yaml
resources:
  apiGateway:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 250m
      memory: 256Mi
```

### Autoscaling

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

## 🌐 การเข้าถึง Services

### Local Development (Minikube)
```bash
# เปิด tunnel สำหรับ external access
minikube tunnel

# ดู IP addresses
kubectl get services -n production
```

### Production
- ใช้ LoadBalancer หรือ Ingress Controller
- ตั้งค่า DNS records ไปยัง LoadBalancer IP
- ใช้ SSL certificates (แนะนำ cert-manager)

## 📊 Monitoring และ Logging

### Metrics
```bash
# ดู resource usage
kubectl top pods -n production
kubectl top nodes
```

### Logs
```bash
# ดู logs ของ service เฉพาะ
kubectl logs -n production deployment/my-microservices-api-gateway

# ดู logs ของ pod เฉพาะ
kubectl logs -n production pod/my-microservices-api-gateway-xxxxx
```

## 🔒 Security

### Secrets Management
```bash
# สร้าง secret
kubectl create secret generic my-secrets \
  --from-literal=db-password=mysecret \
  --from-literal=api-key=myapikey \
  -n production

# ใช้ใน Helm values
env:
  apiGateway:
    DB_PASSWORD: $(DB_PASSWORD)
```

### Network Policies
```yaml
# สร้างไฟล์ network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-gateway-policy
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/component: api-gateway
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
```

## 🚨 Troubleshooting

### Pod ไม่ขึ้น
```bash
# ดู pod status
kubectl describe pod <pod-name> -n production

# ดู events
kubectl get events -n production --sort-by='.lastTimestamp'
```

### Service ไม่สามารถเชื่อมต่อได้
```bash
# ตรวจสอบ service
kubectl describe service <service-name> -n production

# Test connectivity
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <service-name>
```

### Image Pull Error
```bash
# ตรวจสอบ image
kubectl describe pod <pod-name> -n production | grep -A 10 Events

# ตรวจสอบ image pull secrets
kubectl get secrets -n production
```

## 📚 เพิ่มเติม

### Useful Commands
```bash
# Port forward สำหรับ local access
kubectl port-forward -n production service/my-microservices-api-gateway 3000:3000

# ดู Helm release history
helm history my-microservices -n production

# Rollback
helm rollback my-microservices 1 -n production

# ดู Helm values
helm get values my-microservices -n production
```

### Best Practices
1. **ใช้ Resource Limits** - กำหนด CPU และ Memory limits
2. **ใช้ Health Checks** - ตั้งค่า liveness และ readiness probes
3. **ใช้ Rolling Updates** - ตั้งค่า update strategy
4. **ใช้ Secrets** - ไม่เก็บ sensitive data ใน code
5. **ใช้ Network Policies** - จำกัด network access
6. **ใช้ Monitoring** - ติดตั้ง monitoring tools
7. **ใช้ Backup** - backup data และ configurations

### Production Checklist
- [ ] Resource limits ถูกตั้งค่า
- [ ] Health checks ทำงาน
- [ ] Autoscaling เปิดใช้งาน
- [ ] SSL certificates ถูกติดตั้ง
- [ ] Monitoring ถูกตั้งค่า
- [ ] Backup strategy มีอยู่
- [ ] Security policies ถูกตั้งค่า
- [ ] Documentation ครบถ้วน
