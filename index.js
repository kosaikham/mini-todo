import {registerRootComponent} from 'expo';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// to run via Expo
// registerRootComponent(App);

// to build native way
AppRegistry.registerComponent(appName, () => App);
