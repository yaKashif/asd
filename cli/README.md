# asd (WIP not ready for use)

CLI to enable deployment of multiple standalone nextjs apps on a single server.

## Usage


On the server

1. install node and npm

```bash
sudo apt install nodejs npm
```

2. install asd

```bash
npm install -g @yakashif/asd
```

3. setup server

```bash
asd server setup -u <username> -p <password>
```



On the client

1. install asd

```bash
npm install -g @yakashif/asd
```

2. create a new nextjs app

3. create a standalone build with docker. [check for instructions](https://github.com/vercel/next.js/tree/canary/examples/with-docker) 

4. create an asd.config.ts at root

```ts
export default {
      domain: "example.com",
};
```

4. go the route of the app and deploy it

```bash
asd client deploy -s <server-url> -u <username> -p <password>
```


