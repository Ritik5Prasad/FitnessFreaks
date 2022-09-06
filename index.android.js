import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
 //the environment is set up appropriately
registerRootComponent(App);
/*
import {AppRegistry} from 'react-native';
import app from './App';

AppRegistry.registerComponent('ritik', () => app);
export default app;
*/