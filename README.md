# ReactFlow Example

This repo contains an implementation of reactflow with vite and a fastapi backend

## Setup

- Get docker with docker compose ready
- Run `sudo nano /etc/hosts` and add `127.0.0.1 reactflow-example.com` to the file
- Run `docker compose up -d` to start everything, this includes an nginx server, the fastapi backend and the vite frontend
- Visit `http://reactflow-example.com` to see the app