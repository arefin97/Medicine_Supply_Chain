cd ../first-network/
.bynf.sh down

docker rm -f $(docker ps -aq)

docker rmi -f $(docker images | grep medicine | awk '{print $3}')
