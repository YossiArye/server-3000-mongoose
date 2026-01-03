# Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- Git installed
- AWS Account (for EC2 deployment)

## Local Development

### Option 1: Using Docker Compose (Recommended)

1.  **Clone the repository** (if not already done).
2.  **Start the application and database**:
    ```bash
    docker-compose up --build
    ```
3.  **Seed the database** (Open a new terminal while the containers are running):
    ```bash
    docker-compose exec app node seed.js
    ```
    You should see "Database successfully seeded".
4.  **Access the application**:
    The server will be running on `http://localhost:3000`.

### Option 2: Running Locally (without Docker)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start MongoDB**:
    Ensure you have a local MongoDB instance running on `mongodb://localhost:27017/entre_db`.
3.  **Seed the database**:
    ```bash
    node seed.js
    ```
4.  **Start the server**:
    ```bash
    node index.js
    ```
    or for development with auto-reload:
    ```bash
    npm run devStart
    ```

## Deploying to EC2

1.  **Launch an EC2 Instance**:
    - Choose an Amazon Linux 2023 or Ubuntu AMI.
    - Select an instance type (e.g., t2.micro for free tier).
    - Configure Security Group:
        - Allow **SSH** (Port 22) from your IP.
        - Allow **Custom TCP** (Port 3000) from Anywhere (0.0.0.0/0).

2.  **Connect to your EC2 Instance**:
    ```bash
    ssh -i "your-key.pem" ec2-user@your-ec2-ip
    ```

3.  **Install Docker and Docker Compose**:
    (For Amazon Linux 2023)
    ```bash
    sudo yum update -y
    sudo yum install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    # Log out and log back in to apply group changes
    exit
    ssh -i "your-key.pem" ec2-user@your-ec2-ip
    
    # Install Docker Compose
    mkdir -p ~/.docker/cli-plugins/
    curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
    chmod +x ~/.docker/cli-plugins/docker-compose
    ```

4.  **Deploy the Application**:
    - **Option A: Git Clone**
        - Install git: `sudo yum install git -y`
        - Clone your repo: `git clone <your-repo-url>`
        - CD into the directory.
    - **Option B: Copy files manually (if no git repo)**
        - Use `scp` to copy project files to the server.

5.  **Run the Application**:
    ```bash
    docker compose up -d --build
    ```

6.  **Seed the Database**:
    ```bash
    docker compose exec app node seed.js
    ```

7.  **Verify Deployment**:
    Open your browser and navigate to `http://your-ec2-ip:3000/`.
    You should see the users JSON response.

## Environment Variables
The application uses the following environment variables (defined in `.env` or `docker-compose.yml`):
- `PORT`: Server port (default: 3000)
- `MONGO_URI`: MongoDB connection string
