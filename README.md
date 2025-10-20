# MBT_ETM-T200
The code for MBT ETM T200 code base
This is the tickter style ETM

## How to Run

### Step 1: Clone the Repository
First, clone the repository to your local machine:

```bash
git clone https://github.com/Kai-codin/MBT-Ticketer.git
```

### Step 2: Navigate to the Project Directory
Change to the project directory:

```bash
cd MBT-Ticketer
```

### Step 3: Running Locally
To run the application locally, use the following command:

```bash
npm run serve
```

### Step 4: Running in Production
To build and run the application in a production environment, follow these steps:

1. Build the project:

    ```bash
    npm run build
    ```

2. Start the application using **pm2** (for process management):

    ```bash
    pm2 start npm --name "my-ticketer" -- run serve --watch -- --port=5000 --host=0.0.0.0 --output ~/.pm2/logs/my-ticketer-out.log --error ~/.pm2/logs/my-ticketer-error.log
    ```
