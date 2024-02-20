import React, { useState, useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  PanResponder,
  Dimensions,
  ActivityIndicator,
  Linking,
  BackHandler,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewsPage from "../NewsPage";
const BookMarkNews = ({ currentInedex, newsarray, handleBackButton }) => {
  const [activeIndex, setActiveIndex] = useState(currentInedex);
  const [news, setNews] = useState(newsarray);
  const pan = useRef(new Animated.ValueXY()).current;
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const onSwipeUp = () => {
    if (activeIndex >= news.length - 1) {
      setActiveIndex(news.length - 1);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  const onSwipeDown = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(activeIndex);
    }
  };
  const onSwipeLeft = () => {
    return Linking.openURL(news[activeIndex].url);
  };

  //Handle Animation
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dy: pan.y,
      },
    ]),
    onPanResponderRelease: (evt, gestureState) => {
      const { dy, vy } = gestureState;
      const isSwipeUp = dy < -50 && vy < -0.7;
      const isSwipeDown = dy > 50 && vy > 0.7;
      const isSwipeLeft = gestureState.dx < -50;

      if (isSwipeUp) {
        onSwipeUp();
        if (activeIndex < news.length - 1) {
          pan.setValue({ x: 0, y: SCREEN_HEIGHT });
        } else {
          pan.setValue({ x: 0, y: 30 });
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      } else if (isSwipeDown) {
        onSwipeDown();
        if (activeIndex > 0) {
          pan.setValue({ x: 0, y: -SCREEN_HEIGHT });
        } else {
          pan.setValue({ x: 0, y: -30 });
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      } else if (isSwipeLeft) {
        onSwipeLeft();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  //updating bookmark list when bookmark is deleted
  const OnDeleteBookMark = (index) => {
    console.log(activeIndex);
    const temp = [...news];
    temp.splice(index, 1);
    console.log(temp);
    if (index > 0) {
      setActiveIndex(index - 1);
    }
    setNews(temp);
    console.log(temp.length, index);
  };

  //Backhandel
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBackButton();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View
      style={[
        {
          width: "100%",
          height: "100%",
        },
        {
          shadowColor: "#000",
          shadowOffset: {
            width: -5,
            height: 5,
          },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 5,
        },
      ]}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          pan.getTranslateTransform(),
          {
            width: "100%",
            height: "100%",
          },
        ]}
      >
        <View style={styles.page}>
          {news.length > 0 ? (
            <NewsPage
              newsData={news[activeIndex]}
              handleBookMark={() => OnDeleteBookMark(activeIndex)}
            />
          ) : (
            <View
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No BookMark</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default BookMarkNews;

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    height: 100,
  },
  footerurl: {
    fontSize: 40,
    color: "black",
  },
  loading: {
    textAlign: "center",
    fontSize: 25,
    color: "Black",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
