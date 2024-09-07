# Financegoras

Financegoras is a web application that helps users to manage their finances. It is built with Next.js, Mantine, and TypeScript.

![Dashboard](/assets/FinancegorasDashboard.png)

## Features

- **Dashboard** - View your account balance, income, and expenses. Including different charts to visualize your financial data.
- **Transactions** - Add, edit, and delete transactions.
- **Categories** - Manage transaction categories.

## Use locally

- Database needed to run the application is not included in the repository
- To setup SQL database, a MYSQL dump file to setup a new DB correctly is provided in the root directory of the project `financegoras.sql`
- .env file is required to run the application, a sample .env file is provided in the root directory of the project `sample.env`
- Run `yarn install` to install all the dependencies
- Run `yarn dev` to start the application in development mode or `yarn build` to build the application and then `yarn start` to start the application in production mode

## Deploy using Docker

- Database needed to run the application is not included in the repository
- To setup SQL database, a MYSQL dump file to setup a new DB correctly is provided in the root directory of the project `financegoras.sql`
- Environment variables required to run the application, a list of needed variables is provided in the root directory of the project `sample.env`
- Then run the following commands in the project root to deploy the application using Docker:

```bash
# Stop all running containers if needed
docker stop $(docker ps -a -q)
# remove images and cache from disk if needed
docker system prune -a --volumes
```

```bash
docker build -t financegoras .
```

```bash
docker run -p 80:3003 -e DB_URL -e GITHUB_ID -e GITHUB_SECRET -e NEXTAUTH_URL -e NEXTAUTH_SECRET financegoras
```

## Template Features

This mantine nextjs template comes with the following features:

- [PostCSS](https://postcss.org/) with [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Jest](https://jestjs.io/) setup with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## yarn scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
