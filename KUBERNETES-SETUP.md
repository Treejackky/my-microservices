# 🚀 การ Setup Kubernetes สำหรับ My Microservices

## 📋 สรุปสิ่งที่ได้สร้าง

### 1. Helm Charts
- **`helm/Chart.yaml`** - Helm chart metadata
- **`helm/values.yaml`** - Default configuration
- **`helm/values-production.yaml`** - Production configuration
- **`helm/values-staging.yaml`** - Staging configuration
- **`helm/templates/`** - Kubernetes manifests templates

### 2. CI/CD Pipeline
- **`.github/workflows/build-and-deploy.yml`** - GitHub Actions workflow
- **`scripts/build.sh`** - Build script
- **`scripts/deploy.sh`** - Deploy script
- **`scripts/cleanup.sh`** - Cleanup script

### 3. Health Checks
- **API Gateway**: `/health`, `/ready` endpoints
- **API Users**: `/health`, `/ready` endpoints
- **Web Portal**: `/api/health` endpoint

### 4. Configuration Files
- **`Makefile`** - Simplified commands
- **`README-KUBERNETES.md`** - Detailed documentation

## 🚀 ขั้นตอนการใช้งาน

### 1. ติดตั้ง Prerequisites
```bash
# ติดตั้ง kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# ติดตั้ง Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# ติดตั้ง Minikube (สำหรับ local development)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### 2. เริ่มต้น Local Environment
```bash
# เริ่มต้น Minikube
minikube start
minikube addons enable ingress
minikube addons enable metrics-server

# ตรวจสอบการเชื่อมต่อ
kubectl cluster-info
```

### 3. Build และ Deploy
```bash
# ใช้ Makefile (แนะนำ)
make setup    # ติดตั้ง dependencies
make all      # build และ deploy ทั้งหมด

# หรือใช้ scripts โดยตรง
./scripts/build.sh
./scripts/deploy.sh
```

### 4. ตรวจสอบ Deployment
```bash
# ดูสถานะ
make status

# ดู logs
make logs

# เข้าไปใน pod
kubectl exec -it -n production deployment/my-microservices-api-gateway -- /bin/sh
```

## 🔧 การ Config

### Environment Variables
แก้ไขไฟล์ `helm/values.yaml` หรือใช้ environment-specific files:
- `helm/values-production.yaml` สำหรับ production
- `helm/values-staging.yaml` สำหรับ staging

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

### Local Development
```bash
# เปิด tunnel
minikube tunnel

# ดู IP addresses
kubectl get services -n production
```

### Production
- ใช้ LoadBalancer หรือ Ingress Controller
- ตั้งค่า DNS records
- ใช้ SSL certificates

## 📊 Monitoring

### Metrics
```bash
kubectl top pods -n production
kubectl top nodes
```

### Logs
```bash
kubectl logs -n production -l app.kubernetes.io/instance=my-microservices -f
```

## 🔒 Security

### Secrets
```bash
kubectl create secret generic my-secrets \
  --from-literal=db-password=mysecret \
  --from-literal=api-key=myapikey \
  -n production
```

### Network Policies
สร้างไฟล์ `network-policy.yaml` สำหรับจำกัด network access

## 🚨 Troubleshooting

### Pod ไม่ขึ้น
```bash
kubectl describe pod <pod-name> -n production
kubectl get events -n production --sort-by='.lastTimestamp'
```

### Service ไม่สามารถเชื่อมต่อได้
```bash
kubectl describe service <service-name> -n production
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <service-name>
```

## 📚 Useful Commands

```bash
# Port forward
kubectl port-forward -n production service/my-microservices-api-gateway 3000:3000

# Helm operations
helm history my-microservices -n production
helm rollback my-microservices 1 -n production
helm get values my-microservices -n production

# Cleanup
make undeploy
# หรือ
./scripts/cleanup.sh
```

## 🎯 Best Practices

1. **ใช้ Resource Limits** - กำหนด CPU และ Memory limits
2. **ใช้ Health Checks** - ตั้งค่า liveness และ readiness probes
3. **ใช้ Rolling Updates** - ตั้งค่า update strategy
4. **ใช้ Secrets** - ไม่เก็บ sensitive data ใน code
5. **ใช้ Network Policies** - จำกัด network access
6. **ใช้ Monitoring** - ติดตั้ง monitoring tools
7. **ใช้ Backup** - backup data และ configurations

## 📝 Production Checklist

- [ ] Resource limits ถูกตั้งค่า
- [ ] Health checks ทำงาน
- [ ] Autoscaling เปิดใช้งาน
- [ ] SSL certificates ถูกติดตั้ง
- [ ] Monitoring ถูกตั้งค่า
- [ ] Backup strategy มีอยู่
- [ ] Security policies ถูกตั้งค่า
- [ ] Documentation ครบถ้วน

## 🔗 Links

- [คู่มือการใช้งาน Kubernetes](README-KUBERNETES.md)
- [Helm Documentation](https://helm.sh/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
