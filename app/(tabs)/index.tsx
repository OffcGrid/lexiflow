import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ServiceCard from '../../components/ServiceCard';
import { useRouter } from "expo-router";
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

enableScreens();
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true, 
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const selectedPdfUri = res.assets[0].uri;
        setPdfUri(selectedPdfUri);
        router.push({
          pathname: '/pdfview' as any,
          params: { fileUri: selectedPdfUri }
        });
      }
    } catch (error) {
      console.error("حدث خطأ أثناء اختيار الملف:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-gray-50">
        
        {/* أشكال خلفية ثابتة لملء الفراغ (تظهر خلف المحتوى) */}
        <View className="absolute inset-0 z-0">
          {/* دائرة كبيرة ملونة في الأسفل اليمين */}
          <View 
            className="absolute -bottom-20 -right-20 bg-blue-100/40 rounded-full" 
            style={{ width: width * 0.8, height: width * 0.8 }} 
          />
          {/* دائرة أصغر في جهة اليسار */}
          <View 
            className="absolute bottom-40 -left-10 bg-green-100/30 rounded-full" 
            style={{ width: 150, height: 150 }} 
          />
          {/* شكل هندسي منحرف (Skewed) في المنتصف */}
          <View 
            className="absolute bottom-1/4 right-10 w-20 h-20 bg-blue-200/20 rounded-2xl rotate-45" 
          />
        </View>

        <ScrollView 
          className="flex-1 z-10" 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        > 
          
          {/* 1. HEADER */}
          <View className="px-8 pt-20 pb-24 rounded-b-[50px] bg-blue-600 relative overflow-hidden shadow-xl shadow-blue-900">
            {/* زخرفة داخل الهيدر */}
            <View className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
            <View className="absolute top-20 -left-10 w-24 h-24 bg-white/5 rounded-full" />
            
            <Text className="text-white text-3xl font-extrabold leading-tight tracking-tight">
              What would you like{'\n'}to translate today?
            </Text>
          </View>

          {/* 2. GRID SECTION - تداخل الأزرار مع الهيدر */}
          <View className="px-5 mt-[-50px] flex-row justify-between items-center">
            <ServiceCard 
              icon={<MaterialCommunityIcons name="file-document-outline" size={28} color="#2563EB" />} 
              title="Drop PDF" 
              onPress={pickPdf}
            />
            <ServiceCard 
              icon={<Ionicons name="chatbubbles-outline" size={28} color="#2563EB" />} 
              title="Conversation" 
              onPress={() => router.push("/conversation" as any)}
            />
            <ServiceCard 
              icon={<MaterialCommunityIcons name="translate" size={28} color="#2563EB" />}
              title="Translate" 
              onPress={() => router.push("/translate")} 
            />
          </View>

          {/* 3. DECORATIVE VOID FILLER - عناصر تفاعلية لملء المساحة */}
          <View className="flex-1 justify-center items-center py-20">
            
            {/* نمط نقطي مركزي (Dot Grid) */}
            <View className="flex-row flex-wrap w-32 justify-center opacity-30">
              {[...Array(12)].map((_, i) => (
                <View key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full m-2" />
              ))}
            </View>

            {/* أيقونات عائمة خفيفة جداً */}
            <View className="absolute top-10 left-15 opacity-20">
              <MaterialCommunityIcons name="plus" size={30} color="#3B82F6" />
            </View>
            <View className="absolute bottom-20 right-20 opacity-20 rotate-12">
              <Ionicons name="language-outline" size={40} color="#3B82F6" />
            </View>

            {/* نص ترحيبي خفيف ليملأ الفراغ معنوياً وبصرياً */}
            <Text className="text-gray-300 font-medium text-sm mt-4 tracking-widest uppercase">
              Lexiflow AI Experience
            </Text>

          </View>

        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}