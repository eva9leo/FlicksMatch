import React from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import RegisterForm from "./RegisterForm"
import { IconButton, Colors } from 'react-native-paper'

export default function Register({ navigation }) {
    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.container}>
            <IconButton style={styles.backButton} icon="chevron-left" color={Colors.white} size={35} onPress={() => navigation.goBack()}/>
            <View style={styles.formContainer}>
                <RegisterForm/>
            </View>
        </View>
        </KeyboardAvoidingView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2784b",
        width: "100%",
        justifyContent: "center"
    },
    logo: {
        height: 80,
        width: 80
    },
    logoContainer: {
        alignItems: "center",
        flexGrow: 1,
        justifyContent: "center"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    formContaine: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: -5
    }
});