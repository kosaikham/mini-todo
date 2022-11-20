import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  View,
  Alert,
  Text,
  Dimensions,
  StatusBar,
  Platform,
  Button,
  Linking,
} from 'react-native';
import {
  authenticateAsync,
  hasHardwareAsync,
  supportedAuthenticationTypesAsync,
  getEnrolledLevelAsync,
  cancelAuthenticate,
} from 'expo-local-authentication';
// import IntentLauncher, {IntentConstant} from 'react-native-intent-launcher';
import Constants from 'expo-constants';
// import DeviceInfo from 'react-native-device-info';
import * as IntentLauncher from 'expo-intent-launcher';
import BiometricSettingModule from './src/customModules/BiometricSettingModule';

import Home from './src/screen/Home';

const pkg = Constants.manifest.releaseChannel
  ? Constants.manifest.android.package
  : 'host.exp.exponent';
// const pkg = DeviceInfo.getBundleId();

console.log(pkg);

const App = () => {
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [isBiometricSupport, setIsBiometricSupport] = useState(false);
  useEffect(() => {
    (async () => {
      const isHardwareAsync = await hasHardwareAsync();
      setIsBiometricSupport(isHardwareAsync);
      // const result = await authenticateAsync();
      // setIsAuthenticate(result.success);
    })();
  }, []);
  const onAuthenticate = () => {
    authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackLabel: 'Enter Passcode',
    })
      .then(result => {
        if (!result.success) {
          console.log(IntentLauncher.ActivityAction.SECURITY_SETTINGS);
          IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.SECURITY_SETTINGS,
            {data: 'package:' + 'com.todo'},
          )
            .then(r => console.log(r))
            .catch(e => console.log('e', e));
          // Linking.openAppSettings();
          // IntentLauncher.startActivity({
          //   action: 'android.settings.SETTINGS',
          // });
          // cancelAuthenticate()
          //   .then(r => console.log(r))
          //   .catch(e => console.log(e));
          // openAppSettings();
          // getEnrolledLevelAsync().then(level => console.log('level ', level));
          // supportedAuthenticationTypesAsync().then(types =>
          //   console.log('types ', types),
          // );
        } else {
          setIsAuthenticate(result.success);
        }
      })
      .catch(e => console.log('e', e));
  };

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  if (!isAuthenticate) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <Button
          title="Let Me In"
          onPress={() => {
            console.log(BiometricSettingModule);
            BiometricSettingModule.open('sai');
          }}
        />
      </View>
    );
  }
  return (
    <View>
      <Home />
    </View>
  );
};

export default App;
