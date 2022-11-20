import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedReaction,
  runOnJS,
  setHeaderExpanded,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const COLORS = {
  red: '#cc0000',
  green: '#4cA64c',
  blue: '#4c4cff',
  white: '#fff',
  grey: '#ddd',
};

const Todo = props => {
  const [hasDone, setHasDone] = useState(false);
  const {data} = props;
  const callFunction = () => {
    setHasDone(!hasDone);
  };

  const test = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = event.absoluteX;
    },
    onActive: () => {},
    onEnd: (event, context) => {
      if (event.absoluteX - context.translateX > 30) {
        runOnJS(callFunction)();
      }
    },
  });
  // console.log('test ', test);

  return (
    <View style={[styles.rowFront]}>
      <View
        style={{
          width: windowWidth - 80,
        }}>
        <PanGestureHandler onGestureEvent={test}>
          <Animated.Text
            style={[
              {
                fontSize: 20,
                fontWeight: '300',
              },
              hasDone
                ? {
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    color: '#D3D3D3',
                  }
                : {},
            ]}>
            I am {data.item.text} in a SwipeListView
          </Animated.Text>
        </PanGestureHandler>
      </View>
      <View
        style={{
          marginLeft: 10,
        }}>
        <Ionicons name="menu-outline" size={26} color="#D3D3D3" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowFront: {
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    paddingHorizontal: 30,
  },
});

export default Todo;
