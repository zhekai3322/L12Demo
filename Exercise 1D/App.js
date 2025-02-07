import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';

import { Barometer } from "expo-sensors";

const styles = StyleSheet.create({
  container: {

  },
});

export default function App() {
    const [{ pressure, relativeAltitude }, setData] = useState({ pressure: 0, relativeAltitude: 0 });
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const startBarometer = async () => {
            await Barometer.isAvailableAsync().then(() => {
                Barometer.setUpdateInterval(100); // Update interval in milliseconds
                const sub = Barometer.addListener((sensorData) => {
                    setData({
                        pressure: sensorData.pressure.toFixed(2), // Format pressure value
                        relativeAltitude: sensorData.relativeAltitude.toFixed(2), // Format relative altitude value
                    });
                });
                setSubscription(sub);
            });
        };

        startBarometer();

        return () => {
            subscription && subscription.remove(); // Cleanup on unmount
            setSubscription(null);
        };
    }, []);

    const toggleListener = () => {
        if (subscription) {
            subscription.remove();
            setSubscription(null);
        } else {
            startBarometer();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text>Pressure: {pressure} hPa</Text>
            <Text>
                Relative Altitude: {Platform.OS === 'ios' ? `${relativeAltitude} m` : `Only available on iOS`}
            </Text>
        </View>
    );
}


