import React, { PureComponent } from 'react';
import { Animated } from 'react-native'

class TransitionView extends PureComponent {
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
            delay: this.props.index ? (this.props.index * 50) : 0,
            useNativeDriver: true
        }).start();
    }

    render() {
        return (
            <Animated.View style={{ opacity: this.state.scaleValue }}>
                { this.props.children }
            </Animated.View>
        )
    }
}

export default TransitionView;