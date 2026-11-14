import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LexiFlowLogoProps {
  fontSize?: number;
  color?: string;
}

const LexiFlowLogo: React.FC<LexiFlowLogoProps> = ({ fontSize = 32, color }) => {

  // الألوان الافتراضية للهوية البصرية
  const defaultColors = {
    lexi: '#1A3644',
    flow: '#586451',
    oLetter: '#63cfaf', // اللون المميز لحرف O
  };

  return (
    <View style={styles.logoWrapper}>
      {/* الجزء الأول: LEXI */}
      <Text style={[
        styles.baseText, 
        { fontSize, color: color || defaultColors.lexi }
      ]}>
        LEXI
      </Text>
      
      {/* الجزء الثاني: FL */}
      <Text style={[
        styles.baseText, 
        { fontSize, color: color || defaultColors.flow }
      ]}>
        FL
      </Text>

      {/* حرف O الطبيعي والسميك */}
      <Text style={[
        styles.baseText, 
        { 
          fontSize: fontSize * 1.05, // تكبير بسيط جداً ليتناسب بصرياً مع الدائرة السابقة
          color: color || defaultColors.oLetter,
          marginHorizontal: 1 // مسافة ضيقة جداً ليبقى التصميم متلاحماً
        }
      ]}>
        O
      </Text>

      {/* الجزء الأخير: W */}
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
    fontWeight: '900', // جعل جميع الأحرف Bold بنفس الدرجة
    letterSpacing: -0.5, // تقريب الأحرف من بعضها ليعطي شعور الـ Logo
  },
});

export default LexiFlowLogo;