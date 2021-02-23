import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from "./firebaseConfig";
import { useNavigation } from '@react-navigation/native';

export default function RegisterForm() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const register = e => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                if (result) {
                    result.user.updateProfile({
                        displayName: firstName + " " + lastName
                    });
                    db.collection('users').doc(result.user.uid).set({
                        watched: []
                    });
                }
            }).catch(error => Alert.alert(error.message))
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="First name"
                textContentType="givenName"
                value={firstName}
                autoCorrect={false}
                onChangeText={e => setFirstName(e)}
            />
            <TextInput
                style={styles.input}
                placeholder="Last name"
                textContentType="familyName"
                value={lastName}
                autoCorrect={false}
                onChangeText={e => setLastName(e)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                textContentType="emailAddress"
                value={email}
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={e => setEmail(e)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                textContentType="password"
                secureTextEntry={true}
                value={password}
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={e => setPassword(e)}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={register}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: "#f2784b",
        paddingHorizontal: 20,
        alignContent: "center",
        justifyContent: "center",
        width: "100%"
    },
    input: {
        height: 40,
        backgroundColor: "white",
        opacity: 0.5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    buttonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        height: 40
      },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    }
})