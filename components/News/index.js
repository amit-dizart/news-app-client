import React, { Component, useState, useEffect, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Linking,
  ActivityIndicator,
  PanResponder,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import NewsPage from "../NewsPage";
import AdvertisementComponent from "../Advertisement";

const News = ({ activeIndex, setActiveIndex, setCurrentNewsContent, linkIndex }) => {
  //Handle Last read
  //http://142.93.223.110:3001

  /*
  Always Use hosted URL or localhost URL which is redirected by ngrok..
  */
  const BASEURL = "http://13.200.206.96:5001";
  const [oldNews, setOldNews] = useState(linkIndex);
  const [news, setNews] = useState([])
  const [length, setLength] = useState(0);
  const [swipeCounter, setSwipeCounter] = useState(0);
  //Handle Animation
  const pan = useRef(new Animated.ValueXY()).current;
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@lastRead", `${value}`);
    } catch (e) {
      console.log("error while storing");
    }
  };


  // useEffect(() => {
  //   getData();
  // }, [linkIndex]);


  const getNewsData = async (index) => {
    try {
      console.log(index, ' is id')
      const response = await fetch(`${BASEURL}/news?id=${index}`);
      const data = await response.json();
      setNews((prevNews) => {
        if (linkIndex) {
          return data?.userNews.concat(prevNews);
        } else {
          return prevNews.concat(data?.userNews);
        }
      });
      
      setCurrentNewsContent((prevContent) => data?.userNews[0]);
      setOldNews((prevContent) => parseInt(data?.userNews[0]?.id));
      storeData(data?.userNews[0]?.id)
    } catch (error) {
      console.log("error : ", error);
    }
  };
  //Get newsData
  useEffect(() => {
    if (linkIndex) {
      getNewsData(linkIndex)
    } else if (oldNews != undefined && (activeIndex == 0 || activeIndex % 50 == 0)) {
      getNewsData(linkIndex)
    }
  }, [linkIndex, activeIndex]);

  //Handle Swipe
  const onSwipeUp = () => {
    if (activeIndex > news.length - 1 && oldNews > news.length - 1) {
      storeData(oldNews);
      setCurrentNewsContent(news[activeIndex])
      setActiveIndex(activeIndex);
    } else {
      storeData(1 + oldNews);
      setActiveIndex(activeIndex + 1);
      setCurrentNewsContent(news[activeIndex + 1])
      setSwipeCounter((prevCounter) => prevCounter + 1);
    }
  };

  const onSwipeDown = () => {
    if (activeIndex > 0) {
      storeData(oldNews - 1);
      setActiveIndex(activeIndex - 1);
      setCurrentNewsContent(news[activeIndex - 1]);
    } else {
      storeData(oldNews);
      setActiveIndex(activeIndex);
      setCurrentNewsContent(news[activeIndex]);
    }
  };
  const onSwipeLeft = () => {
    return Linking.openURL(news[activeIndex].url);
  };

  //Handle Animation
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dy: pan.y,
        },
      ], {
      useNativeDriver: false
    }
    ),
    onPanResponderRelease: (evt, gestureState) => {
      const { dy, vy } = gestureState;
      const isSwipeUp = dy < -50 && vy < -0.7;
      const isSwipeDown = dy > 50 && vy > 0.7;
      const isSwipeLeft = gestureState.dx < -50;

      if (isSwipeUp) {
        onSwipeUp();
        pan.setValue({ x: 0, y: SCREEN_HEIGHT });
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      } else if (isSwipeDown) {
        onSwipeDown();
        if (activeIndex > 0) {
          pan.setValue({ x: 0, y: -SCREEN_HEIGHT });
        } else {
          pan.setValue({ x: 0, y: 0 });
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

  // useEffect(() => {
  //   console.log(activeIndex);
  // }, [activeIndex]);

  return (
    <View
      style={[
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
          {news[activeIndex]?.content ? (
            <NewsPage newsData={news[activeIndex || 0]} />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#999999" />
            </View>
          )}
          {/* {swipeCounter >= 5 && <AdvertisementComponent />} */}
        </View>
      </Animated.View>
    </View>
  );
};

export default News;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    height: Dimensions.get("window").height - 100,
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
