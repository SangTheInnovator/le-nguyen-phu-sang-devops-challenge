### Troubleshooting steps for high memory usage on NGINX Load Balancer VM

#### Scenario
You are working as a DevOps Engineer on a cloud-based infrastructure where a virtual machine (VM), running Ubuntu 24.04, with 64GB of storage is under your management. Recently, your monitoring tools have reported that the VM is consistently running at 99% memory usage. This VM is responsible for only running one service - a NGINX load balancer as a traffic router for upstream services.
<br>

#### Step 1: Check what's using memory
##### 1. Check Overall Memory Usage
  ````bash
  free -m
  ````
  - If available memory is low, check if it’s used by processes or cache.
  
##### 2. Find Top Memory-Consuming Processes
  ```bash
  ps aux --sort=-%mem | head -n 10
  ```
  - If NGINX is at the top, it might be consuming too much memory.
  
##### 3. Check NGINX Worker Proces Memory Usage
  ```bash
  ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | grep nginx
  ```
  - If multiple worker processes are consuming high memory, it may be due to too many open connections or misconfiguration.
  
#### Step 2: Identify the root cause & Fix It
##### Possible Issues & How to fix them

##### Issue 1: NGINX Using too much memory (Misconfiguration)
  - Possible Cause: Too many worker processes using excessive memory.
   qqqqqqqq
  - Fix:
    - 1. Edit NGINX Configuration:
         Open the config file:
         ```bash
         sudo nano /etc/nginx/nginx.conf
         ```
         Finding:
         ```
         worker_processes auto;
         worker_connections 1024;
         ```
         - Reduce worker_connections if it's too high.
         - Set worker_processes to auto (it automatically adjusts based on CPU).
    - 2. Restart NGINX
         ```bash
         sudo systemctl restart nginx
         ```
         
##### Issue 2: High traffic overloading NGINX
  - Possible Cause: Too many incoming requests, causing NGINX to hold too many open connections.

  - Fix:
    - 1. Check Real-Time Requests:
         ```bash
         sudo tail -f /var/log/nginx/access.log
         ```
         - If you see too many requests from one IP, it could be a DDoS attack or       misbehaving client.
         
    - 2. Limit connections per IP:
      - Add this in **/etc/nginx/nginx.conf** file:
        ```nginx
        limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
        server {
        location / {
            limit_req zone=one burst=20 nodelay;
          }
        }
        ```
     - Restart NGINX:
        ```bash
        sudo systemctl restart nginx
        ```
##### Issue 3: Memory Leak in NGINX or Caching Issues
  - Possible Cause: A bad NGINX module (like Lua or Proxy Buffers) is consuming memory.
    
  - Fix: 
    
#### Step 3: Validate and Monitoring
After implementing the above fixes, continuosly monitor the memory usage:
```bash
watch -n 5 free -m
```
or use **htop command** for a real-time monitor:
```bash
htop
```
