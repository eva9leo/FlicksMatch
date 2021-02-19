import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { IconButton, Colors } from 'react-native-paper'
import { useStateValue } from './StateProvider';

export default function MediaScreen({ navigation }) {
    const [{ selected }, dispatch] = useStateValue();
    const imgUrl = "https://image.tmdb.org/t/p/original";

    return (
        <View style={styles.container}>
            <IconButton 
                style={styles.backButton} 
                icon="chevron-left" 
                color={Colors.white} 
                size={45} 
                onPress={() => {
                    navigation.goBack();
                }}
            />
            {selected.poster_path ? (
                <Image 
                    source={{uri: imgUrl + selected.poster_path}} 
                    style={{ height: "50%", width: "80%", resizeMode: 'contain'}}
                />
              ) : (
                
                <View style={styles.titleContainer}>
                    <Text 
                    adjustsFontSizeToFit
                    numberOfLines={4}
                    style={styles.titleText}>
                        {selected.title ? selected.title : selected.name}
                    </Text>
                </View>
              )}
            <Text>{selected.title ? selected.title : selected.name}</Text>
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
    titleText: {
        fontSize: 30,
        textAlign: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        width: '80%',
        height: '60%',
        backgroundColor: '#C1C1C1',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
