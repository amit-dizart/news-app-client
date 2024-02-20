import React, { useState, useEffect, useLayoutEffect } from "react";
import { useFonts } from "expo-font";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewsPage = (props) => {
  let translateValue = 0;
  const newsData = props.newsData;
  // console.log('this is the news data', newsData);
  const [isBookMarked, setIsBookMrked] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    Raleway: require("../../assets/Fonts/Raleway.ttf"),
    perpeta: require("../../assets/Fonts/perpeta.ttf"),
  });

  const getBookmark = async () => {
    const data = await AsyncStorage.getItem("@bookMarkList");
    const parsedData = data ? JSON.parse(data) : [];
    const marked = parsedData.find((item) => item.id === newsData.id);
    marked ? setIsBookMrked(true) : setIsBookMrked(false);
  };
  useLayoutEffect(() => {
    getBookmark();
  }, [newsData]);

  const addBookmark = async (item) => {
    try {
      const data = await AsyncStorage.getItem("@bookMarkList");
      const parsedData = data ? JSON.parse(data) : [];
      parsedData.push(item);
      await AsyncStorage.setItem("@bookMarkList", JSON.stringify(parsedData));
      setIsBookMrked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeBookmark = async (id) => {
    try {
      const data = await AsyncStorage.getItem("@bookMarkList");
      const parsedData = data ? JSON.parse(data) : [];
      const filteredData = parsedData.filter((item) => item.id !== id);
      await AsyncStorage.setItem("@bookMarkList", JSON.stringify(filteredData));
      setIsBookMrked(false);
      if (props.handleBookMark) {
        props.handleBookMark();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ).start();
  }, [animation]);

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  if (!fontsLoaded) {
    return null;
  }
  console.log('this is the loading', isLoading);
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        borderRadius: 10,
        height: "70%",
        paddingTop : 10,
        marginTop : 5
      }}
    >
      <Image
        source={{ uri: newsData.url_to_image }}
        style={{ ...styles.imageStyle }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onLoad={() => setIsLoading(false)}
      />

      {isLoading && (
        <Animated.View
          style={[
            styles.imageStyle,
            { opacity: opacity },
            { backgroundColor: "#c9c9c9" },
            { position: "absolute" },
            { left: 10 },
            { top: 10 },
          ]}
        />
      )}

      <Text style={{ ...styles.title }}>{newsData.title}</Text>
      <Text style={{ ...styles.content }}>{newsData.description}</Text>

      <ImageBackground
        style={styles.footer}
        blurRadius={60}
        source={{ uri: newsData.url_to_image }}
      >
        <TouchableOpacity onPress={() => Linking.openURL(newsData.url)}>
          <Text style={{ ...styles.footerurl }}>
            {newsData.content.slice(0, newsData.content.indexOf("["))}
          </Text>
          <Text style={{ ...styles.more }}>Tap on know more</Text>
        </TouchableOpacity>
      </ImageBackground>
      {isBookMarked ? (
        <TouchableOpacity
          style={styles.bookmark}
          onPress={() => removeBookmark(newsData.id)}
        >
          <Svg
            width="14"
            height="16"
            viewBox="0 0 12 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M10.6666 13L5.99998 9.66667L1.33331 13V2.33333C1.33331 1.97971 1.47379 1.64057 1.72384 1.39052C1.97389 1.14048 2.31302 1 2.66665 1H9.33331C9.68694 1 10.0261 1.14048 10.2761 1.39052C10.5262 1.64057 10.6666 1.97971 10.6666 2.33333V13Z"
              fill="#E97777"
              stroke="#E97777"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.bookmark}
          onPress={() => addBookmark(newsData)}
        >
          <Svg
            width="14"
            height="16"
            viewBox="0 0 12 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M10.6667 13L6.00004 9.66667L1.33337 13V2.33333C1.33337 1.97971 1.47385 1.64057 1.7239 1.39052C1.97395 1.14048 2.31309 1 2.66671 1H9.33337C9.687 1 10.0261 1.14048 10.2762 1.39052C10.5262 1.64057 10.6667 1.97971 10.6667 2.33333V13Z"
              stroke="#E97777"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NewsPage;

const styles = StyleSheet.create({
  description: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 16,
    paddingHorizontal: 15,
    paddingTop: 16,
    color: "#30223E",
    fontFamily: "perpeta",
  },
  content: {
    fontSize: 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    color: "black",
    fontFamily: "perpeta",
  },
  footer: {
    opacity: 0.6,
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#303234",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    fontFamily: "perpeta",
    borderBottomLeftRadius : 10,
    borderBottomRightRadius : 10

  },

  footerurl: {
    fontSize: 15,
    color: "white",
    paddingHorizontal: 10,
    fontFamily: "perpeta",
  },
  more: {
    fontSize: 14,
    color: "white",
    paddingTop: 4,
    paddingHorizontal: 20,
    fontFamily: "perpeta",
  },
  imageStyle: {
    height: "35%",
    alignSelf: "center",
    width: "95%",
    paddingTop: 40,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
    borderRadius : 10
  },
  bookmark: {
    position: "absolute",
    right: 16,
    top: 185,
    width: 34,
    height: 34,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.88,
    shadowRadius: 8,
    elevation: 2,
  },
});
