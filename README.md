# UpCycle-backend API Installation Guide

This tutorial aims to guide you through the steps of configuring and installing an API using Express.js.

[Postman Documentation](https://documenter.getpostman.com/view/30315937/2s9YkrZedg)

## Prerequisites

**Before you begin, make sure you have the following installed on your system**:
- Node.js
- npm (Node Package Manager)
- Google Cloud Run
- Google Cloud SQL
- Google Cloud Storage

### Getting Started

**Follow the steps:**

1. **Clone the Repository in Google Cloud Platform**
   Start cloning the repository:
 ```bash 
git clone https://github.com/aulnawangg/UpCycle-backend.git
```

3. **Create Project in Google Cloud Project then Create Cloud SQL**
- Before you set up Cloud Run, you need to create a database using Cloud SQL.
- Create and set up your SQL database.
- Open or import the "database" folder locally to define the table structure.
  
3. **Navigate to the project directory**
```bash 
cd UpCycle-backend 
```
Change to the project directory using this command:
  ```bash 
cd UpCycle-backend
``` 
   
4. **Install Dependencies**
Install project dependencies by running the following command:
```bash 
npm install
```

5. **Edit Environment Variables** 

Edit the `.env` file located in the project's root directory to store environment-specific configurations. Verify that these configurations align with the settings you established in Google Cloud SQL.


6. **Start the server**
To run the API server, execute this command:
```bash 
npm run start
```
   
7. **Deploy in Google Cloud Run**

To deploy the API server, run these commands in Terminal (VSCode, CloudShell, CloudSDK):
```bash
GOOGLE_PROJECT_ID="Your Google Project ID"
CLOUD_RUN_SERVICE="Desired Service Name"
INSTANCE_CONNECTION_NAME="Your Instance Connection Name in CLOUD SQL"
DB_HOST="Your Public IP in CLOUD SQL"
DB_USER="Your User in CLOUD SQL"
DB_PASS="Your Password User in CLOUD SQL"
DB_NAME="Your Database Name in CLOUD SQL"

docker build -t gcr.io/$GOOGLE_PROJECT_ID/upcycle:v1 .
docker push gcr.io/$GOOGLE_PROJECT_ID/upcycle:v1
gcloud run deploy --image gcr.io/$GOOGLE_PROJECT_ID/upcycle:v1 --platform managed
```
