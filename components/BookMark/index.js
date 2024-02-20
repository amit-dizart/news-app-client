import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookMarkNews from "./BookMarkNews";
const BookMark = ({ handleBackButton }) => {
  const [bookMarkList, setBookMarkList] = useState([]);
  const [isBookMarkNews, setIsBookMarkNews] = useState(false);
  const [activeIndex, setActiveIndex] = useState();

  const getBookmark = async () => {
    const data = await AsyncStorage.getItem("@bookMarkList");
    const parsedData = data ? JSON.parse(data) : [];
    setBookMarkList(parsedData);
    //console.log(parsedData);
  };
  useEffect(() => {
    getBookmark();
  }, [isBookMarkNews]);

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

  const myItemSeparator = () => {
    return <View style={{ height: 25, marginHorizontal: 10 }} />;
  };
  const BookMarkListComponent = () => {
    return (
      <View style={styles.container}>
        {bookMarkList.length > 0 ? (
          <FlatList
            data={bookMarkList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={myItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setActiveIndex(index);
                  setIsBookMarkNews(true);
                }}
                style={[
                  styles.BookMark,
                  {
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    elevation: 2,
                  },
                ]}
              >
                <Image
                  source={{ uri: item.url_to_image }}
                  style={styles.image}
                />
                <View style={[{ gap: 5, width: "70%" }]}>
                  <Text
                    style={[
                      {
                        fontStyle: "normal",
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: 18,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        width: "75%",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text style={[{ color: "#DBDBDB", fontSize: 12 }]}>
                      {item.published_at}
                    </Text>
                  </View>

                  <Text numberOfLines={2}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
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
    );
  };

  return !isBookMarkNews ? (
    <BookMarkListComponent />
  ) : (
    <BookMarkNews
      currentInedex={activeIndex}
      newsarray={bookMarkList}
      handleBackButton={() => {
        setIsBookMarkNews(false);
      }}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  BookMark: {
    flex: 1,
    flexDirection: "row",
    //alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 120,
    gap: 8,
  },
  content: {
    flex: 4,
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 16,
  },
  image: {
    height: "100%",
    width: "30%",
    borderRadius: 4,
  },
});

export default BookMark;
