import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";

const imgUrl = "https://image.tmdb.org/t/p/w185";

class ResultBox extends PureComponent {
  render() {
    return (
      <TouchableOpacity 
          onPress={() => {Alert.alert(this.props.title ? this.props.title : this.props.name)}} 
          activeOpacity={1}
        //   style={ styles.touchContainer }
      >
          <View style={styles.resultContainer}>
              <Image 
                  source={this.props.posterPath ? {uri: imgUrl + this.props.posterPath} : require("../../assets/placeholder.png")} 
                  style={{ height: 250, width: "100%", resizeMode: "contain"}}
              />
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
  backButton: {
      position: "absolute",
      top: 40,
      left: -5
  },
  searchBarContainer: {
      position: "absolute",
      top: 45,
      left: 60,
      width: "83%",
      backgroundColor: "#f2784b",
      borderBottomColor: "transparent",
      borderTopColor: "transparent"
  },
  resultsContainer: {
      marginTop: 130,
      flex: 1, 
      width: "100%",
      alignItems: 'center'
  },
  resultContainer: {
      height: 200, 
      width: 120, 
      flex: 1
  },
  touchContainer: {
      width: '30%',
      height: '40%'
  }
});

export default ResultBox;