import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";

const imgUrl = "https://image.tmdb.org/t/p/w185";

class ResultBox extends PureComponent {
  render() {
    return (
      <TouchableOpacity 
          onPress={() => {Alert.alert(this.props.item.title ? this.props.item.title : this.props.item.name)}} 
          activeOpacity={1}
        //   style={ styles.touchContainer }
      >
          <View style={styles.resultContainer}>
              {this.props.item.poster_path ? (
                <Image 
                    source={{uri: imgUrl + this.props.item.poster_path}} 
                    style={{ height: 250, width: "100%", resizeMode: "contain"}}
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
      height: '100%',
      backgroundColor: '#C1C1C1',
      justifyContent: 'center',
      alignItems: 'center'
  }
});

export default ResultBox;