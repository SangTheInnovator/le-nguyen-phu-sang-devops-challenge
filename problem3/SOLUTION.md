### Troubleshooting steps for high memory usage on NGINX Load Balancer VM.

#### Scenario
You are working as a DevOps Engineer on a cloud-based infrastructure where a virtual machine (VM), running Ubuntu 24.04, with 64GB of storage is under your management. Recently, your monitoring tools have reported that the VM is consistently running at 99% memory usage. This VM is responsible for only running one service - a NGINX load balancer as a traffic router for upstream services.
<br>

#### Step 1: Check what's using memory
**1. Check Overall Memory Usage**
  ````bash
  free -m
  ````
  => If available memory is low, check if it’s used by processes or cache.
  
**2. Find Top Memory-Consuming Processes**
  ```bash
  ps aux --sort=-%mem | head -n 10
  ```
  => If NGINX is at the top, it might be consuming too much memory.
  
**3. Check NGINX Worker Proces Memory Usage**
  ```bash
  ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | grep nginx
  ```
  => If multiple worker processes are consuming high memory, it may be due to too many open connections or misconfiguration.
  
#### Step 2: Identify the root cause & Fix It
##### Possible Issues & How to fix them**

**Issue 1: NGINX Using too much memory (Misconfiguration)**
  - Possible Cause: 
  - Fix:
**Issue 2: High traffic overloading NGINX**
  - Possible Cause: 
  - Fix:
**Issue 3: Memory Leak in NGINX or Caching Issues**
  - Possible Cause: 
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
