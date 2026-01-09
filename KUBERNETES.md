# Kubernetes Guide (Free Tier K3s Edition)

This guide provides a "Lightweight" Kubernetes setup using **k3s**. This gives you the best chance of running on a **Free Tier (t2.micro)** instance, although performance will be limited.

## 1. Install K3s on EC2
Connect to your EC2 instance.

# 1. Install K3s on EC2
Connect to your EC2 instance.

### Optimization for t2.micro (Critical)
Since you have very low RAM, you **MUST** create a swap file and disable heavy features, or K3s will crash.

1.  **Create a 1GB Swap File**:
    ```bash
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    ```

2.  **Install K3s (Minimal Mode)**:
    Disables Traefik (ingress) and Metrics Server to save RAM.
    ```bash
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable traefik --disable metrics-server" sh -
    ```

3.  **Configure Permissions**:
    Allow your user to use the kubectl command without sudo.
    ```bash
    sudo chmod 644 /etc/rancher/k3s/k3s.yaml
    export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
    echo "export KUBECONFIG=/etc/rancher/k3s/k3s.yaml" >> ~/.bashrc
    ```

3.  **Check Status**:
    ```bash
    kubectl get nodes
    ```
    You should see your node as `Ready`.

## 2. Deploy the Application

1.  **Clone/Pull your code**:
    ```bash
    cd server-3000-mongoose
    git pull
    ```

2.  **Import Image to K3s**:
    K3s uses `containerd`, not Docker by default. We will build the image with Docker and export it to K3s.
    
    *Install Docker first (if not installed):*
    ```bash
    sudo yum install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    newgrp docker
    ```

    *Build and Import:*
    ```bash
    # Build
    docker build -t server-3000-mongoose-app:latest .
    
    # Save to file
    docker save server-3000-mongoose-app:latest -o app.tar
    
    # Import to k3s
    sudo k3s ctr images import app.tar
    ```

3.  **Apply Manifests**:
    ```bash
    kubectl apply -f k8s/
    ```

4.  **Seed Database**:
    ```bash
    kubectl get pods
    kubectl exec -it <app-pod-name> -- node seed.js
    ```

## 3. Access the Application
The app uses **NodePort 30000**.
- Ensure EC2 Security Group allows port **30000**.
- Visit `http://<EC2-IP>:30000/websites`.

## 4. Verification: Self-Healing
1.  `kubectl get pods -w`
2.  `kubectl delete pod <pod-name>`
3.  Observe auto-recovery.
