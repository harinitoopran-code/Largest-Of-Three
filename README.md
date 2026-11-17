# Largest of Three Numbers – GitHub, Jenkins, Docker & Kubernetes

## Project structure
```
largest-of-three/
├── largest.js          # core logic (largest of 3 numbers)
├── cli.js              # command-line program
├── server.js           # small web app (used for container/Kubernetes)
├── test/largest.test.js# unit tests
├── Dockerfile          # container image
├── Jenkinsfile         # CI/CD pipeline
└── k8s/                # Kubernetes deployment.yaml + service.yaml
```

## Tools needed (Mac)
Node.js 18+, Git, GitHub account, Docker Desktop (with Kubernetes enabled), Jenkins, kubectl.

---
## 6.a  Largest program + upload to GitHub

**Aim:** Write a program to find the largest of three numbers and upload it to GitHub using Git.

**Run the program**
```
cd ~/Downloads/largest-of-three
node cli.js 10 25 7        # Largest number is: 25
npm test                   # 7 tests pass
```
**Upload to GitHub**
1. GitHub → New Repository → name: `Largest-Of-Three` → Create (do NOT add README).
2. In Terminal:
```
cd ~/Downloads/largest-of-three
git init
git add .
git commit -m "Initial commit - largest of three numbers"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Largest-Of-Three.git
git push -u origin main
```
(If asked for a password, use a GitHub Personal Access Token: Settings → Developer settings → Tokens.)

**Result:** Program uploaded to GitHub.

---
## 6.b  Jenkins build job + deploy containerized app on Kubernetes

**Aim:** Configure a Jenkins job and deploy a containerized sample application using Kubernetes.

### Step 1 – Enable Kubernetes
Docker Desktop → Settings → Kubernetes → *Enable Kubernetes* → Apply & Restart. Check:
```
kubectl get nodes          # STATUS should be Ready
```
(minikube alternative: `minikube start` then `eval $(minikube docker-env)` before building.)

### Step 2 – Build image & deploy manually (to test)
```
docker build -t largest-of-three:latest .
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get pods
kubectl get svc
```
Open **http://localhost:30080** (minikube: `minikube service largest-service --url`).
Test API: `curl "http://localhost:30080/api/largest?a=4&b=99&c=7"`

### Step 3 – Install & start Jenkins on Mac
```
brew install jenkins-lts
brew services start jenkins-lts
```
Open http://localhost:8080 → unlock using `cat ~/.jenkins/secrets/initialAdminPassword` → install suggested plugins.
Jenkins runs on your Mac, so it can use your `docker` and `kubectl`. Make sure Node.js is installed (`node -v`).

### Step 4 – Create the Jenkins job
1. New Item → name `Largest-Pipeline` → **Pipeline** → OK.
2. Pipeline → Definition: **Pipeline script from SCM**.
3. SCM: **Git** → Repository URL: `https://github.com/YOUR_USERNAME/Largest-Of-Three.git`
4. Branch: `*/main`, Script Path: `Jenkinsfile`.
5. Save → **Build Now** → Console Output.

**Pipeline stages:** Checkout → Run Unit Tests → Build Docker Image → Deploy to Kubernetes → Verify Deployment.

### Step 5 – Verify
```
kubectl get deployments
kubectl get pods
kubectl get svc
```
Open http://localhost:30080 and enter three numbers.

### Step 6 – Clean up
```
kubectl delete -f k8s/
```
**Result:** Jenkins job built the app, created the Docker image, and deployed it to Kubernetes successfully.

---
## Troubleshooting
| Problem | Fix |
|---|---|
| `docker: command not found` in Jenkins | PATH is set in Jenkinsfile; also check Docker Desktop is running |
| Pod `ErrImagePull` | Build image first; `imagePullPolicy: IfNotPresent` is already set. For minikube run `eval $(minikube docker-env)` then rebuild |
| Port 30080 not opening | `kubectl get svc`; on minikube use `minikube service largest-service --url` |
| `kubectl` can't connect | Enable Kubernetes in Docker Desktop and wait until it is green |
| Jenkins "node: command not found" | `brew install node` and restart Jenkins: `brew services restart jenkins-lts` |

## Viva questions
- **What is Kubernetes?** An open-source platform that automates deployment, scaling and management of containers.
- **Pod?** Smallest deployable unit; runs one or more containers.
- **Deployment?** Manages replicas of pods and rolling updates.
- **Service?** Gives pods a stable network endpoint (NodePort exposes it outside the cluster).
- **kubectl?** Command-line tool to control a Kubernetes cluster.
- **What is a Jenkins pipeline?** Automated stages (build, test, deploy) defined in a Jenkinsfile.
