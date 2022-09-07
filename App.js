import "react-native-gesture-handler";
import "react-native-get-random-values";
import React, { useRef, useState, useEffect } from "react";
import { View, SafeAreaView, Text } from "react-native";
import * as Font from "expo-font";
import MainFlow from "./Navigations/MainFlow";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { LogBox } from "react-native";
import { PersistGate } from "redux-persist/integration/react";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["Setting a timer", "Unhandled promise rejection"]);

import { persistor, store } from "./src/app/store";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";

let customFonts = {
  "SF-Pro-Display-regular": require("./assets/fonts/FontsFree-Net-SFProDisplay-Regular.ttf"),
  "SF-Pro-Display-thin": require("./assets/fonts/FontsFree-Net-SFProDisplay-Thin.ttf"),
  "SF-Pro-Display-semibold": require("./assets/fonts/FontsFree-Net-SFProDisplay-Semibold.ttf"),
  "SF-Pro-Display-light": require("./assets/fonts/FontsFree-Net-SFProDisplay-Light.ttf"),
  "SF-Pro-Display-medium": require("./assets/fonts/FontsFree-Net-SFProDisplay-Medium.ttf"),
  "SF-Pro-Text-regular": require("./assets/fonts/FontsFree-Net-SFProText-Regular.ttf"),
  "Helvetica-Neue-light": require("./assets/fonts/HelveticaNeueLt.ttf"),
  HelveticaNeuBold: require("./assets/fonts/HelveticaNeuBold.ttf"),
  "SF-Pro-Text-semibold": require("./assets/fonts/FontsFree-Net-SFProText-Semibold.ttf"),
  "SF-Pro-Text-medium": require("./assets/fonts/FontsFree-Net-SFProText-Medium.ttf"),
};

export default function App() {
  const [fonts, setFonts] = React.useState(false);


  useEffect(() => {
    async function fetchData() {
      await Font.loadAsync(customFonts).then((res) =>
        console.log("fonts loaded", res)
      );
      setFonts(true);
    }
    fetchData();
  }, []);

  const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: "#3498db",
      accent: "#f1c40f",
    },
  };

  return (
    <Provider store={store} >
      <PersistGate  loading={null} persistor={persistor}>
        <PaperProvider theme={theme} >
          {fonts ? (
            <SafeAreaView
              style={{
                flex: 1,
                
              }}
            >
              <MainFlow />
            </SafeAreaView>
          ) : (
            <AppLoading />
          )}
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
