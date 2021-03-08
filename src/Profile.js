import React, { useCallback, useState } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, SafeAreaView, FlatList } from "react-native"
import { auth } from "./firebaseConfig"
import { useStateValue } from './StateProvider'
import { IconButton, Colors } from 'react-native-paper'
import ResultBox from './components/ResultBox'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view';
import TransitionView from './components/TransitionView';
import { CompareDates, ReversedCompareDates } from './helpers';

export default function Profile({ navigation }) {
    const flatListRef = React.useRef()
    const [{ user, firstname, lastname, unsubscribe, shows, movies, reverseOrder, showRecommendations, movieRecommendations }, dispatch] = useStateValue();

    // const [scrollHeight, setScrollHeight] = useState(0);
    // const [contentHeight, setContentHeight] = useState(0);

    // const onContentHeightChange = (ContentWidth, ContentHeight) => {
    //     setContentHeight(ContentHeight)
    // }

    const logout = () => {
        if (user) {
            // unsubscribe();
            dispatch({type: 'SET_READY'})
            dispatch({type: 'CLEAR_CONTENT'})
            auth.signOut()
        }
    }

    const keyExtractor = useCallback((item) => item.id.toString(), []);
    const renderItem = useCallback(
        ({ item, index }) => 
        <TransitionView index={ index }>
            <ResultBox item={item} navigation={ navigation } dispatch={ dispatch } />
        </TransitionView>
        , []
    );
    
    console.log(movieRecommendations)
    return (
        <View style={styles.container}>
            {/* <Text>{"Hello, " + firstname + " " + lastname }</Text> */}
            {/* <Text>{"Movies: " + movies}</Text>
            <Text>{"TV shows: " + shows}</Text> */}
            <MaskedView 
                style={styles.maskContainerTop}
                maskElement={ <LinearGradient style={styles.fadeContainer} colors={['transparent', 'black'] } locations={[0.055, 0.075]} /> }
            >
                <MaskedView 
                style={styles.maskContainerBottom}
                maskElement={ <LinearGradient style={styles.fadeContainer} colors={['black', 'transparent'] } locations={[0.93, 0.95]} /> }
                >
                <SafeAreaView style={styles.resultsContainer}>
                    <FlatList 
                        style={{}}
                        ref={flatListRef}
                        initialNumToRender={9}
                        numColumns={3}
                        data={
                            reverseOrder ? [...movies, ...shows].sort(ReversedCompareDates) : [...movies, ...shows].sort(CompareDates)
                        }
                        keyExtractor={keyExtractor}
                        renderItem={ renderItem }
                        style={{ paddingTop: 10, width: '100%' }}
                        contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}
                        // onLayout={(event) => {
                        //     var {x, y, width, height} = event.nativeEvent.layout;
                        //     setScrollHeight(height)
                        // }}
                        // onContentSizeChange={onContentHeightChange}
                        // scrollEnabled = { contentHeight > scrollHeight }
                    />
                </SafeAreaView>
                </MaskedView>
            </MaskedView>
            <View style={{
                flex: 0,
                flexDirection: 'row',
                width: '70%', 
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                position: 'absolute',
                top: 60, 
                height: 20}}
            >
                <Text style={styles.titleText}>{"Watched List"}</Text>
                <IconButton
                    style={{ paddingTop: 5 }}
                    icon="tune" 
                    color={Colors.white} 
                    size={27} 
                    onPress={() => {
                        // Alert.alert('Filter place holder')
                        dispatch({type:'REVERSE_ORDER'})
                        flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
                    }}
                />
            </View>
            
            
            <IconButton style={styles.addButton} icon="plus" color={Colors.white} size={35} onPress={() => 
                {
                    dispatch({
                        type: "CLEAR_SEARCHES"
                    });
                    dispatch({
                        type: "SET_INSEARCH"
                    });
                    navigation.navigate("SearchContents");
                }
                }/>
            <IconButton style={styles.homeButton} icon="home" color={Colors.white} size={35} onPress={() => navigation.navigate("Home")}/>
            <View style={styles.logoutButtonContainer}>
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
    logoutButtonContainer: {
        position: "absolute",
        bottom: 20,
        width: "80%",
    },
    addButton: {
        position: "absolute",
        top: 40,
        right: 5
    },
    titleText: {
        color: 'white',
        fontSize: 25
    },
    homeButton: {
        position: "absolute",
        top: 40,
        left: 5
    },
    resultsContainer: {
        marginTop: 25,
        flex: 1, 
        width: "100%",
        alignItems: 'center'
    },
    resultContainer: {
        height: '100%', 
        width: '100%', 
        flex: 1
    },
    touchContainer: {
        width: '30%',
        height: '40%'
    },
    maskContainerTop: {
        marginTop: 60,
        flex: 1, 
        width: "100%",
        alignItems: 'center'
    },
    fadeContainer: {
        flex: 1, 
        width: "100%",
        alignItems: 'center'
    },
    maskContainerBottom: {
        flex: 1, 
        width: "100%",
        alignItems: 'center',
        marginBottom: 50
    },
    contentContainerStyle: {
        width: '100%',
        paddingTop: 15,
        paddingBottom: 50
    },
});