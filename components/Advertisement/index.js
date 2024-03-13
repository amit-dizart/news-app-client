import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const AdvertisementComponent = ({data}) => {
  return (
    <View style={styles.adContainer}>
     <Image
        source={{uri :"https://play-lh.googleusercontent.com/XKpIJApesGkiUv5uDoybpeq3-EAh53KYGRvxheJes7F0x0Qn_Bfqm7RI9jKoexo7UE8" }} // Replace with your ad image source
        // source={require('./path/to/your/advertisement-image.png')} // Replace with your ad image source
        // source={{uri :data?.url_to_image }} 
        style={styles.adImage}
        resizeMode="cover"
      /> 
      <View style={styles.adDetails}>
        <Text style={styles.adDescription}>
          {data?.description || ""}
        </Text>
        {/* You can add more details or customize the advertisement content */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    width : '100%'
    // Add more styling properties as needed
  },
  adImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth : 1,
    borderColor : 'red'
    // Add more styling properties as needed
  },
  adDetails: {
    alignItems : 'center'
  },
  adDescription: {
    fontSize: 16,
    color: '#333333',
    // Add more styling properties as needed
  },
  // Add more styles as needed
});

export default AdvertisementComponent;
