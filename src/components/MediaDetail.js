import React, { Component } from 'react';
import { ScrollView, SafeAreaView, View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view';
import TransitionView from './TransitionView';

const imgUrl = "https://image.tmdb.org/t/p/original";

class MediaDetail extends Component {
    state = {
        scrollHeight: 0,
        contentHeight: 0,
    }

    onContentHeightChange = (ContentWidth, ContentHeight) => {
        this.setState({ contentHeight: ContentHeight })
    }

    render() {
        return (
            <SafeAreaView style={styles.detailContainer}>
                <MaskedView 
                style={styles.maskContainerTop}
                maskElement={ <LinearGradient style={styles.fadeContainer} colors={['transparent', 'black'] } locations={[0.055, 0.075]} /> }
                >
                    <MaskedView 
                    style={styles.maskContainerBottom}
                    maskElement={ <LinearGradient style={styles.fadeContainer} colors={['black', 'transparent'] } locations={[0.93, 0.95]} /> }
                    >
                    <TransitionView width={100}>
                        <ScrollView 
                        style={styles.detailsContainer} 
                        contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}
                        onLayout={(event) => {
                            var {x, y, width, height} = event.nativeEvent.layout;
                            this.setState({ scrollHeight: height })
                        }}
                        onContentSizeChange={this.onContentHeightChange}
                        scrollEnabled = { this.state.contentHeight > this.state.scrollHeight }
                        >
                            <View style={{ flexGrow: 1, width: '100%', alignItems: 'center' }}>
                            {this.props.selected.poster_path ? (
                            <Image 
                                source={{uri: imgUrl + this.props.selected.poster_path}} 
                                style={{ height: 400, width: "85%", resizeMode: 'contain', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.5, overflow: 'visible' }}
                            />
                            ) : (
                                <View style={styles.titleContainer}>
                                    <Text 
                                    adjustsFontSizeToFit
                                    numberOfLines={4}
                                    style={styles.titleText}>
                                        {this.props.selected.title ? this.props.selected.title : this.props.selected.name}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.descriptionBox}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold' }} >
                                    {this.props.selected.title ? this.props.selected.title : this.props.selected.name}
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>
                                    { this.props.selected.overview }
                                </Text>
                            </View>
                            </View>
                        </ScrollView>
                        </TransitionView>
                    </MaskedView>
                </MaskedView>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    detailContainer: {
        marginTop: 118,
        marginBottom: 60,
        flex: 1, 
        width: "90%",
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius:10,
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
    },
    detailsContainer: {
        flexGrow: 1,
        width: '100%',
        paddingTop: 50,
        paddingBottom: 30
    },
    contentContainerStyle: {
        alignItems: 'center',
        paddingBottom: 10,
        flexGrow: 1,
        paddingBottom: 100
    },
    titleContainer: {
        width: '100%',
        height: 400,
        backgroundColor: '#C1C1C1',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 80,
        textAlign: 'center',
        justifyContent: 'center'
    },
    descriptionBox: {
        flexGrow: 1,
        width: '88%',
        paddingTop: 25,
    },
    fadeContainer: {
        flex: 1, 
        width: "100%",
        alignItems: 'center'
    },
    maskContainerTop: {
        flex: 1, 
        width: "100%",
        alignItems: 'center',
        marginTop: -30
    },
    maskContainerBottom: {
        flex: 1, 
        width: "100%",
        alignItems: 'center',
        marginBottom: -30
    },
    infoContainer: {
        flex: 1,
        width: '100%'
    }
});

export default MediaDetail