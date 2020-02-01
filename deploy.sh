# Build images
docker build -t ryanwolfsr/multi-client:latest -t ryanwolfsr/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t ryanwolfsr/multi-server:latest -t ryanwolfsr/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t ryanwolfsr/multi-worker:latest -t ryanwolfsr/multi-worker:$SHA -f ./worker/Dockerfile ./worker

# Push to docker hub #SHA allows for easier updates. It essentially gives a "version" number for the image name in KUBE
docker push ryanwolfsr/multi-client:latest
docker push ryanwolfsr/multi-server:latest
docker push ryanwolfsr/multi-worker:latest

docker push ryanwolfsr/multi-client:$SHA
docker push ryanwolfsr/multi-server:$SHA
docker push ryanwolfsr/multi-worker:$SHA

# Build kubernetes files
kubectl apply -f k8s

# Set image deployment
kubectl set image deployments/client-deployment client=ryanwolfsr/multi-client:$SHA
kubectl set image deployments/server-deployment server=ryanwolfsr/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=ryanwolfsr/multi-worker:$SHA