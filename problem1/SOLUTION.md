Provide your CLI command here:
<br>
jq -r 'select(.symbol==TSLA and .side==sell) | .order_id' ./transaction-log.txt | xargs -I {} curl -s http://localhost:8080/api/{} 
