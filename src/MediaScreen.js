import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { IconButton, Colors } from 'react-native-paper'

export default function MediaScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <IconButton 
                style={styles.backButton} 
                icon="chevron-left" 
                color={Colors.white} 
                size={45} 
                onPress={() => {
                    // dispatch({
                    //     type: "CLEAR_SEARCHES"
                    // })
                    navigation.goBack();
                }}
            />
            <Text>{'This is the media screen'}</Text>
        </View>
    )
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
});
