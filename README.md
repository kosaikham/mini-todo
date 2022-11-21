# Mini-todo app

A small-fast and quick todo app for minimalism people

## Built With

- [React Native](https://facebook.github.io/react-native/) - a JavaScript framework for writing real, natively rendering mobile applications for iOS and Android
- [Expo](https://expo.io/)[Tools] - It allows you to start a project without installing or configuring any tools to build native code - no Xcode or Android Studio installation required

## Demo

Short demo videos can be viewd on the provided google drive link.

## Run it locally

0. install dependencies

```
- npm install
- npx pod-install
```

1. With Expo

```
- uncomment the line "registerRootComponent(App);" from the index.js
- expo start
```

2. Without Expo

```
- uncomment the line "AppRegistry.registerComponent(appName, () => App);" from the index.js
- npx react-native run-android
```

### Disclaimer

- This project was created as a bare react native project and integrated `expo-local-authentication` module. Due to some technical difficulties, there are some pros and cons of running via Expo vs Native way.

1. If project was built via `Expo`, the app is not able to invoke android native custom module in order to setup the pin code. So in order to achieve this, user has to be preset the pin code in the settings page ( in android ). Both IOS and Android can be built.
2. If project was built via `Native way`, user doesn't need to worry about setting up pin code before using the app. The customer native module that I've created can trigger to the system settings and set up the pin code right away. The only downside is that the app is not able to be built on IOS. I believe probably due to my Xcode version, I had difficulties to build the app via `npx react-native run-ios`.

## Acknowledgments

Finally Thanks for the opportunity and hope you can enjoy the app.

## License

This project is licensed under Unlicense license. This license does not require you to take the license with you to your project.
