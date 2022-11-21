import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import {COLORS} from './../constants';

const Todo = props => {
  const {data, onCrossLineText} = props;
  const callFunction = () => {
    onCrossLineText(data.item.key, !data.item.isDone);
  };

  const onSwipeRight = useAnimatedGestureHandler({
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

  const updatedTextStyle = data.item.isDone
    ? {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        color: COLORS.grey,
      }
    : {};

  return (
    <View style={styles.container}>
      {/* text section */}
      <View>
        <PanGestureHandler onGestureEvent={onSwipeRight}>
          <Animated.Text style={[styles.text, updatedTextStyle]}>
            {data.item.text}
          </Animated.Text>
        </PanGestureHandler>
      </View>
      {/* icon section */}
      <View>
        <Ionicons name="menu-outline" size={26} color={COLORS.grey} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 20,
    fontWeight: '300',
  },
});

export default Todo;
