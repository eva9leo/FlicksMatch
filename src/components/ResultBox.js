import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";

const imgUrl = "https://image.tmdb.org/t/p/w185";
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

class ResultBox extends PureComponent {
  render() {
    return (
      <TouchableOpacity 
          onPress={() => {
              this.props.dispatch({
                  type: "SET_SELECTED",
                  item: this.props.item
              })
              this.props.navigation.navigate("MediaScreen");
            }} 
          activeOpacity={1}
          style={{padding: 2}}
      >
          <View style={styles.resultContainer}>
              {this.props.item.poster_path ? (
                <Image 
                    source={{uri: imgUrl + this.props.item.poster_path}} 
                    style={{ height: screenHeight / 4.63, width: "100%", resizeMode: "contain"}}
                />
              ) : (
                
                <View style={styles.titleContainer}>
                    <Text 
                    adjustsFontSizeToFit
                    numberOfLines={4}
                    style={styles.titleText}>
                        {this.props.item.title ? this.props.item.title : this.props.item.name}
                    </Text>
                </View>
              )}
          </View>
      </TouchableOpacity>
      );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#f2784b",
      width: "100%",
      justifyContent: "center",
      alignItems: "center"
  },
  resultContainer: {
      height: screenHeight / 4.63, 
      width: (screenWidth / 3) - 5, 
      flex: 1,
      justifyContent: 'center'
  },
  titleText: {
      fontSize: 30,
      textAlign: 'center',
      justifyContent: 'center'
  },
  titleContainer: {
      width: '100%',
      height: '95%',
      backgroundColor: '#C1C1C1',
      justifyContent: 'center',
      alignItems: 'center'
  }
});

export default ResultBox;