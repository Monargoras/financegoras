import { Welcome } from './Welcome';

export default {
  title: 'Welcome',
};

export const Usage = () => <Welcome dictionary={{ landingPage: { welcome: 'Welcome to Financegoras' } }} />;
