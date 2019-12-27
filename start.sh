sudo docker build -t pup .

sudo docker run \
    --name PUP \
    -v $(pwd)/screenshot:/app/screenshot \
    --rm -it pup