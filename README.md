# Skillfinder

### Prerequisites

-   Node.js ([Download](https://nodejs.org/en/))

-   npm ([Docs](https://www.npmjs.com/get-npm))

-   PostgreSQL ([Download/Windows](https://www.postgresql.org/download/) | [Download/MacOS](https://postgresapp.com/))

### Installation

1. Run the installation script:

    ```
    npm install
    ```

2. Run your local PostgreSQL server.

3. Create a database for the project:

    ```
    psql
    CREATE DATABASE skillfinder;
    \q
    ```

4. Create a .env file in the project root directory:

    - The name must be exact.

    - This file will hold environment variables that might be different for each of us.

    - This file will not (and should not) be pushed into GitHub.

5. Put database URI in the `.env` file:

    ```
    DATABASE_URL=postgres://<DATABASE_USERNAME>:<DATABASE_PASSWORD>@localhost:5432/skillfinder
    ```

    - Replace the `DATABASE_URL` with the one your database uses.

    - If you use Postgres for MacOS (Postgres.app), then you can skip setting the password.

    - If you use Postgres for Windows, then the default password should be set to "root".

    - If you named your database different than "skillfinder", change the last bit of the connection URL as well.

6. Put JWT secret in the .env file:

    ```
    JWT_SECRET=<ANY_STRING>
    ```

    - Replace `ANY_STRING` with any secret string.

7. Build the project:

    ```
    npm run build
    ```

8. Start the application:

    ```
    npm start
    ```

    - You can now access the app at http://localhost:8080.

## Available Scripts

-   Start the development server for the client code:

    ```
    npm run client
    ```

    -   It will start a Browsersync process which should open your browser at http://localhost:3000. This is the development representation of the client code, which will refresh on each client code change.

-   Start the API server:

    ```
    npm run server
    ```

    -   It will start an Express server available at http://localhost:8080.

-   Run both servers:

    ```
    npm run dev
    ```

    -   It will run both the development server for the client code and the API server.

-   Build client code:

    ```
    npm run build
    ```

    -   It will compile the development version of the client code into a production version. The output code will appear at the ./client/build directory. The production version of the application will be served at http://localhost:8080.

## Directory Structure

```
    .
    ├── app.js           # Express application
    ├── server.js        # Server instance
    ├── auth             # Auth-related files
    ├── controllers      # Controller functions
    ├── sockets          # WebSockets-related files
    ├── models           # Database models
    ├── data-access      # Data storage files
    ├── routes           # Express subrouters
    ├── constants        # Reusable constants
    ├── utils            # Reusable functions
    ├── client           # UI/Front-end code
    ├── package.json     # Required npm packages
    ├── .env             # Environment variables
    ├── .gitignore       # Files ignored by Git
    ├── .prettierrc      # Prettier configuration
    └── .eslintrc.json   # ESLint configuration
```
