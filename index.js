import { registerRootComponent } from "expo";
import notifee, { AndroidImportance } from '@notifee/react-native';
// symbol polyfills
global.Symbol = require("core-js/es6/symbol");
require("core-js/fn/symbol/iterator");

// collection fn polyfills
require("core-js/fn/map");
require("core-js/fn/set");
require("core-js/fn/array/find");



import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately






registerRootComponent(App);


try {
	const channelId = await notifee.createChannel( {
		id: 'screen_capture',
		name: 'Screen Capture',
		lights: false,
		vibration: false,
		importance: AndroidImportance.DEFAULT
	} );

	await notifee.displayNotification( {
		title: 'Screen Capture',
		body: 'This notification will be here until you stop capturing.',
		android: {
			channelId,
			asForegroundService: true
		}
	} );
} catch( err ) {
	// Handle Error
}
    try {
        await notifee.stopForegroundService();
    } catch( err ) {
        // Handle Error
    };

    notifee.registerForegroundService( notification => {
	return new Promise( () => {

	} );
} );
notifee.registerForegroundService( notification => {
	return new Promise( () => {

	} );
} );
