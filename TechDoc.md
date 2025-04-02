# Introduction

This project is a modern, offline-first shopping list application developed using *Next.js, **CouchDB, and **TypeScript*. It replaces the legacy Vue 2 + PouchDB stack with a more scalable and performant React-based architecture.

The app supports offline usage, multi-device synchronization, and a modular design using Radix-based Shadcn UI components. Deployment is managed via *Vercel*, providing a fast CI/CD pipeline and zero-config hosting.

## Flow

1. Browser loads Progressive Web App's resources from the web server. 
2. User interacts with the web app to add shopping lists and list items. 
3. Data is stored locally in PouchDB.
4. PouchDB syncs its data with a remote database.


## Featured technologies

| Layer      | Tech                     |
| ---------- | ------------------------ |
| Frontend   | Next.js (App Router, TS) |
| Backend    | API Routes in Next.js    |
| Database   | Apache CouchDB           |
| Styling    | Tailwind CSS + Shadcn UI |
| Testing    | Jest, Testing Library    |
| Deployment | Vercel                   |

## Key concepts

### Offline First Architecture

- Local state management with syncing to CouchDB
- Lists and items persist offline and update when reconnected
- Changes are versioned using revision-based syncing

### Server Sync

- CouchDB sync is triggered via listenForChanges()
- Live replication ensures updates are available across devices
- Offline status is tracked and reflected in the UI

### Soft Deletion

- Items and lists are marked with deleted: true
- They remain in the DB for syncing and recovery

### UI Architecture

- All components use *Shadcn UI* (Radix + Tailwind)
- Highly customizable and accessible
- Responsive mobile-first layout

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
* The implemented tests can be found [here](https://github.com/TGM-HIT/syt5-gek1051-mobile-application-unemployed/tree/tests/src/test).
* A Documentation of implemented Tests can be found [here](https://github.com/TGM-HIT/syt5-gek1051-mobile-application-unemployed/blob/main/doc/ID3_MH_Offline.md).


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


# **Datastore and Data Synchronization**

The datastore is built on a **document-based NoSQL database** using **CouchDB**, which provides built-in synchronization and replication capabilities. This ensures that data remains consistent across multiple clients, even in distributed environments.

## **Data Storage and Synchronization**

The database employs a **soft deletion strategy** instead of permanently removing documents. When a shopping list or an item is deleted, it is not erased from the database but instead marked with a `"deleted": true` flag. This strategy is used because:

- **Data Integrity** – Ensures that all deletions are properly synchronized across instances.
- **Historical Tracking** – Deleted items remain available for reference and can be restored if necessary.
- **Replication Safety** – Prevents data inconsistencies that may arise during multi-master replication.
- **Conflict Handling** – CouchDB’s conflict resolution mechanisms ensure that deleted records are propagated correctly without inconsistencies.

## **Shopping List Schema**

The Shopping List Schema represents a shopping list entity, including metadata and optional location details.

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

### **What Happens When a Shopping List is Deleted?**
- The `deleted` field is set to `true`, marking it as removed.
- The `updatedAt` timestamp is updated to reflect the deletion.
- The document remains in the database for synchronization and consistency.
- Queries can exclude `deleted: true` documents to prevent them from being displayed.
- The list can be restored by setting `deleted` back to `false`.

## **List Item Schema**

The List Item Schema represents an individual item within a shopping list.

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

### **What Happens When a List Item is Deleted?**
- The `deleted` field is set to `true`.
- The `updatedAt` timestamp is updated.
- The document remains in the database to ensure consistency across replicas.
- Queries exclude `deleted: true` items, so they do not appear in active lists.
- Items can be restored by setting `deleted` to `false`.

## **Why Use Soft Deletion Instead of Hard Deletion?**

- **Synchronization Integrity** – Ensures proper propagation of deletions across all replicas.
- **Data Retention** – Prevents accidental data loss and allows recovery.
- **Historical Tracking** – Maintains a history of deleted lists/items for auditing purposes.
- **Performance Optimization** – Reduces potential conflicts and data inconsistencies in replicated environments.

## **Synchronization Algorithm and Framework**

The datastore relies on **CouchDB’s multi-master replication model**, ensuring seamless data consistency across distributed systems. Key features include:

### **Multi-Master Replication**
- Any node can receive updates, and changes are propagated across all replicas.
- Ensures that data remains available even if one instance goes offline.

### **Optimistic Concurrency Control**
- Each document maintains a **revision history**.
- Changes are merged efficiently without locking mechanisms.

### **Conflict Resolution**
- If conflicting changes occur, CouchDB stores all conflicting versions.
- Application logic determines the correct version.

### **Incremental Updates**
- Only changed documents are replicated.
- Reduces bandwidth and improves performance.

### **Offline-First Support**
- Devices can sync when reconnected, ensuring continuous data availability.

## **Related Documentation:**
- [CouchDB API Documentation](https://docs.couchdb.org/en/stable/api/index.html)
- [CouchDB Replication](https://docs.couchdb.org/en/stable/replication/index.html)
- [CouchDB Conflict Resolution](https://docs.couchdb.org/en/stable/replication/conflicts.html)


# Development Setup

## Clone and install

bash
git clone https://github.com/your-org/shopping-list-next
cd shopping-list-next
npm install

## Create Coubbase Cluster
https://docs.couchbase.com/server/current/manage/manage-nodes/create-cluster.html


## Run dev server

bash
npm run dev


## Environment variables

Create a .env.local with:

env
COUCHDB_URL=http://localhost:5984
COUCHDB_USER=admin
COUCHDB_PASS=********


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
