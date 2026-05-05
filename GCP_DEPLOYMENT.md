# ☁️ Google Cloud Deployment Guide (Pure GCP)

Since you want to strictly use Google Cloud Platform (GCP) and avoid Firebase, here are the two best native GCP options for hosting a static React application.

We have provided the configuration files for **both** methods in your project.

---

## 🌩️ Option 1: Google Cloud Run (Recommended Modern Approach)
Cloud Run is Google's serverless container platform. It's highly scalable, supports custom domains with free SSL, and has a very generous free tier. It uses the `Dockerfile` we've added to your project.

### Prerequisites
- Docker installed locally (optional, but good for testing).
- [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed.

### Steps to Deploy
1. **Login to Google Cloud:**
   ```bash
   gcloud auth login
   ```

2. **Set your GCP Project ID:**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Build and Deploy the Container:**
   Cloud Run can build and deploy directly from your source code using Cloud Build:
   ```bash
   gcloud run deploy portfolio-react \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8080
   ```
   *(Note: The `--source .` command automatically uses the `Dockerfile` we provided to build the image in the cloud and deploy it).*

4. **Done!** Cloud Run will provide you with a `.run.app` URL where your site is live. You can later map a custom domain to it in the Cloud Run console.

---

## 🏢 Option 2: Google App Engine (Simplest Approach)
App Engine Standard Environment can natively serve static files without needing Docker. It uses the `app.yaml` file we've created for you.

### Prerequisites
- [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed.

### Steps to Deploy
1. **Login to Google Cloud:**
   ```bash
   gcloud auth login
   ```

2. **Set your GCP Project ID:**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Build your React App locally:**
   ```bash
   npm run build
   ```

4. **Deploy to App Engine:**
   ```bash
   gcloud app deploy app.yaml
   ```
   *You may be prompted to select a region if this is your first time using App Engine on this project.*

5. **Done!** Your app will be live at `https://YOUR_PROJECT_ID.appspot.com`.

---

## 🪣 Option 3: Google Cloud Storage (Static Website Bucket)
You can also host the static files in a Cloud Storage Bucket. However, if you want a custom domain with HTTPS, you are required to set up a Global External Load Balancer, which can be expensive (~$18/month minimum) and complex to configure compared to Cloud Run or App Engine.
