import React, { useContext } from 'react'
import { View, Text, Button, StyleSheet, Alert } from "react-native"
import { auth } from "../firebaseConfig"
import { AuthContext } from "../StateProvider"

export default function Home() {
    const {currentUser} = useContext(AuthContext);

    const logout = () => {
        if (currentUser) {
            auth.signOut()
        }
    }

    return (
        <View style={styles.container}>
            <Text>This is a home page</Text>
            <Button title={"Log out"} onPress={logout}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2784b",
        width: "100%",
        justifyContent: "center"
    },
});