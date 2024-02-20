import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import News from "../News";
import BookMark from "../BookMark";
import Svg, { Path } from "react-native-svg";
import * as Linking from 'expo-linking';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ setAuthentication }) => {
  const [isnews, SetIsNews] = useState(true);
  const [sideBar, SetSideBar] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentNewsContent, setCurrentNewsContent] = useState({})
  const [linkIndex, setLinkIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [appUrl, setAppUrl] = useState('');

  const getData = async () => {
    const value = await AsyncStorage.getItem('@lastRead');
    console.log(value, 'valueee')
    setIndex((prevCounter) => parseInt(value) || 0);
  };

  function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  const initialStart = async () => {
    const url = Linking.createURL('/news', {
      scheme: 'dizart.newsapp',
    });
    setAppUrl(url);
    console.log(url, 'uuuuu')
  };

  useEffect(() => {
    const handleUrl = async (event) => {
      console.log(event);
      if (event && event?.url) {
        const id = getParameterByName('newsId', event?.url);
        if (id) {
          setLinkIndex((prevCounter) => parseInt(id));
          console.log(id, 'id from url')
        }
      }
    };
    Linking.addEventListener('url', handleUrl);

    initialStart(); // Call initialStart to check the URL when the app is not opened from a link

    return () => {
      Linking.removeEventListener('url', handleUrl);
    };
  }, []);


  useEffect(() => {
    if (linkIndex) {
      setIndex((prevCounter) => linkIndex);
    } else {
      getData()
    }
  }, [linkIndex])



  const onShare = async (newsContent = "newss") => {
    try {
      const shareOptions = {
        title: `${currentNewsContent?.title}`,
        message: `${currentNewsContent?.description} \n https://amit-dizart.github.io/news-redirect/?news=${currentNewsContent?.id}`,
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
        <TouchableOpacity
          style={[{ position: "absolute" }, {
            left: 5,
            top: 20,
            paddingRight: 20,
            height: 30,
            width: 60
          }]}
          onPress={() => SetSideBar(true)}
        >
          <View style={[{ position: "absolute", left: 10, top: 5 }]}>
            <Svg width="18" height="16" viewBox="0 0 18 16" fill="none">
              <Path
                d="M0 0H18V2H0V0ZM0 7H12V9H0V7ZM0 14H18V16H0V14Z"
                fill="#30223E"
              />
            </Svg>
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>Newsapp</Text>
      </View>

      {/* News */}
      <View style={styles.mainPage}>
        {isnews ? (
          <News
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            setCurrentNewsContent={setCurrentNewsContent}
            linkIndex={index}
          />
        ) : (
          <BookMark
            handleBackButton={() => {
              SetIsNews(true);
            }}
          />
        )}
      </View>

      {/* footer */}
      <View style={styles.pageOption}>
        <TouchableOpacity
          onPress={() => {
            if (isnews) {
              onShare("currentNewsContent")
            } else {
              SetIsNews(true)
            }
          }}
          style={[styles.options, isnews && styles.selectedOption]}
        >
          {isnews ? (
            <View>
              <Svg width={22} height={20} viewBox="0 0 19 20" fill="none">
                <Path
                  d="M11.576 15.271L6.46596 12.484C5.97545 12.9709 5.35177 13.3017 4.67355 13.4346C3.99532 13.5676 3.29292 13.4968 2.65488 13.2311C2.01685 12.9654 1.47175 12.5168 1.08831 11.9418C0.704863 11.3668 0.500244 10.6911 0.500244 9.99999C0.500244 9.30886 0.704863 8.63319 1.08831 8.05818C1.47175 7.48317 2.01685 7.03455 2.65488 6.76889C3.29292 6.50322 3.99532 6.43241 4.67355 6.56536C5.35177 6.69832 5.97545 7.02909 6.46596 7.51599L11.576 4.72899C11.4007 3.90672 11.5273 3.04885 11.9326 2.31224C12.3378 1.57563 12.9947 1.00952 13.7831 0.717422C14.5714 0.425324 15.4386 0.426763 16.226 0.721475C17.0134 1.01619 17.6683 1.58448 18.0712 2.32243C18.474 3.06037 18.5977 3.91866 18.4197 4.74034C18.2418 5.56202 17.7739 6.29218 17.1019 6.79729C16.4298 7.3024 15.5983 7.54871 14.7596 7.49119C13.9208 7.43366 13.1308 7.07613 12.534 6.48399L7.42396 9.27099C7.52589 9.75164 7.52589 10.2483 7.42396 10.729L12.534 13.516C13.1308 12.9238 13.9208 12.5663 14.7596 12.5088C15.5983 12.4513 16.4298 12.6976 17.1019 13.2027C17.7739 13.7078 18.2418 14.438 18.4197 15.2596C18.5977 16.0813 18.474 16.9396 18.0712 17.6776C17.6683 18.4155 17.0134 18.9838 16.226 19.2785C15.4386 19.5732 14.5714 19.5747 13.7831 19.2826C12.9947 18.9905 12.3378 18.4243 11.9326 17.6877C11.5273 16.9511 11.4007 16.0933 11.576 15.271Z"
                  fill="#E97777"
                />
              </Svg>
            </View>
          ) : (
            <Svg
              width="22"
              height="22"
              viewBox="0 0 20 22"
              fill="#30223E"
              class="w-6 h-6"
            >
              <Path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <Path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </Svg>
          )}

          {isnews ? (
            <TouchableOpacity>
              <Text style={[{ color: "#E97777" }]}>Share</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[{ color: "#30223E" }]}>Home</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => SetIsNews(false)}
          style={[styles.options, !isnews && styles.selectedOption]}
        >
          <View style={[{ position: "relative" }]}>
            {!isnews ? (

              <Svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                <Path
                  d="M15 19L8 14L1 19V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H13C13.5304 1 14.0391 1.21071 14.4142 1.58579C14.7893 1.96086 15 2.46957 15 3V19Z"
                  fill="#E97777"
                  stroke="#E97777"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>

            ) : (
              <Svg width="17" height="20" viewBox="0 0 17 20" fill="none">
                <Path
                  d="M15.5 19L8.5 14L1.5 19V3C1.5 2.46957 1.71071 1.96086 2.08579 1.58579C2.46086 1.21071 2.96957 1 3.5 1H13.5C14.0304 1 14.5391 1.21071 14.9142 1.58579C15.2893 1.96086 15.5 2.46957 15.5 3V19Z"
                  stroke="#30223E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            )}
          </View>
          <Text style={!isnews ? [{ color: "#E97777" }] : ""}>Bookmark</Text>
        </TouchableOpacity>
        <View
          style={[
            {
              borderWidth: 2,
              borderColor: "#E97777",
              position: "absolute",
              width: "33.33%",
              ...(isnews ? { left: 31 } : { right: 31 }),
              top: 0,
              borderBottomEndRadius: 4,
              borderBottomStartRadius: 4,
            },
          ]}
        ></View>
      </View>
      {/* sideBar */}
      {sideBar && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarcontent}>

            <TouchableOpacity
              onPress={() => {
                SetSideBar(false);
                SetIsNews(true);
              }}
              style={styles.sidebaroptions}
            >
              <Svg width="20" height="20" viewBox="0 0 22 21" fill="none">
                <Path
                  d="M19 19.0001C19 19.5524 18.5523 20.0001 18 20.0001H4C3.44772 20.0001 3 19.5524 3 19.0001V10.0001H0L10.3273 0.611618C10.7087 0.264877 11.2913 0.264877 11.6727 0.611618L22 10.0001H19V19.0001ZM10 12.0001V18.0001H12V12.0001H10Z"
                  fill="none"
                  strokeWidth={1.9}
                  stroke="#30223E"
                />
              </Svg>

              <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                SetSideBar(false);
                SetIsNews(false);
              }}
              style={styles.sidebaroptions}
            >
              <Svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                strokeWidth={2}
                fill="none"
              >
                <Path
                  d="M15.5 19L8.5 14L1.5 19V3C1.5 2.46957 1.71071 1.96086 2.08579 1.58579C2.46086 1.21071 2.96957 1 3.5 1H13.5C14.0304 1 14.5391 1.21071 14.9142 1.58579C15.2893 1.96086 15.5 2.46957 15.5 3V19Z"
                  stroke="#30223E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
              <Text>BookMark</Text>
            </TouchableOpacity>
            <View style={styles.sidebaroptions}>
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M17 20H3C1.34315 20 0 18.6569 0 17V1C0 0.44772 0.44772 0 1 0H15C15.5523 0 16 0.44772 16 1V13H20V17C20 18.6569 18.6569 20 17 20ZM16 15V17C16 17.5523 16.4477 18 17 18C17.5523 18 18 17.5523 18 17V15H16ZM14 18V2H2V17C2 17.5523 2.44772 18 3 18H14ZM4 5H12V7H4V5ZM4 9H12V11H4V9ZM4 13H9V15H4V13Z"
                  fill="#30223E"
                />
              </Svg>
              <Text>Terms & Conditions</Text>
            </View>
            <View style={styles.sidebaroptions}>
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M11 7V2H2V18H8.0563C8.3838 18.4171 8.7803 18.7847 9.236 19.0848L10.626 20H0.9934C0.44495 20 0 19.556 0 19.0082V0.9918C0 0.45531 0.4487 0 1.00221 0H11.9968L18 6V7H11ZM9 9H18V14.949C18 15.9397 17.4987 16.8648 16.6641 17.4144L13.5 19.4978L10.3359 17.4144C9.5013 16.8648 9 15.9397 9 14.949V9ZM11 14.949C11 15.2652 11.1616 15.5634 11.4358 15.744L13.5 17.1032L15.5642 15.744C15.8384 15.5634 16 15.2652 16 14.949V11H11V14.949Z"
                  fill="#30223E"
                />
              </Svg>
              <Text>Privacy Policy</Text>
            </View>

            {/* <TouchableOpacity style={styles.sidebaroptions}
              onPress={async () => {
                await clearData();
                setAuthentication(false)
                showToast('success', "Logged out succesfully 😊")
              }}
            >
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M11 7V2H2V18H8.0563C8.3838 18.4171 8.7803 18.7847 9.236 19.0848L10.626 20H0.9934C0.44495 20 0 19.556 0 19.0082V0.9918C0 0.45531 0.4487 0 1.00221 0H11.9968L18 6V7H11ZM9 9H18V14.949C18 15.9397 17.4987 16.8648 16.6641 17.4144L13.5 19.4978L10.3359 17.4144C9.5013 16.8648 9 15.9397 9 14.949V9ZM11 14.949C11 15.2652 11.1616 15.5634 11.4358 15.744L13.5 17.1032L15.5642 15.744C15.8384 15.5634 16 15.2652 16 14.949V11H11V14.949Z"
                  fill="#30223E"
                />
              </Svg>
              <Text>Log Out</Text>
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity
            style={styles.sidebarclose}
            onPress={() => SetSideBar(false)}
          ></TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: " #F5F5F5",
  },
  header: {
    marginTop: "5%",
    paddingVertical: 20,
    paddingHorizontal: 19,
    flexDirection: "row",
    color: "#30223E",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#FAFBFC",
    zIndex: 2
  },
  mainPage: {
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    height: '80%'
  },
  pageOption: {
    flexDirection: "row",
    position: 'absolute',
    bottom: 0
  },
  options: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  selectedOption: {},
  text: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 24,
  },
  sidebar: {
    position: "absolute",
    width: "100%",
    height: "100%",
    //backgroundColor: "white",
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    zIndex: 3
  },
  sidebarcontent: {
    width: "60%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: 50,
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
  sidebarclose: {
    width: "40%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.5,
  },
  sidebaroptions: {
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
    gap: 18,
  },
});

export default Home;
