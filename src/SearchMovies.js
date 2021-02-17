import React, { useContext, useState } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from "react-native"
import { auth } from "../firebaseConfig"
import { AuthContext } from "../StateProvider"
import { IconButton, Colors } from 'react-native-paper'
import { SearchBar } from 'react-native-elements'

export default function SearchMovies({ navigation }) {
    const {currentUser} = useContext(AuthContext);
    const [query, setQuery] = useState("");

    return (
        <View style={styles.container}>
            <IconButton style={styles.backButton} icon="chevron-left" color={Colors.white} size={45} onPress={() => navigation.goBack()}/>
            <SearchBar 
                containerStyle={styles.searchBarContainer} 
                platform="ios" 
                cancelButtonTitle="Cancel" 
                cancelButtonProps={{color:"#fff"}}
                placeholder="Search movies and shows"
                onChangeText={e => setQuery(e)}
                value={query}
                onSubmitEditing={() => {Alert.alert(encodeURI(query))}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2784b",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 10
      },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    profileButtonContainer: {
        position: "absolute",
        bottom: 40,
        width: "80%",
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
});