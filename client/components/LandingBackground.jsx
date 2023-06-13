import React from 'react';
import { Text, View, StyleSheet, Pressable, } from 'react-native';
import { fontSizes, APP_NAME, theme } from '../util/constants';


const LandingBackground = ({ setLoginForm }) => {
  return (
    <View style={{ height: '80%', justifyContent: 'center', alignItems: "center", padding: 10 }}>
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.logo}>{APP_NAME}</Text>
      </View>
      <View style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        height: '100%', flexDirection: 'row', gap: 50, flexWrap: 'wrap',
        justifyContent: 'space-evenly', alignItems: 'stretch', zIndex: -999
      }}>
        <Text style={{
          transform: [{ rotate: '20deg' }],
          color: "#FF2F8E", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Redefining
        </Text>
        <Text style={{
          transform: [{ rotate: '30deg' }], color: "#FF9E4C",
          fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Social
        </Text>
        <Text style={{
          transform: [{ rotate: '-30deg' }],
          color: "#FFD600", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Network
        </Text>
        <Text style={{
          transform: [{ rotate: '50deg' }],
          color: "#66DF48", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Connect
        </Text>
        <Text style={{
          transform: [{ rotate: '-75deg' }],
          color: theme.colors.secondary, fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Share
        </Text>
        <Text style={{
          transform: [{ rotate: '90deg' }],
          color: "#6A77DD", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Engage
        </Text>
        <Text style={{
          transform: [{ rotate: '-40deg' }],
          color: "#9803CE", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Friends
        </Text>
        <Text style={{
          transform: [{ rotate: '-10deg' }],
          color: "#FF2F8E", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Discover
        </Text>
        <Text style={{
          transform: [{ rotate: '180deg' }],
          color: "#FFD600", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Authentic
        </Text>
        <Text style={{
          transform: [{ rotate: '-85deg' }],
          color: "#66DF48", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Express
        </Text>
        <Text style={{
          transform: [{ rotate: '-95deg' }],
          color: theme.colors.secondary, fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Mood
        </Text>
        <Text style={{
          transform: [{ rotate: '-180deg' }],
          color: "#9803CE", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Vibes
        </Text>
        <Text style={{
          transform: [{ rotate: '-90deg' }],
          color: theme.colors.secondary, fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Fun
        </Text>
        <Text style={{
          transform: [{ rotate: '80deg' }],
          color: "#66DF48", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          Meet
        </Text>
        <Text style={{
          transform: [{ rotate: '0deg' }],
          color: "#9803CE", fontSize: fontSizes.BigHightlight, fontWeight: 'bold',
        }}>
          People
        </Text>
      </View>
      <Pressable
        onPress={() => setLoginForm(true)}
        style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
        <Text style={{ fontSize: fontSizes.large, fontWeight: "bold" }}>Enter</Text>
      </Pressable>
    </View>
  )
}


const styles = StyleSheet.create({
  logo: {
    fontFamily: 'Righteous',
    fontSize: fontSizes.Logo,
    color: theme.colors.light,
    textAlign: 'center',
    padding: 5,
    marginBottom: 20,
  },
  button: {
    position: 'relative',
    width: '100%',
    height: 52,
    backgroundColor: theme.colors.secondary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LandingBackground;