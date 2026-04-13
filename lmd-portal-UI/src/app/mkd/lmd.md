---
title: "What is LMD and Why do we Need It?"
lastUpdated: "2024-12-31"
type: "documentation"
description: "Why LMD?"
---

## Business Challenge

**Problem Statement:**  
Half of the world’s population lacks access to essential primary healthcare, including treatment for diarrhea, malaria, family planning, and prenatal care. This gap is particularly acute in remote communities, where an estimated two billion people live outside the reach of any healthcare services. The healthcare workforce shortage, already estimated at nearly 18 million people, has been exacerbated by the COVID-19 pandemic.

**Solution Overview:**  
Last Mile Health (LMH) partners with countries to deliver high-quality primary healthcare to millions of rural people through teams of community and frontline health workers. LMH began its work in Liberia’s remote, last-mile communities in 2007. To manage data and reporting needs, the **Last Mile Data Portal (LMD 1.0)** was developed to track LMH’s organizational and programmatic efforts over time and enable data-driven decisions through key performance indicators (KPIs).

However, LMD 1.0 was built with technologies suited for **low-bandwidth** environments, which require extensive programming and are **costly to maintain**. As LMH has evolved into a global organization, the scalability, adaptability, and cost of extending LMD 1.0 have become significant challenges.

**Proposed Solution:**  
To address these challenges, LMH aims to develop a cloud-based next-generation data management platform and portal (Last Mile Data 2.0 - LMD 2.0). This platform will:

- Support diverse data sources and reporting needs.
- Provide analytic capabilities for actionable insights and precise decision-making.
- Deliver a richer user experience with enhanced functionality and extensibility.
- Ensure high data quality for monitoring, evaluation, and learning activities across multiple countries.

---

## Technical Use Case

### Key Focus Areas

1. **Data Migration:**

   - Migrate current LMD 1.0 data and code logic.
   - Use AWS Data Migration Service (DMS) and Schema Conversion Tool.

2. **ETL Pipelines:**

   - Implement using AWS Glue.

3. **Data Reporting Portal:**

   - Backend API services: API Gateway, Lambda functions, EC2 instances with autoscaling behind an Application Load Balancer.
   - Frontend: React app deployed on S3 and CloudFront.
   - Embedded visuals and reports using AWS QuickSight & PowerBI.

4. **Security:**

   - Utilize IAM and AWS Cognito for authentication and authorization.
   - Secured integration with LMH Google AD for authentication

5. **CI/CD Pipelines:**

   - Integrate, build, test, and deploy using CodePipeline, CodeBuild, and CodeDeploy.
   - Infrastructure as Code (IaaC) using AWS Cloud Development Kit (CDK) in Python.

6. **Data Management Platform (DMP):**
   - Data/Application Integration.
   - DataLake using S3.
   - Data Warehouse using Redshift Serverless.

### Desired Outputs

- **Backend:**

  - Data Lake for data staging, disparate data storage, and archivals.
  - Data Warehouse for transformed data storage and reporting.

- **CI/CD Pipelines:**

  - Automate IaaC and application code testing and delivery.

- **User Management:**
  - Authentication and management through Cognito.

---

## Ideal Outcome

- Achieve an optimal combination of automation and manual data upload to ensure efficiency, flexibility, and cost-effectiveness.

---

## Data Overview

- **Sources:** Multiple programs across LMH’s initiatives.
- **Volume:** Estimated at 335GB and expected to grow exponentially.
- **Latency:** Varies by reporting requirements (daily, weekly, monthly, quarterly, annual).

---

## Production Deployment Timeline

- **Estimated Timeline:** 30 months total, with 12 months elapsed and 18 months remaining.
- **Urgency:** Current infrastructure is fragile and error-prone, posing risks in healthcare environments.

---

## Current Technical Environment

- **Architecture:**

  - High-level architecture diagram.
  - VPC and CI/CD diagrams.
  - Infrastructure CDK and ETL CDK pipelines.
  - Data flow diagrams.
  - AWS Org Units and Redshift Serverless diagrams.

- **Non-AWS Products:**
  - **High Priority:**
    - LMD 1.0 MySQL data warehouse (private VPS).
    - OpenFn (ETL tool).
    - DHIS2, ODK, KoBo Collect (data capture).
    - OppiaMobile (AWS RDS).
    - ONA/OpenSRP (community-based health information system).
  - **Medium Priority:**
    - R Studio and Stata (data analysis).
  - **Low Priority:**
    - Syncplicity (file sharing service).

---

## Future Use Cases

- Running R and Stata code in the AWS environment for data cleaning and analysis.
- Integrating data read/write operations with S3.

---
