### Set your .env files like in front

### Compile and Hot-Reload for Development

```sh
docker-compose up --build
```

### Fined backend container name

```sh
docker ps
```

### Run tests

```sh
docker exec -it <container name> npm run test
```

### Shut down containers after work

```sh
docker-compose down
```
