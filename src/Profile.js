import React, { useContext } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from "react-native"
import { auth } from "./firebaseConfig"
// import { AuthContext } from "./StateProvider"
import { useStateValue } from './StateProvider'
import { IconButton, Colors } from 'react-native-paper'

export default function Profile({ navigation }) {
    // const {currentUser} = useContext(AuthContext);
    const [{ user }, dispatch] = useStateValue();

    const logout = () => {
        if (user) {
            auth.signOut()
        }
    }

    return (
        <View style={styles.container}>
            <Text>{"Hello, " + user?.displayName}</Text>
            <IconButton style={styles.addButton} icon="plus" color={Colors.white} size={45} onPress={() => navigation.navigate("SearchContents")}/>
            <IconButton style={styles.homeButton} icon="home" color={Colors.white} size={45} onPress={() => navigation.navigate("Home")}/>
            <View style={styles.profileButtonContainer}>
                <TouchableOpacity style={styles.buttonContainer} onPress={logout}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
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
    addButton: {
        position: "absolute",
        top: 40,
        right: 5
    },
    homeButton: {
        position: "absolute",
        top: 40,
        left: 5
    }
});