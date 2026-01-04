
## Continuous Deployment (CD)

To enable automatic deployment to your EC2 instance whenever you push to `main`, configure the following:

### 1. GitHub Repository Secrets
Go to **Settings** > **Secrets and variables** > **Actions** > **New repository secret** and add:

| Name | Value |
|------|-------|
| `EC2_HOST` | Your EC2 Public IP address (e.g., `16.171.193.193`) |
| `EC2_USER` | Your EC2 username (usually `ec2-user`) |
| `EC2_SSH_KEY` | The **entire content** of your `.pem` key file (starts with `-----BEGIN...`) |

### 2. Workflow
A workflow file has been created at `.github/workflows/deploy.yml`. It will:
1.  SSH into your EC2 instance.
2.  Navigate to the project folder.
3.  Pull the latest changes.
4.  Rebuild and restart the Docker containers.

> [!NOTE]
> Ensure your EC2 instance has the project cloned in the home directory as `server-3000-mongoose` for this specific workflow script to work. If your folder name is different, update the `cd` command in `.github/workflows/deploy.yml`.
