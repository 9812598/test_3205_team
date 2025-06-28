### Set your .env files in frontend and backend folders like in .env.example files

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
