# create the namespace
kubectl create -f ./kubernetes/namespace.yaml

# create the elasticsearch service
kubectl create -f ./kubernetes/service-elasticsearch.yaml

# create the elasticsearch stateful set
kubectl create -f ./kubernetes/statefulset-elasticsearch.yaml

# create the kabana service
kubectl create -f ./kubernetes/service-kibana.yaml

# create the kabana deployment (unofficial image)
kubectl create -f ./kubernetes/deployment-kibana.yaml

# create the extra external elasticsearch service
kubectl create -f ./kubernetes/service-elasticsearch-external.yaml