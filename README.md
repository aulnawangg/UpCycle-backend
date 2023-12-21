# UpCycle-backend API Installition Guide
This tutorial aims to guide you through the steps of configuring and installing an API using Express.js
[Postman Documentation](https://documenter.getpostman.com/view/30315937/2s9YkrZedg)
## Prerequisite
**Before you begin, make sure you have the following installed on your system**:
- Node.js
- npm (Node Package Manager)
- Google Cloud Run
- Google Cloud SQL
- Google Cloud Storage
### Getting Started
**Follow the steps**
1. **Clone the Repository in Google Cloud Platform**
  ---Start Cloning the repository
  ---https://github.com/aulnawangg/UpCycle-backend.git
2. **Create Project in Google Cloud Project then Create Cloud SQL**
   ---*Before you set up the cloud run, you need to create database use Cloud SQL:
   ---*Create and set up your SQL database
   ---*Open or Import "databse" folder in local to define the table structure.
3. **Navigate to the project directory**
  ---Change to the project directory using this command:
  ---cd UpCycle-backend
4.**Install Depedencies**
  ---Install requirements projects dependencies by running this following command:
  ---npm install
5.**Edit Environment Variables**
---".env" located in your project's root directory. This ".env" file will store environment-specific configurations, and it ---is essential to verify that these configurations align with the settings you established in Google Cloud SQL.
6.**Start the server**
---To run the API server, run this command:
  ---```npm run start
7.**Deploy in Google Cloud Run**
  **To deploy the API server, run this command in Terminal Vscode, CloudShell, CloudSDK**:
---```GOOGLE_PROJECT_ID="Your Google Project ID"
---```CLOUD_RUN_SERVICE="What You Want Name Service"
---```INSTANCE_CONNECTION_NAME="Your Instance Connection Name in CLOUD SQL"
---```DB_HOST="Your Public IP in CLOUD SQL"
---```DB_USER="Your User in CLOUD SQL"
---```DB_PASS="Your Password User in CLOUD SQL"
---```DB_NAME="Your Databse Name in CLOUD SQL"

---```gdocker build -t gcr.io/"Your Google Project ID"/upcycle:v1 .
---```docker push gcr.io/"Your Google Project ID"/upcycle:v1
---```gcloud run deploy --image gcr.io/"Your Google Project ID"/upcycle:v1 --platform managed
  
