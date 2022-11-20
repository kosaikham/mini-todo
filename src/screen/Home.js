import React, {useEffect, useRef, useState, useCallback} from 'react';
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
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import Todo from '../components/Todo';

const COLORS = {
  red: '#cc0000',
  green: '#4cA64c',
  blue: '#4c4cff',
  white: '#fff',
  grey: '#ddd',
};

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

const Home = () => {
  const [appReady, setAppReady] = useState(false);
  const [todoText, onChangeTodoText] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const [todoList, setTodoList] = useState([]);
  const refInput = useRef(null);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    AsyncStorage.getItem('todoList')
      .then(todo => {
        if (todo) {
          setTodoList(JSON.parse(todo));
        }
        setAppReady(true);
      })
      .catch(e => console.log('e ', e))
      .finally(() => setAppReady(true));
  }, []);

  if (!appReady) return null;

  const onUpdate = ({key, text}, rowMap) => {
    setSelectedTodo(key);
    onChangeTodoText(text);
    if (rowMap[key]) {
      rowMap[key].closeRow();
    }
    refInput.current.focus();
  };

  const onSubmit = () => {
    if (todoText.length === 0) return;
    let updatedTodoList = [];

    if (selectedTodo > 0) {
      updatedTodoList = todoList.map(todo => {
        if (todo.key === selectedTodo) {
          return {text: todoText, key: selectedTodo, isDone: false};
        }
        return todo;
      });
    } else {
      updatedTodoList = [
        ...todoList,
        {text: todoText, key: Date.now(), isDone: false},
      ];
    }

    AsyncStorage.setItem('todoList', JSON.stringify(updatedTodoList))
      .then(() => {
        setTodoList(updatedTodoList);
      })
      .catch(e => console.log('e', e))
      .finally(() => {
        setSelectedTodo(0);
        onChangeTodoText('');
      });
  };

  const onDeleteConfirm = rowKey => {
    const updatedTodoList = todoList.filter(item => item.key !== rowKey);
    AsyncStorage.setItem('todoList', JSON.stringify(updatedTodoList))
      .then(() => {
        setTodoList(updatedTodoList);
      })
      .catch(e => console.log('e', e));
  };

  const onDeleteCancel = (rowKey, rowMap) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const onDelete = (rowKey, rowMap) => {
    Alert.alert('Are you sure you want to delete?', null, [
      {
        text: 'Cancel',
        onPress: () => onDeleteCancel(rowKey, rowMap),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => onDeleteConfirm(rowKey),
      },
    ]);
  };

  const HiddenItemWithAction = props => {
    const {data, onDelete, rowMap} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableWithoutFeedback onPress={() => onUpdate(data.item, rowMap)}>
          <View
            style={[
              styles.backBtn,
              styles.backRightBtn,
              styles.backRightBtnLeft,
              {
                width: 60,
              },
            ]}>
            <View style={styles.backBtnInner}>
              <Ionicons name="ios-create-outline" size={26} color="#D3D3D3" />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onDelete}>
          <View
            style={[
              styles.backBtn,
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                width: 60,
              },
            ]}>
            <View style={styles.backBtnInner}>
              <Ionicons name="md-trash-outline" size={26} color="#D3D3D3" />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  const renderTodo = (data, rowMap) => <Todo data={data} rowMap={rowMap} />;
  const renderHiddenItem = (data, rowMap) => (
    <HiddenItemWithAction
      data={data}
      rowMap={rowMap}
      onDelete={() => onDelete(data.item.key, rowMap)}
    />
  );

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
      <SafeAreaView
        style={{
          marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }}>
        {Platform.OS === 'ios' ? <StatusBar barStyle="dark-content" /> : null}
        <View style={styles.inputContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={styles.input}
                onChangeText={onChangeTodoText}
                value={todoText}
                placeholder="I want to ..."
                placeholderTextColor="#D3D3D3"
                onSubmitEditing={onSubmit}
                ref={refInput}
                maxLength={30}
                autoFocus
              />
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>

        {selectedTodo === 0 && todoList.length > 0 ? (
          <SwipeListView
            data={todoList}
            renderItem={renderTodo}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-120}
            disableRightSwipe
          />
        ) : (
          <TouchableWithoutFeedback onPress={null}>
            <View></View>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    fontWeight: '300',
    borderColor: 'gray',
    width: '100%',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  inputContainer: {
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  emptySpace: {
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
  },
  backBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
  backLeftBtn: {
    alignItems: 'flex-end',
    backgroundColor: COLORS.green,
    paddingRight: 16,
  },
  backRightBtn: {
    // right: 0,
    // alignItems: 'flex-start',
    // paddingLeft: 12,
  },
  backRightBtnLeft: {
    right: 60,
    // backgroundColor: COLORS.blue,
  },
  backRightBtnRight: {
    right: 0,
    // backgroundColor: COLORS.red,
  },
  backBtnInner: {
    alignItems: 'center',
  },
  backBtnText: {
    color: COLORS.white,
    marginTop: 2,
  },
});

export default Home;
