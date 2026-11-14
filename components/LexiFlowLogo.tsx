import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LexiFlowLogoProps {
  fontSize?: number;
  color?: string;
}

const LexiFlowLogo: React.FC<LexiFlowLogoProps> = ({ fontSize = 32, color }) => {

  
  const defaultColors = {
    lexi: '#1A3644',
    flow: '#586451',
    oLetter: '#63cfaf', 
  };

  return (
    <View style={styles.logoWrapper}>
      
      <Text style={[
        styles.baseText, 
        { fontSize, color: color || defaultColors.lexi }
      ]}>
        LEXI
      </Text>
      
      <Text style={[
        styles.baseText, 
        { fontSize, color: color || defaultColors.flow }
      ]}>
        FL
      </Text>

      
      <Text style={[
        styles.baseText, 
        { 
          fontSize: fontSize * 1.05,
          color: color || defaultColors.oLetter,
          marginHorizontal: 1 
        }
      ]}>
        O
      </Text>

      
      <Text style={[
        styles.baseText, 
        { fontSize, color: color || defaultColors.flow }
      ]}>
        W
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '900',
    letterSpacing: -0.5, 
  },
});

export default LexiFlowLogo;