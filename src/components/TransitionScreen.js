import React, { PureComponent } from 'react';
import { Animated } from 'react-native'

class TransitionScreen extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            scaleValue: new Animated.Value(0)
        }
    }

    componentDidMount() {
        Animated.timing(this.state.scaleValue, {
            toValue: 1,
            duration : 600,
            delay: 0,
            useNativeDriver: true
        }).start();
    }

    render() {
        return (
            <Animated.View 
            style={ {
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                opacity: this.state.scaleValue,
            }}>
                { this.props.children }
            </Animated.View>
        )
    }
}

export default TransitionScreen;