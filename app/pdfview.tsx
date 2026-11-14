import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {StyleSheet,View,Text, Dimensions,ActivityIndicator, TouchableOpacity, Keyboard,} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Message as LLMMessage } from 'react-native-executorch';
import { useLLMState, useLLMActions } from '../context/LLMContext';

const { width } = Dimensions.get('window');

const LANGUAGES = ['Arabic', 'English', 'French', 'Spanish', 'German', 'Chinese', 'Japanese', 'Italian'];

const PROMPT_STYLES = [
  { label: 'Translate',  value: 'translate' },
  { label: 'Explain',    value: 'explain'   },
  { label: 'Synonyms',   value: 'synonyms'  },
];

const buildPrompt = (word: string, lang: string, style: string): LLMMessage[] => {
  const instructions: Record<string, string> = {
    translate: `Translate the following word or phrase to ${lang}. Reply with ONLY the translation, no explanation.`,
    explain:   `Explain the meaning of the following word or phrase in ${lang}. Be concise — 1 or 2 sentences max. No greetings or fillers.`,
    synonyms:  `List 3 synonyms for the following word in ${lang}. Reply with ONLY the synonyms separated by commas, nothing else.`,
  };

  return [
    { role: 'system', content: instructions[style] },
    { role: 'user',   content: word },
  ];
};

export default function PdfViewScreen() {
  const { fileUri } = useLocalSearchParams<{ fileUri: string }>();
  const { isReady, isGenerating, response } = useLLMState();
  const { generate, interrupt } = useLLMActions();

  const [loading, setLoading]           = useState(true);
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(0);
  const [inputText, setInputText]       = useState('');
  const [translatedText, setTranslatedText] = useState('Results appear here');
  const [currentWord, setCurrentWord]   = useState('LexiFlow AI');
  const [copied, setCopied]             = useState(false);
  const [targetLang, setTargetLang]     = useState('Arabic');
  const [promptStyle, setPromptStyle]   = useState('translate');
  const [showLangPicker, setShowLangPicker]   = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '70%'], []);

  // Stream response into translatedText
  useEffect(() => {
    if (!response) return;
    setTranslatedText(response);
  }, [response]);

  // Stop generation when screen unmounts
  useEffect(() => {
    return () => { interrupt(); };
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim() || !isReady || isGenerating) return;
    setCurrentWord(inputText.trim());
    setTranslatedText('');
    Keyboard.dismiss();
    await generate(buildPrompt(inputText.trim(), targetLang, promptStyle));
  };

  const handleCopy = async () => {
    if (!translatedText || translatedText === 'Results appear here') return;
    await Clipboard.setStringAsync(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!fileUri) return null;

  const selectedStyleLabel = PROMPT_STYLES.find(p => p.value === promptStyle)?.label ?? 'Translate';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{
        title: 'LexiFlow Reader',
        headerShown: true,
        headerTitleStyle: { fontWeight: '900', color: '#1A3644' },
        headerShadowVisible: false,
      }} />

      <View className="flex-1 relative bg-gray-100">
        <Pdf
          trustAllCerts={false}
          source={{ uri: fileUri, cache: true }}
          onLoadComplete={(numberOfPages) => { setTotalPages(numberOfPages); setLoading(false); }}
          onPageChanged={(page) => setCurrentPage(page)}
          style={styles.pdf}
        />

        {!loading && totalPages > 0 && (
          <View className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
            <Text className="text-[#1A3644] text-[10px] font-black tracking-tighter">
              {currentPage} <Text className="text-gray-400">/ {totalPages}</Text>
            </Text>
          </View>
        )}

        {loading && (
          <View className="absolute inset-0 items-center justify-center bg-white/50">
            <ActivityIndicator size="large" color="#1E78FF" />
          </View>
        )}

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          handleIndicatorStyle={{ backgroundColor: '#CBD5E1', width: 45 }}
          backgroundStyle={{ borderRadius: 35, elevation: 20 }}
        >
          <BottomSheetView className="flex-1 px-6 pt-2">

            {/* ── Language + Style pickers ── */}
            <View className="flex-row gap-2 mb-4">

              {/* Language picker */}
              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => { setShowLangPicker(p => !p); setShowStylePicker(false); }}
                  className="flex-row items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-100"
                >
                  <Text className="text-[#1A3644] font-semibold text-[13px]">{targetLang}</Text>
                  <Ionicons name={showLangPicker ? 'chevron-up' : 'chevron-down'} size={14} color="#94A3B8" />
                </TouchableOpacity>
                {showLangPicker && (
                  <View className="absolute top-11 left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden">
                    {LANGUAGES.map(lang => (
                      <TouchableOpacity
                        key={lang}
                        onPress={() => { setTargetLang(lang); setShowLangPicker(false); }}
                        className={`px-4 py-3 ${targetLang === lang ? 'bg-blue-50' : ''}`}
                      >
                        <Text className={`text-[13px] font-semibold ${targetLang === lang ? 'text-[#1E78FF]' : 'text-[#1A3644]'}`}>
                          {lang}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Style picker */}
              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => { setShowStylePicker(p => !p); setShowLangPicker(false); }}
                  className="flex-row items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-100"
                >
                  <Text className="text-[#1A3644] font-semibold text-[13px]">{selectedStyleLabel}</Text>
                  <Ionicons name={showStylePicker ? 'chevron-up' : 'chevron-down'} size={14} color="#94A3B8" />
                </TouchableOpacity>
                {showStylePicker && (
                  <View className="absolute top-11 left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden">
                    {PROMPT_STYLES.map(style => (
                      <TouchableOpacity
                        key={style.value}
                        onPress={() => { setPromptStyle(style.value); setShowStylePicker(false); }}
                        className={`px-4 py-3 ${promptStyle === style.value ? 'bg-blue-50' : ''}`}
                      >
                        <Text className={`text-[13px] font-semibold ${promptStyle === style.value ? 'text-[#1E78FF]' : 'text-[#1A3644]'}`}>
                          {style.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* ── Input + search button (unchanged) ── */}
            <View className="flex-row items-center bg-gray-50 rounded-2xl p-2 mb-5 border border-gray-100">
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Type a word..."
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                editable={!isGenerating}
              />
              {inputText.length > 0 && !isGenerating && (
                <TouchableOpacity onPress={() => setInputText('')} className="mr-2">
                  <Ionicons name="close-circle" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={isGenerating ? interrupt : handleTranslate}
                disabled={!isReady || (!inputText.trim() && !isGenerating)}
                className={`p-3 rounded-xl shadow-sm ${isGenerating ? 'bg-red-500' : 'bg-[#1E78FF]'}`}
              >
                {isGenerating
                  ? <Ionicons name="stop" size={18} color="white" />
                  : <Ionicons name="search" size={18} color="white" />
                }
              </TouchableOpacity>
            </View>

            {/* ── Current word (unchanged) ── */}
            <View className="flex-row items-center mb-4 px-1">
              <View className="bg-blue-50 p-2 rounded-lg mr-3">
                <MaterialCommunityIcons name="translate-variant" size={20} color="#1E78FF" />
              </View>
              <Text className="text-lg font-black text-[#1A3644] flex-1" numberOfLines={1}>
                {currentWord}
              </Text>
            </View>

            {/* ── Result box (unchanged shape, streaming inside) ── */}
            <View className="bg-[#1E78FF] rounded-[28px] p-6 shadow-md mb-5">
              <Text className="text-blue-100 text-[10px] font-black uppercase mb-2 tracking-widest">
                {selectedStyleLabel}
              </Text>
              {isGenerating && !translatedText ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-xl font-bold leading-8 text-right">
                  {translatedText}
                </Text>
              )}
            </View>

            {/* ── Copy button (unchanged) ── */}
            <TouchableOpacity
              onPress={handleCopy}
              activeOpacity={0.7}
              className={`w-full h-14 rounded-2xl flex-row items-center justify-center border shadow-sm ${
                copied ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'
              }`}
            >
              <Ionicons
                name={copied ? 'checkmark-circle' : 'copy-outline'}
                size={20}
                color={copied ? '#10B981' : '#64748B'}
              />
              <Text className={`ml-2 font-bold ${copied ? 'text-[#10B981]' : 'text-gray-500'}`}>
                {copied ? 'Copied!' : 'Copy Results'}
              </Text>
            </TouchableOpacity>

          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width,
    height: Dimensions.get('window').height,
    backgroundColor: '#f3f4f6',
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1A3644',
    fontWeight: '600',
  },
});