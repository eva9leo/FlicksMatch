import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Alert, Dimensions } from "react-native"
import { auth, db } from "./firebaseConfig"
import { useStateValue } from './StateProvider'
import { IconButton, Colors } from 'react-native-paper'
import ResultBox from './components/ResultBox'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view';
import TransitionView from './components/TransitionView';
import TransitionScreen from './components/TransitionScreen'
import { TMDB_KEY } from "@env";
import { CompareDates, ReversedCompareDates, CompareMatch } from './helpers';
import { Flow } from 'react-native-animated-spinkit'

export default function Profile({ navigation }) {
    const screenHeight = Dimensions.get('screen').height;

    const flatListRef = React.useRef()
    const [{ user, firstname, lastname, shows, movies, reverseOrder, refreshProfile, lastMovieDoc, lastShowDoc }, dispatch] = useStateValue();
    
    const [loadingMovie, setLoadingMovie] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);

    // const [scrollHeight, setScrollHeight] = useState(0);
    // const [contentHeight, setContentHeight] = useState(0);

    // const onContentHeightChange = (ContentWidth, ContentHeight) => {
    //     setContentHeight(ContentHeight)
    // }
    const searchMovieById = async (movieId, rec=null) => {
        fetch(
          "https://api.themoviedb.org/3/movie/" +
          movieId + "?api_key=" +
          TMDB_KEY +
          "&language=en-US"
        ).then((response) => response.json())
        .then((item) => {
            dispatch({
                type: "ADD_RECOMMENDATION",
                item: {
                    id: item.id,
                    name: item.name,
                    title: item.title,
                    poster_path: item.poster_path,
                    vote_average: item.vote_average,
                    release_date: item.release_date,
                    type: 'movie',
                }
            })
        })
    }

    const searchShowById = async (showId, rec=null) => {
        fetch(
          "https://api.themoviedb.org/3/tv/" +
          showId + "?api_key=" +
          TMDB_KEY +
          "&language=en-US"
        ).then((response) => response.json())
        .then((item) => {
            dispatch({
                type: "ADD_RECOMMENDATION",
                item: {
                  id: item.id,
                  name: item.name,
                  title: item.title,
                  poster_path: item.poster_path,
                  vote_average: item.vote_average,
                  release_date: item.first_air_date,
                  type: 'tv'
                }
            });
        })
    }

    // const fillRecommendations = () => {
    //     const topRecs = [...movieRecommendations.filter(movie => !(movies.some(item => item.id === parseInt(movie.id)))),
    //         ...showRecommendations.filter(show => !(shows.some(item => item.id === parseInt(show.id))))]
    //         .sort(CompareMatch).splice(0, Math.min(30, movieRecommendations.length + showRecommendations.length))
    //     topRecs.forEach(function(media) {
    //         if (media.type === 'tv') {
    //             searchShowById(media.id)
    //         } else {
    //             searchMovieById(media.id)
    //         }
    //     })
    // }

    const logout = () => {
        if (user) {
            auth.signOut().then(() => {
                setTimeout(function(){
                    dispatch({
                        type: "SET_USER",
                        user: null
                    })
                    dispatch({type: 'CLEAR_CONTENT'})
                    // dispatch({type: 'SET_READY'})
                }, 500)
            })
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
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        // console.log('layoutMeasurement.height: ' + layoutMeasurement.height)
        // console.log('contentOffset.y: ' + contentOffset.y)
        // console.log()
        return (
          layoutMeasurement.height + contentOffset.y >=
          contentSize.height - 4 * screenHeight
        );
      };

    const updateMedia = (contentType) => {
        if (contentType === 'movies') {
            setLoadingMovie(true)
        } else {
            setLoadingShow(true)
        }
        const mediaRef = db.collection('users').doc(user.uid).collection(contentType).orderBy('release_date', 'desc').limit(21);
        if ((contentType === 'movies' ? lastMovieDoc : lastShowDoc)) {
            mediaRef.startAfter(contentType === 'movies' ? lastMovieDoc : lastShowDoc).get().then((data) => {
                if (data) {
                    const contents = data.docs;
                    if (contents.length > 0) {
                        dispatch({
                            type: contentType === 'movies' ? 'SET_LAST_MOVIE' : 'SET_LAST_SHOW',
                            item: data.docs[data.docs.length - 1]
                        })
    
                        data.docs.forEach(function(doc) {
                            const details = doc.data()
                            dispatch({
                                type: contentType === 'movies' ? 'ADD_MOVIE' : 'ADD_SHOW',
                                item: {
                                    id: doc.id,
                                    title: details.title,
                                    poster_path: details.poster_path,
                                    vote_average: details.vote_average,
                                    release_date: details.release_date,
                                    type: contentType === 'movies' ? 'movie' : 'tv',
                                }
                            })
                        })
                    } else {
                        dispatch({
                            type: contentType === 'movies' ? 'SET_LAST_MOVIE' : 'SET_LAST_SHOW',
                            item: null
                        })
                    }
                    
                }
            }).then(() => {
                if (contentType === 'movies') {
                    setLoadingMovie(true)
                } else {
                    setLoadingShow(true)
                }
            })
            .catch((err) => { Alert.alert('failed to retrieve ' + contentType + ': ' + err.message) })
        } else {
            mediaRef.get().then((data) => {
                if (data) {
                    const contents = data.docs;
                    if (contents.length > 0) {
                        dispatch({
                            type: contentType === 'movies' ? 'SET_LAST_MOVIE' : 'SET_LAST_SHOW',
                            item: data.docs[data.docs.length - 1]
                        })
    
                        data.docs.forEach(function(doc) {
                            const details = doc.data()
                            dispatch({
                                type: contentType === 'movies' ? 'ADD_MOVIE' : 'ADD_SHOW',
                                item: {
                                    id: doc.id,
                                    title: details.title,
                                    poster_path: details.poster_path,
                                    vote_average: details.vote_average,
                                    release_date: details.release_date,
                                    type: contentType === 'movies' ? 'movie' : 'tv',
                                }
                            })
                        })
                    }
                }
              }).then(() => {
                if (contentType === 'movies') {
                    setLoadingMovie(false)
                } else {
                    setLoadingShow(false)
                }
              })
              .catch((err) => { Alert.alert('failed to retrieve ' + contentType + ': ' + err.message) })
        }
    }

    useEffect(() => {
        if (user) { // when user is logged in
            if (refreshProfile) {
                updateMedia('movies');
                updateMedia('shows');
                dispatch({
                    type: 'SET_REFRESHPROFILE',
                    item: false
                })
            }
        }
      }, [refreshProfile]);
    
    return (
        <View style={styles.container}>
            {user ? (
                <TransitionScreen>
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
                                onScroll={({ nativeEvent }) => {
                                    if (isCloseToBottom(nativeEvent)) {
                                      if (!loadingMovie && lastMovieDoc) {
                                        updateMedia('movies');
                                      }
                                      if (!loadingShow && lastShowDoc) {
                                        updateMedia('shows');
                                      }
                                    }
                                }}
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
                        height: 25}}
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
                    <IconButton style={styles.homeButton} icon="home" color={Colors.white} size={35} onPress={() => {
                        // fillRecommendations();
                        dispatch({
                            type: "SET_INSEARCH"
                        });
                        navigation.navigate("Home")
                    }}/>
                    <View style={styles.logoutButtonContainer}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={logout}>
                            <Text style={styles.buttonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </TransitionScreen>
            ) : (
                <>
                    <View style={styles.logoContainer}>
                        <Text style={styles.title}>{"Loading"}</Text>
                        <Flow color={'white'} size={35}/>
                    </View>
                </>
            )}
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
        fontSize: 30,
        fontWeight: "bold",
        paddingBottom: 10,
        color: 'white'
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    fadeContainer: {
        flex: 1, 
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    maskContainerBottom: {
        flex: 1, 
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50
    },
    contentContainerStyle: {
        flex: 0,
        alignContent: 'center',
        width: '100%',
        paddingTop: 15,
        paddingBottom: 50
    },
});