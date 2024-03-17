# ddMesh

ddMesh is an open marketplace for database services. It allows infrastructure providers to auction their servers, custom databases, and cloud services to developers. 
Developers are given a one click deploy to get a live production database, with flexible pricing charged per second. Infrastructure providers are incentivised to compete with reward mechanism that favor the most performant and efficient database services.

Basically:
> It's like Filecoin but for databases

# Developement

We use [pnpm](https://www.npmjs.com/package/pnpm) as our package manager

You can run the following commands to install dependencies and start the **frontend**
```bash
pnpm install
pnpm dev
```

`pnpm dev` runs a Vite server on `localhost:3000` and will automatically reload when you make changes to the code. 

In addition to the frontend, you must run our daemon at `https://github.com/ethlondon2024/ddmesh-ethlondon-daemon` for full functionality.

The daemon has a rest endpoint that proxies postgres queries to the database provider since frontend apps struggle with sockets and peristent connections

Both the daemon and the frontend run against live contracts deployed to our Orbit Chain, Arbitrum Sepolia, Base, and Celo. Contract addresses are hardcoded against chain ids at [./src/config/contracts.config.ts](./src/config/contracts.config.ts). Currently **our Orbit Chain is the only one gauranteed to be up to date**

## Build

You can run the following command to build
```bash
  pnpm build
```

You can then load dist/index.html in your browser to view the production build of the application on your local device

## Deployment

Deployments are handled by [Vercel](https://vercel.com/dd-mesh/ddmesh-ethlondon-frontend) and are automatically triggered on push to the main branch.

Note that `eslint` is not fully configured in the project. Running `pnpm lint` and `pnpm build` will return errors that your
IDE may not catch. You **must** fix all errors to deploy automatically to Vercel. 

When deployed, you can view the app at https://ddmesh-ethlondon-frontend.vercel.app/

## 
