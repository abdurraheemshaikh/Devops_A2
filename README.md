# Devops_A2
# 📝 To-Do App — DevOps A2

A simple full-stack To-Do application containerized with Docker and deployed on a Kubernetes cluster using Ingress. The project demonstrates core DevOps tools and practices including containerization, orchestration, service exposure, and namespace isolation.

---

## 🚀 Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python / Flask *(replace if using another stack)*  
- **Containerization:** Docker  
- **Orchestration:** Kubernetes  
- **Networking:** Ingress Controller (NGINX)  
- **Namespace:** `project`

---

## 📁 Project Structure
to-do-app/
│
├── backend/
│ ├── app.py
│ └── Dockerfile
│
├── frontend/
│ ├── index.html
│ ├── styles.css
│ ├── app.js
│ └── Dockerfile
│
├── k8s/
│ ├── frontend-deployment.yaml
│ ├── backend-deployment.yaml
│ ├── frontend-service.yaml
│ ├── backend-service.yaml
│ └── ingress.yaml
│
└── README.md


---

## ⚙️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/to-do-app.git
cd to-do-app
docker build -t todo-frontend ./frontend
docker build -t todo-backend ./backend
kubectl create namespace project
kubectl apply -n project -f k8s/
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
http://localhost:8080
🧪 Test URLs
Visit http://localhost:8080 after port forwarding

Frontend is served via Ingress and makes internal calls to the backend service

📸 Screenshots
Frontend UI

📌 Notes
Ensure Ingress Controller is installed (ingress-nginx on Docker Desktop or via Helm)

Match service ports with container ports for correct routing

Namespace isolation is used for cleaner environment (project)

👨‍💻 Author
Abdur Raheem Shaikh
GitHub

📜 License 




