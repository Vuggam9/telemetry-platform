# Telemetry Platform (AWS + EKS + Kafka + Terraform)

A minimal, **interview-grade** microservices demo: Spring Boot services, React dashboard, Helm charts, GitHub Actions, and Infrastructure-as-Code for AWS (EKS).

## What you'll demo
- Spring Boot REST microservices (`ingest-service`, `api-gateway`)
- React dashboard (`dashboard`)
- CI/CD with **GitHub Actions** → build, test, containerize, deploy to **EKS** via **Helm**
- Optional local infra: **Kafka + Postgres** via Docker Compose
- IaC (Terraform skeleton) + AWS OIDC role for GitHub Actions

---

## 0) One‑time setup
- Create a new GitHub repo named `telemetry-platform` and push these files.
- In **Settings → Actions → General**, set Workflow permissions → `Read and write`. Save.
- In **Settings → Secrets and variables → Actions → Secrets**, add:
  - `AWS_ACCOUNT_ID` = your AWS account id
  - (Optional) `TF_BACKEND_BUCKET`, `TF_BACKEND_DYNAMO_TABLE` if using remote tf backend
- In **AWS**:
  1. Create an **OIDC provider** for GitHub (`token.actions.githubusercontent.com`) if not present.
  2. Create IAM Role `gh-oidc-deploy` with trust policy for your repo to assume. Attach policies allowing ECR (if used), EKS `DescribeCluster`, and `eks:AccessKubernetesApi` via cluster auth. Same for `gh-oidc-terraform` with Terraform‑needed perms (EKS, VPC, IAM, etc.).
  3. Create an EKS cluster named `telemetry-eks` (you can use the terraform skeleton in `ops/terraform/` or `eksctl`).

> Tip: Start with app CI/CD **without** Terraform; deploy to an existing EKS cluster first.

---

## 1) Local quick run (optional)
Requires Docker Desktop.

```bash
docker compose -f ops/docker-compose.infra.yml up -d
# Then build & run services locally if you want:
cd ingest-service && ./mvnw spring-boot:run
# In another terminal:
cd api-gateway && ./mvnw spring-boot:run
# React (dashboard):
cd dashboard && npm install && npm run dev
```

---

## 2) GitHub Actions (CI/CD)
Two workflows:
- `.github/workflows/app-ci-cd.yml` — builds, tests, pushes images to GHCR, deploys to EKS with Helm.
- `.github/workflows/infra-plan-apply.yml` — plans/applies Terraform infra (manual apply).

> Before first deploy: push once to `main` so GHCR namespace initializes; also create EKS and connect your IAM user to `system:masters` and grant a Kubernetes `clusterrolebinding` for the deploy role (or use AWS auth config map).

---

## 3) How to see it working
- Push a commit → watch **Actions** run.
- After success: `kubectl get svc -n default` to find the `api-gateway` Service. Port‑forward or expose via LoadBalancer/Ingress.
- Open `dashboard` and point it to the `api-gateway` URL (set env var `VITE_API_URL`).

---

## 4) Folder tour
```
telemetry-platform/
  ingest-service/     # Spring Boot (REST + placeholder for Kafka consumer)
  api-gateway/        # Spring Boot (REST; JWT-ready config hook)
  dashboard/          # React (Vite) dashboard
  helm/               # Minimal Helm charts
  ops/
    docker-compose.infra.yml  # Kafka + Zookeeper + Postgres (optional)
    terraform/                # Terraform skeleton for EKS (optional)
  .github/workflows/  # GitHub Actions
```

---

## 5) Next steps (stretch)
- Add Kafka consumer in `ingest-service` and publish to Postgres.
- Add JWT auth to `api-gateway` using a simple symmetric key first.
- Add Prometheus/Grafana via Helm.
- Add Trivy/OWASP Dependency-Check to CI stage.
