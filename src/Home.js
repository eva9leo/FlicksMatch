import React, { useContext, useCallback } from 'react'
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, SafeAreaView, FlatList } from "react-native"
import { useStateValue } from './StateProvider'
import { IconButton, Colors } from 'react-native-paper'
import TransitionView from './components/TransitionView';
import ResultBox from './components/ResultBox'
import { CompareDates, ReversedCompareDates, CompareMatch } from './helpers';
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view';

export default function Home({ navigation }) {
    const [{ user, firstname, lastname, shows, movies, reverseOrder, showRecommendations, movieRecommendations, recommendations }, dispatch] = useStateValue();

    const flatListRef = React.useRef()
    const keyExtractor = useCallback((item) => item.id.toString(), []);
    const renderItem = useCallback(
        ({ item, index }) => 
        <TransitionView index={ index }>
            <ResultBox item={item} navigation={ navigation } dispatch={ dispatch } />
        </TransitionView>
        , []
    );

    return (
        <View style={styles.container}>
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
                        data={ recommendations }
                        keyExtractor={keyExtractor}
                        renderItem={ renderItem }
                        style={{ paddingTop: 10, width: '100%' }}
                        contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}
                    />
                </SafeAreaView>
                </MaskedView>
            </MaskedView>
            <Text style={styles.titleText}>{"Recommendations"}</Text>
            <IconButton style={styles.backButton} icon="account" color={Colors.white} size={35} onPress={() => {
                dispatch({
                    type: "SET_INSEARCH"
                });
                dispatch({
                    type: "CLEAR_RECOMMENDATIONS"
                })
                navigation.goBack()
            }}/>
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
    titleText: {
        position: 'absolute',
        top: "7.5%",
        color: 'white',
        fontSize: 25
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: -5
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
        marginBottom: 0
    },
    contentContainerStyle: {
        width: '100%',
        paddingTop: 15,
        paddingBottom: 50
    },
});