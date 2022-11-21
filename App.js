import React, {useState} from 'react';
import {
  View,
  Text,
  Platform,
  Linking,
  Pressable,
  StyleSheet,
} from 'react-native';
import BiometricSettingModule from './src/customModules/BiometricSettingModule';
import {authenticateAsync} from 'expo-local-authentication';
import Home from './src/screen/Home';

const App = () => {
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  // it will check the authenticate method of the system
  // and prompt the pin code box or redirect to setting page to setup
  const onLogin = () => {
    authenticateAsync()
      .then(r => {
        if (!r.success) {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            BiometricSettingModule.open();
          }
        }
        setIsAuthenticate(r.success);
      })
      .catch(e => null);
  };

  if (!isAuthenticate) {
    return (
      <View style={styles.screenContainer}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Mini - Todo App</Text>
        </View>
        {/* Login Section */}
        <View style={styles.buttonSection}>
          <Pressable style={styles.button} onPress={onLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return <Home />;
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '300',
    color: 'gray',
  },
  titleSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  buttonSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;
