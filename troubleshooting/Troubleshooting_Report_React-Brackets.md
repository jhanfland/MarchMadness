# Troubleshooting Report

### System Specifications

**Operating System:** MacOS 15.0.1 (Intel)

**Docker** Docker version 27.4.0, build vx6lha

### Problem Description

<!--Explain the problem, what causes it, and what it looks like-->

When we tried to build docker, we would run into this react-brackets problem. We knew there might be an issue since react-brackets uses React17, and the react version that we use in our project is React18. Our first attempt at fixing this was to use "RUN npm install --legacy-peer-deps" in our frontend Dockerfile. This worked for some but didn't for others. We then realized we were missing a dependency react-is, which we added into the required files. We also had to add an extra parameter to the CMD [ ] (dockerfile) and an override in the package.json. 

Here's what it looked like

```shell
 => => naming to docker.io/library/frontend-mm_app-server:latest                                                                        0.0s
[+] Running 2/2g to docker.io/library/frontend-mm_app-server:latest                                                                    19.5s
 ✔ Service server                      Built                                                                                           97.5s 
 ✔ Container frontend-mm_app-server-1  Recreated                                                                                        3.5s 
Attaching to server-1
server-1  | 
server-1  | > frontend-mm_app@0.0.0 dev
server-1  | > vite --host
server-1  | 
server-1  | 
server-1  |   VITE v6.2.0  ready in 768 ms
server-1  | 
server-1  |   ➜  Local:   http://localhost:5173/
server-1  |   ➜  Network: http://172.22.0.2:5173/
server-1  | Error: The following dependencies are imported but could not be resolved:
server-1  | 
server-1  |   react-brackets (imported by /app/src/Pages/Bracket/components/bracket.tsx)
server-1  | 
server-1  | Are they installed?
server-1  |     at file:///app/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:18897:15
server-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
server-1  |     at async file:///app/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:52215:28
```

### Problem Resolution

It ended up being a dependency issue, with some minor isses elsewhere. Next time we need to not just look at the dependency that we think is the problem, but the surrounding dependencies as well. 

### Sources

None, figured it out with myself, Stephen, and Jack (surprised it took this many people but it was genuinely hard to find)
