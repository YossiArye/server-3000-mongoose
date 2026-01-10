# DevOps Lesson: From Local Code to Cloud Orchestration

This lesson covers the three stages of deployment you encountered: **Docker**, **CI/CD**, and **Kubernetes**.

---

## Part 1: Dockerization (`DEPLOY.md`)

### The Concept
Before Docker, we ran apps by installing Node.js, libraries, and databases directly on the server. If the server had a different OS version, things broke.

**Docker** solves this by packaging the app AND its environment (OS, Node version, files) into a single "Container".

### Key Commands Explained
- **`Dockerfile`**: The recipe. "Take Node 18, copy my files, run `npm install`."
- **`docker-compose.yml`**: The orchestra conductor. "Run my app container AND a MongoDB container, and connect them together."
- **`docker-compose up --build`**:
    - `build`: Cook the recipe (create the image).
    - `up`: Start the containers.
    - `-d`: Detached mode (run in background) - *Real world equivalence: Running a systemd service.*

---

## Part 2: Continuous Deployment (`CD_SETUP.md`)

### The Concept
Manually SSHing into a server to run `git pull` is slow and error-prone. **CI/CD** (Continuous Integration/Continuous Deployment) automates this.

### Real World Equivalence
In professional teams, nobody SSHs into production servers. We push code to GitHub, and a robot (GitHub Actions, Jenkins, CircleCI) deploys it.

### Why Secrets? (`EC2_SSH_KEY`)
We never store passwords or keys in code (`git`). If the repo is public, hackers get access. GitHub Secrets inject these keys safely only during the deployment process.

---

## Part 3: Kubernetes Orchestration (`KUBERNETES.md`)

### The Concept
Docker Compose is great for one server. But what if you need 100 servers? What if one crashes at 3 AM?

**Kubernetes (K8s)** is a platform that manages containers across many servers (a "Cluster"). It is "Self-Healing".

### Real World Equivalence: AWS EKS / Google GKE
- **We used**: **K3s** (Lightweight K8s) on a single EC2.
- **Real World**: Companies use **AWS EKS** (Elastic Kubernetes Service). EKS manages the "Control Plane" (the brain) for you, so you only worry about your worker nodes.

### The Problem: Memory Starvation
**What happened**: Your server crashed because it ran out of RAM.
**The Fix**: **Swap File**.
- **Concept**: When RAM is full, the OS moves inactive data to the Hard Drive (Swap). It's slower, but prevents crashing.
- **Real World**: In production, we don't usually use Swap. We use **Resource Requests/Limits** in K8s to ensure pods fit, or we use **Cluster Autoscaler** to add more servers automatically when we run out of space.

### Key K8s Objects
1.  **Deployment**: "I want 3 copies of my app running always." (If one dies, K8s starts another).
2.  **Service**: "I want a stable IP address to talk to these 3 copies."
    - **NodePort** (What we used): Opens a specific port (30000) on the server. Good for testing/simple setups.
    - **LoadBalancer** (Real World): AWS creates a real ELB (Elastic Load Balancer) to distribute traffic.

### Why Block Ports? (Security)
**Least Privilege Principle**: By default, block EVERYTHING. Only open what is absolutely necessary (Port 30000).
- If you leave Port 27017 (Mongo) open, hackers *will* find it and delete your data.

### Observability: Logs
**How do we see what's happening?**
- **Docker**: `docker compose logs -f app`
- **Kubernetes**: `kubectl logs -f -l app=app`
- **Real World**: In large systems, we don't SSH into servers to check logs. We send them to a centralized system like **ELK Stack** (Elasticsearch, Logstash, Kibana) or **Datadog** so we can search them easily.

---

## Summary
1.  **Code** -> Local JSON files.
2.  **Docker** -> Packaged code + DB into portable containers.
3.  **CI/CD** -> Automated the update process.
4.  **Kubernetes** -> Added self-healing, scaling, and specific networking control.
