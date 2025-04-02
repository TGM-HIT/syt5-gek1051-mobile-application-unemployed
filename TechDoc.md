[![Build Status](https://travis-ci.org/ibm-watson-data-lab/shopping-list-vuejs-pouchdb.svg?branch=master)](https://travis-ci.org/ibm-watson-data-lab/shopping-list-vuejs-pouchdb)
![IBM Cloud Deployments](https://metrics-tracker.mybluemix.net/stats/4b4ca7dd406587d30b91b8ecff5eaf6b/badge.svg)

# Create an Offline First Shopping List with Vue.js and PouchDB

This code pattern is a reference implementation of an Offline First shopping list app, built as a [Progressive Web App](https://developers.google.com/web/progressive-web-apps/) using [Vue.js](https://vuejs.org/) and [PouchDB](https://pouchdb.com/). [This app is part of a series of Offline First demo apps, each built using a different stack.](https://github.com/ibm-watson-data-lab/shopping-list)

When the reader has completed this Code Pattern and explored the code in this GitHub repository, they will understand how to:

- create a shopping list web application that stores its data in a local PouchDB database.
- turn the web application into a Progressive Web App that works with or without an internet connection.
- make the app sync to and from a remote Cloudant database.

![](doc/source/images/architecture.png)

## Flow

1. Browser loads Progressive Web App's resources from the web server. 
2. User interacts with the web app to add shopping lists and list items. 
3. Data is stored locally in PouchDB.
4. PouchDB syncs its data with a remote IBM Cloudant database.


## Included components

* [Cloudant NoSQL DB](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db): A fully-managed data layer designed for modern web and mobile applications that leverages a flexible JSON schema. Based on the open source Apache CouchDB, IBM Cloudant provides additional full text and geospatial capabilities.

## Featured technologies

* [PouchDB](https://pouchdb.com/) - an in-browser database that can replicate to and from a remote Apache CouchDB or IBM Cloudant database.
* [Next.js](https://nextjs.org/) - The React Framework for the Web.
* [Apache CouchDB](http://couchdb.apache.org/) - modern, document database hosted on your server or in the cloud.

## Key concepts

This shopping list app is a small single page web application consisting of an HTML file, a couple of CSS files, and a single JavaScript file, the Next.js framework, and the PouchDB library. The web page will allow multiple shopping lists to be created (e.g., Groceries, Clothes, etc.) each with a number of shopping list items associated with them (e.g., Bread, Water, etc.).

So what sets this app apart? Its Offline First architecture. The Offline First approach plans for the most constrained network environment first, enabling a great user experience even while the device is offline or has only an intermittent connection, and providing progressive enhancement as network conditions improve. This design also makes the app incredibly performant (fast!) on the best of networks. 

PouchDB, CouchDB, and Service Worker are the primary tools that turn our simple shopping list app into a high performance, offline-capable Progressive Web App.

**Data stays safe on your device, even while it's offline.**
Persistence of shopping lists and item data entered by the user is achieved using the in-browser database PouchDB. This will allow your data to survive between sessions and when disconnected from the network. (Whether you remember that you need juice while you're on your trusty home Wi-Fi or in the middle of the wilderness, you can still add it your list.)

**Data syncs between devices when a connection is available.**
When a connection is available, the data is synced from the local device to a CouchDB database in the cloud, and can thus be shared across multiple devices or users. (Need to share your grocery list with your roommate or access it on both your phone and your laptop? No problem!)

**The app loads quickly, even while offline.**
To keep the app itself functional while offline, a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) is used to cache page resources (the most important HTML, CSS, and JavaScript files) when the web application is first visited. Each device must have a connection for this first visit, after which the app will be fully functional even while offline or in shoddy network conditions. (No more error messages or frustratingly slow page loads.)

**The app can be installed on a mobile device.**
In combination with the Service Worker used for caching, a [manifest file]((https://w3c.github.io/manifest/)) containing metadata allows the app to become a Progressive Web App, an enhanced website that can be installed on a mobile device and can then be used with or without an internet connection. (It's secretly still a website, but you can access it through one of those handy dandy little app icons on your homescreen!)

Explore the code in this GitHub repository to see how the Offline First design is applied.

# Tutorial

Refer to the [tutorial](https://github.com/ibm-watson-data-lab/shopping-list-vuejs-pouchdb/tree/master/tutorial.md) for step-by-step instructions on how to build your own Offline First shopping list Progressive Web App with Vue.js and PouchDB.

# Live demo 

To see this app in action without installing anything, simply visit [https://ibm-watson-data-lab.github.io/shopping-list-vuejs-pouchdb](https://ibm-watson-data-lab.github.io/shopping-list-vuejs-pouchdb/) in a web browser or on your mobile device.


# **Development Environment Setup**  

## **Development Tools**  
### **Integrated Development Environment (IDE)**  
The project was developed using **Typescript Language Server**. This tool was chosen for its extensive support for JavaScript, React, and Jest, as well as its built-in Git integration and debugging tools.  


## **Software Development Tools**  
### **Version Control**  
- **Git** was used for version control, with a remote repository hosted on **GitHub**.  
- The project followed a structured workflow using branches and pull requests to manage changes efficiently.  

### **Dependency Management**  
- The project was built using **Node.js (v18.16.0)** with **npm (v9.5.0)**.  
- Dependencies were installed using:  
  ```bash
  npm install
  ```  

## **Testing Tools**  
### **Jest – Unit Testing**  
- **Jest** was used for testing, providing unit tests and snapshot tests for React components.  
- Test files are stored in the `__tests__` directory and follow the `.test.tsx` naming convention.  
- Tests can be executed with:  
  ```bash
  npm test
  ```  
- Code coverage reports can be generated with:  
  ```bash
  jest --coverage
  ```  

### **Mocking & Snapshot Testing**  
- Jest’s mocking capabilities were utilized to test API calls and simulate dependencies.  
- Snapshot testing was used to ensure UI consistency.

### Example Tests
A Documentation of implemented Tests can be found [here](https://github.com/TGM-HIT/syt5-gek1051-mobile-application-unemployed/tree/main/doc).


## **Deployment**  
The application is deployed using **Vercel**, a cloud platform optimized for frontend frameworks like **Next.js**. Vercel enables seamless deployment, automatic scaling, and CI/CD integration.  

### **Deployment Process**  
1. **Install the Vercel CLI (optional but recommended):**  
   ```bash
   npm install -g vercel
   ```  
2. **Login to Vercel:**  
   ```bash
   vercel login
   ```  
3. **Deploy the application:**  
   ```bash
   vercel
   ```  
4. Follow the CLI prompts to set up the project. Once configured, Vercel will automatically handle future deployments when changes are pushed to the repository.  

### **Ensuring Cross-System Compatibility**  
- **Vercel** abstracts away infrastructure concerns, eliminating deployment inconsistencies.  
- **Environment variables** can be configured through the Vercel dashboard for secure management.  
- **Automatic scaling** ensures the application remains performant without manual intervention.  

### **Related Documentation:**  
- [Vercel Documentation](https://vercel.com/docs)  
- [Deploying Next.js on Vercel](https://nextjs.org/docs/deployment)  

# **API & Technology Documentation**  

This section provides an overview of the key technologies used in this project, explaining their purpose, functionality, and how they contribute to the overall system. It serves as a reference for developers unfamiliar with the stack, including links to official documentation for further exploration.  


## **Next.js – Frontend & API Endpoints**  

**Overview:**  
Next.js is a React-based framework designed for building modern web applications with improved performance, flexibility, and scalability. It provides features such as server-side rendering (SSR), static site generation (SSG), and automatic code splitting, allowing for optimized frontend experiences. Additionally, Next.js enables the creation of API routes within the same project, removing the need for a separate backend server.  

**Key Features:**  
- **File-based Routing:** Pages and API routes are determined by the file structure in the `pages` directory.  
- **API Routes:** The `pages/api` directory allows developers to create backend endpoints that handle HTTP requests.  
- **Performance Enhancements:** Automatic static optimization, image optimization, and built-in lazy loading improve application speed.  
- **Hybrid Rendering:** Supports static and dynamic content generation based on use case requirements.  
- **Styling Support:** Next.js integrates seamlessly with CSS modules, Tailwind CSS, and other styling solutions.  

**Use in This Project:**  
- The frontend is built using Next.js components, ensuring a structured and efficient user interface.  
- API routes handle backend logic within the same repository, simplifying development and deployment.  
- Dynamic rendering techniques improve user experience by optimizing content delivery.  

**Official Documentation:**  
- [Next.js Official Documentation](https://nextjs.org/docs)  


## **CouchDB – Database**  

**Overview:**  
Apache CouchDB is a NoSQL database that stores data in a flexible JSON format and provides a RESTful HTTP API for database interactions. It is designed for scalability and offline-first applications, making it a reliable choice for projects requiring distributed data synchronization and fault tolerance.  

**Key Features:**  
- **RESTful API:** All database operations (CRUD) are performed using standard HTTP requests.  
- **Schema-Free JSON Storage:** Documents are stored as JSON objects, allowing for flexible data structures.  
- **Replication & Synchronization:** CouchDB supports built-in replication across multiple instances for high availability.  
- **Eventual Consistency:** Ensures data integrity even in distributed environments with offline support.  
- **MapReduce Querying:** Enables efficient querying of large datasets using JavaScript-based MapReduce functions.  

**Use in This Project:**  
- CouchDB serves as the primary database, storing and managing application data.  
- API endpoints interact with CouchDB using HTTP requests to fetch, update, and delete documents.  
- Replication features ensure data availability across different environments.  

**Official Documentation:**  
- [CouchDB API Documentation](https://docs.couchdb.org/en/stable/api/index.html)  


## **Shadcn/UI – User Interface Components**  

**Overview:**  
Shadcn/UI is a modern component library built on Radix UI and Tailwind CSS. It provides pre-designed, customizable components that follow best practices for accessibility, responsiveness, and performance. By focusing on flexibility, Shadcn allows developers to maintain a consistent UI while easily adapting components to fit specific project needs.  

**Key Features:**  
- **Prebuilt Components:** Includes buttons, modals, forms, tables, and other common UI elements.  
- **Customization:** Fully editable component code allows for deep customization without vendor lock-in.  
- **Accessibility-First:** Follows best practices for ARIA roles and keyboard navigation.  
- **Tailwind Integration:** Optimized for Tailwind CSS, making styling and layout adjustments simple.  
- **Lightweight & Performant:** Components are designed with minimal dependencies to improve load times.  

**Use in This Project:**  
- Shadcn/UI is used to build a consistent and responsive user interface.  
- The component-based approach allows for modular and reusable UI elements across the application.  
- Accessibility and design best practices improve user experience and interaction quality.  

**Official Documentation:**  
- [Shadcn/UI Documentation](https://ui.shadcn.com/docs)  


## **Jest – Testing Framework**  

**Overview:**  
Jest is a JavaScript testing framework designed for simplicity and efficiency. It is widely used for testing React applications and provides built-in support for assertions, test runners, and mocking. Jest enables developers to write unit tests, integration tests, and snapshot tests to ensure the reliability of their code.  

**Key Features:**  
- **Zero Configuration:** Works out of the box with minimal setup required.  
- **Snapshot Testing:** Captures component render outputs to detect unintended UI changes.  
- **Mocking & Spies:** Supports function and module mocking for isolated testing.  
- **Fast & Parallel Execution:** Runs tests in parallel to speed up execution times.  
- **Code Coverage Reports:** Provides insights into test coverage and untested code paths.  

**Use in This Project:**  
- Jest is used to test frontend components and backend API routes.  
- Snapshot tests help maintain UI consistency by detecting unexpected changes.  
- Unit tests validate key functions and logic to prevent regressions.  

**Official Documentation:**  
- [Jest Official Documentation](https://jestjs.io/docs/getting-started)  

# **Datastore**  

The datastore consists of two main schemas: the **Shopping List Schema** and the **List Item Schema**. These schemas define the structure for storing shopping lists and their corresponding items in a **document-based NoSQL database**.  

## **Data Storage and Synchronization**  

The database uses a **soft deletion** strategy instead of permanently removing documents. When a shopping list or item is deleted, it is not erased from the database but instead marked with a `"deleted": true` flag. This ensures that:  
- **Data integrity is maintained**, and deletions are properly synchronized across all instances.  
- **Deleted items are still available for historical reference** and can potentially be restored if necessary.  
- **Replication mechanisms handle deletions** correctly without causing data inconsistencies.  

## **Shopping List Schema**  

The **Shopping List Schema** represents a shopping list entity, including metadata and optional location details.  

```json
{
  "_id": "string | auto-generated",
  "type": "fixed: 'list'",
  "version": "integer | starts at 1",
  "title": "string | required",
  "checked": "boolean | default false",
  "place": {
    "title": "string | location name",
    "license": "string | null for user-entered",
    "lat": "number | null if not geocoded",
    "lon": "number | null if not geocoded",
    "address": "object | structured address"
  },
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string",
  "deleted": "boolean | default false"
}
```

### **Field Descriptions**  
- **_id** *(string | auto-generated)* – Unique identifier for the shopping list.  
- **type** *(fixed: 'list')* – Identifies the document type.  
- **version** *(integer | starts at 1)* – Tracks versioning of the document.  
- **title** *(string | required)* – Name of the shopping list.  
- **checked** *(boolean | default false)* – Indicates whether the list has been checked off.  
- **place** *(object | optional)* – Location-related details:  
  - **title** *(string)* – Name of the location.  
  - **license** *(string | null)* – License information, null if user-entered.  
  - **lat, lon** *(number | null)* – Geolocation coordinates.  
  - **address** *(object)* – Structured address data.  
- **createdAt** *(ISO8601 string)* – Timestamp when the list was created.  
- **updatedAt** *(ISO8601 string)* – Timestamp when the list was last updated.  
- **deleted** *(boolean | default false)* – Indicates whether the list has been marked as deleted.  

### **What Happens When a Shopping List is Deleted?**  
1. The `"deleted"` field is set to `true`, marking it as removed.  
2. The `"updatedAt"` timestamp is updated to reflect the deletion.  
3. The document remains in the database to ensure consistency during **synchronization and replication**.  
4. Queries can exclude `"deleted": true` documents to hide them from users.  
5. If needed, the list can be restored by setting `"deleted"` back to `false`.  


## **List Item Schema**  

The **List Item Schema** represents an individual item within a shopping list.  

```json
{
  "_id": "string | auto-generated",
  "type": "fixed: 'item'",
  "version": "integer | starts at 1",
  "title": "string | required",
  "category": "string | predefined values",
  "pinned": "string | priority level",
  "details": "string | markdown supported",
  "person": "string | assigned user",
  "checked": "boolean | default false",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string",
  "deleted": "boolean | default false"
}
```

### **Field Descriptions**  
- **_id** *(string | auto-generated)* – Unique identifier for the item.  
- **type** *(fixed: 'item')* – Identifies the document type.  
- **version** *(integer | starts at 1)* – Tracks versioning of the document.  
- **title** *(string | required)* – Name of the item.  
- **category** *(string | predefined values)* – Classification of the item (e.g., "Groceries", "Electronics").  
- **pinned** *(string | priority level)* – Indicates item priority.  
- **details** *(string | markdown supported)* – Additional details about the item.  
- **person** *(string)* – Name of the person assigned to the item.  
- **checked** *(boolean | default false)* – Indicates whether the item has been checked off.  
- **createdAt** *(ISO8601 string)* – Timestamp when the item was created.  
- **updatedAt** *(ISO8601 string)* – Timestamp when the item was last updated.  
- **deleted** *(boolean | default false)* – Indicates whether the item has been marked as deleted.  

### **What Happens When a List Item is Deleted?**  
1. The `"deleted"` field is set to `true`, preventing the item from appearing in regular queries.  
2. The `"updatedAt"` timestamp is updated.  
3. The document remains in the database for **data integrity and synchronization purposes**.  
4. Queries can exclude `"deleted": true` items, so they are no longer visible in the app.  
5. If needed, an item can be restored by resetting `"deleted"` to `false`.  


## **Why Soft Deletion Instead of Hard Deletion?**  
- **Synchronization Integrity** – Ensures that deletions are properly propagated across all devices and database replicas.  
- **Data Retention** – Avoids accidental data loss and allows for recovery if necessary.  
- **Historical Tracking** – Maintains a history of deleted lists/items for auditing purposes.  
- **Performance Optimization** – Prevents unnecessary document deletions that could disrupt references in the database.  

## **Related Documentation:**  
- [CouchDB API Documentation](https://docs.couchdb.org/en/stable/api/index.html)  
- [CouchDB Replication](https://docs.couchdb.org/en/stable/replication/index.html)  
- [CouchDB Conflict Resolution](https://docs.couchdb.org/en/stable/replication/conflicts.html)  



# Sync Algorithm

The datastore uses CouchDB's multi-master replication algorithm to synchronize data across multiple nodes. This ensures that updates can be made on any replica, and conflicts are resolved using a revision-based approach.

Key Features:
* Multi-master replication: Any instance can receive updates, and changes are propagated across all replicas.
* Optimistic concurrency control: Each document maintains a revision history to track changes.
* Conflict resolution: If conflicting changes occur, CouchDB stores all conflicting versions and allows for resolution via application logic.
* Incremental updates: Only changed documents are replicated, reducing bandwidth usage.
* Offline-first support: Devices can sync when reconnected, ensuring data consistency.
* This synchronization method allows seamless data consistency across distributed systems, making it ideal for collaborative shopping lists.


# Steps

Want to check out the end product on your own machine? Follow these steps to deploy your own instance of the shopping list app.

This app can be deployed to IBM Cloud. You can also run this app on your local machine for development purposes using either a local Apache CouchDB instance or an IBM Cloudant service instance from the IBM Cloud Catalog.

* [Deploy to IBM Cloud](#deploy-to-ibm-cloud) **OR** [Run locally](#run-locally)
* [Database and replication setup](#database-and-replication-setup)

## Deploy to IBM Cloud
[![Deploy to IBM Cloud](https://metrics-tracker.mybluemix.net/stats/4b4ca7dd406587d30b91b8ecff5eaf6b/button.svg)](https://bluemix.net/deploy?repository=https://github.com/ibm-watson-data-lab/shopping-list-vuejs-pouchdb)

1. Press the above ``Deploy to IBM Cloud`` button and then click on ``Deploy``.

1. In Toolchains, click on Delivery Pipeline to watch while the app is deployed. Once deployed, the app can be viewed by clicking `View app`.

1. To see the app and services created and configured for this code pattern, use the IBM Cloud dashboard. The app is named `shopping-list-vue-pouchdb` with a unique suffix. The following services are created and easily identified by the `sljsp` prefix:
   * sljsp-CloudantNoSQLDB

## Run locally

> NOTE: These steps are only needed when running locally instead of using the ``Deploy to IBM Cloud`` button.


1. [Clone the repo](#1-clone-the-repo)
1. [Install the prerequisites](#2-install-the-prerequisites)
1. [Run the server](#3-run-the-server)
1. [Create a Cloudant or CouchDB service](#4-create-a-cloudant-or-couchdb-service)

### 1. Clone the repo

Clone the `shopping-list-vuejs-pouchdb` locally. In a terminal, run:

```
$ git clone https://github.com/ibm-watson-data-lab/shopping-list-vuejs-pouchdb
$ cd shopping-list-vuejs-pouchdb
```
### 2. Install the prerequisites

First, install the pre-requisites (we assume you have pre-installed [Node.js](https://nodejs.org/)):

    $ npm install 

### 3. Run the server

This command serves the app at `http://127.0.0.1:8081` and provides basic URL routing for the app:

    $ npm start

### 4. Create a Cloudant or CouchDB service

PouchDB can synchronize with CouchDB and compatible servers. To run and test locally, you can install CouchDB. Alternatively, you can use a hosted Cloudant NoSQL DB service for your remote DB.

#### Installing Apache CouchDB

[Install CouchDB 2.1](http://docs.couchdb.org/en/2.1.0/install/index.html). Instructions are available for installing CouchDB 2.1 on Unix-like systems, on Windows, on Mac OS X, on FreeBSD, and via other methods.

Configure CouchDB for a [single-node setup](http://docs.couchdb.org/en/2.1.0/install/setup.html#single-node-setup), as opposed to a cluster setup. Once you have finished setting up CouchDB, you should be able to access CouchDB at `http://127.0.0.1:5984/`. Ensure that CouchDB is running and take note of your admin username and password.

#### Creating a Cloudant NoSQL DB service

To provision a managed Cloudant NoSQL DB

* Log in to [IBM Cloud](https://console.ng.bluemix.net/).
   > Sign up for an account, if you do not already have one.
* [Provision a Cloudant NoSQL DB _Lite_ plan instance](https://console.bluemix.net/catalog/services/cloudant-nosql-db), which is free.
  > If desired, you can also re-use an existing Cloudant NoSQL DB service instance. (Open the [**Data & Analytics**  resources dashboard](https://console.bluemix.net/dashboard/data) to see a list of pre-provisioned instances that you have access to.) 
 * Open the **Service credentials** tab.
* Add new credentials for this service instance if no credentials have been defined yet.
* View the credentials and note the value of the **url** property, which has the following format: `https://username:password@username-bluemix.cloudant.com`.

Tip: Select the **Manage** tab and click **Launch** to open the Cloudant dashboard and manage the service instance.

## Database and replication setup
1. [Create the remote database](#1-create-the-remote-database)
1. [Enable CORS](#2-enable-cors)
1. [Set the replication target](#3-set-the-replication-target)

### 1. Create the remote database

* Use the Cloudant or CouchDB dashboard to create a database.

* Select the Databases tab on the left and then use the `Create Database` button to create the "shopping-list" database.
The Shopping List app can be used locally before the database exists, but cannot sync until the remote database is completed.

  ![Create the shopping-list database](doc/source/images/create_db.png)

### 2. Enable CORS

* Open the Cloudant or CouchDB dashboard to enable Cross-Origin Resource Sharing (CORS).

* Select the Account Settings (or config) tab and open the **CORS** tab.

* Enable CORS and restrict the domain as needed for security.

  ![Enable CORS](doc/source/images/enable_cors.png)

### 3. Set the replication target

Run the Shopping List app and use the *Settings* form to enter your database URL.
If you use the IBM Cloud Cloudant URL taken from the service credentials as described above, the URL includes user name and password.

Add `/shopping-list` to the URL to connect to the database that you created.

  ![Configure replication target](doc/source/images/replicator.png)




# Using the app

The app allows you to create a shopping list by clicking on the plus sign. Click on the twistie to display list items, add new items, remove items or scratch them off.

![app shopping lists](doc/source/images/app_shopping_lists.png)

When you have not configured your Replication Target or when you are offline, the lists will not sync. One good way to test this is to run two browsers. You can use Chrome and Firefox and have different lists in each.

When you go online and have the database and CORS enabled and the Replication Target is set, the shopping lists will sync. You will then be able to use both lists from either browser.



## Deploying to GitHub Pages

This shopping list app can be deployed to and accessed from GitHub Pages. This app is available to try at [https://ibm-watson-data-lab.github.io/shopping-list-vuejs-pouchdb](https://ibm-watson-data-lab.github.io/shopping-list-vuejs-pouchdb/) without downloading or installing anything because this repository is itself deployed to GitHub Pages.

To make your own custom deployment, you only need the following files:

- `index.html`
- `shoppinglist.js`
- `shoppinglist.css`
- `worker.js`
- `manifest.json`

Create a new GitHub repository containing only the above five files and follow the instructions [here](https://pages.github.com/) on how to publish the files to a GitHub Pages URL.

# Privacy Notice

Refer to [https://github.com/IBM/metrics-collector-service#privacy-notice](https://github.com/IBM/metrics-collector-service#privacy-notice).

## Disabling Deployment Tracking

To disable tracking, simply remove ``require('metrics-tracker-client').track()`` from the ``app.js`` file in the top level directory.


# Links
* [More Shopping List Sample Apps](https://github.com/ibm-watson-data-lab/shopping-list)
* [Offline First](http://offlinefirst.org/)
* [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)
* [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
* [Web App Manifest](https://w3c.github.io/manifest/)
* [PouchDB](https://pouchdb.com/)
* [Apache CouchDB](https://couchdb.apache.org/)
* [IBM Cloudant](https://www.ibm.com/cloud/cloudant)
* [Material Design Guidelines](https://material.io/guidelines/)
* [Vue Material](https://vuematerial.io/)
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)


# License
[Apache 2.0](LICENSE)
