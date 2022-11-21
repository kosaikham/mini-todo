import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  View,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import {LOCAL_STORAGE_KEY, COLORS} from './../constants';

import Todo from '../components/Todo';

const Home = () => {
  const [appReady, setAppReady] = useState(false);
  const [todoText, onChangeTodoText] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const [todoList, setTodoList] = useState([]);
  const refInput = useRef(null);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  // Fetching data from localStorage
  useEffect(() => {
    // Keep the splash screen visible while we fetch resources
    SplashScreen.preventAutoHideAsync();

    AsyncStorage.getItem(LOCAL_STORAGE_KEY)
      .then(todo => {
        if (todo) {
          setTodoList(JSON.parse(todo));
        }
        setAppReady(true);
      })
      .catch(e => console.log('e ', e))
      .finally(() => setAppReady(true));
  }, []);

  // on update icon click
  const onUpdateClick = ({key, text}, rowMap) => {
    setSelectedTodo(key);
    onChangeTodoText(text);
    if (rowMap[key]) {
      rowMap[key].closeRow();
    }
    refInput.current.focus();
  };

  // utils functions to update local storage
  const updateLocalStorage = updatedTodoList =>
    AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodoList));

  // on cross-line text
  const onCrossLineText = (key, value) => {
    const updatedTodoList = todoList.map(todo => {
      if (todo.key === key) {
        return {
          ...todo,
          isDone: value,
        };
      }
      return todo;
    });
    updateLocalStorage(updatedTodoList).then(() => {
      setTodoList(updatedTodoList);
    });
  };

  // Creating and updating Section
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

    updateLocalStorage(updatedTodoList)
      .then(() => {
        setTodoList(updatedTodoList);
      })
      .catch(e => console.log('e', e))
      .finally(() => {
        setSelectedTodo(0);
        onChangeTodoText('');
      });
  };

  // Delete Section
  const onDeleteConfirm = rowKey => {
    const updatedTodoList = todoList.filter(item => item.key !== rowKey);
    updateLocalStorage(updatedTodoList)
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

  const onDeleteClick = (rowKey, rowMap) => {
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

  // SwipeListView - Rendering Section
  const HiddenItemWithAction = props => {
    const {data, onDelete, rowMap} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableWithoutFeedback
          onPress={() => onUpdateClick(data.item, rowMap)}>
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
              <Ionicons
                name="ios-create-outline"
                size={26}
                color={COLORS.grey}
              />
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
              <Ionicons name="md-trash-outline" size={26} color={COLORS.grey} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderTodo = (data, rowMap) => (
    <Todo data={data} rowMap={rowMap} onCrossLineText={onCrossLineText} />
  );

  const renderHiddenItem = (data, rowMap) => (
    <HiddenItemWithAction
      data={data}
      rowMap={rowMap}
      onDelete={() => onDeleteClick(data.item.key, rowMap)}
    />
  );

  if (!appReady) return null;

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
      <SafeAreaView style={styles.safeAreaView}>
        {Platform.OS === 'ios' ? <StatusBar barStyle="dark-content" /> : null}
        {/* TextInput Section */}
        <View style={styles.inputContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
          </KeyboardAvoidingView>
        </View>

        {/* Todo List Section */}
        {selectedTodo === 0 && todoList.length > 0 ? (
          <SwipeListView
            data={todoList}
            renderItem={renderTodo}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-120}
            disableRightSwipe
          />
        ) : null}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  backBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
  backRightBtnLeft: {
    right: 60,
  },
  backRightBtnRight: {
    right: 0,
  },
  backBtnInner: {
    alignItems: 'center',
  },
});

export default Home;
