import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Message as LLMMessage } from 'react-native-executorch';
import { useLLMState, useLLMActions } from '../../context/LLMContext';

const LANGUAGES = ['Arabic', 'English', 'French', 'Chinese', 'Spanish', 'Italian', 'German', 'Japanese'];

export default function TranslatorScreen() {
  const { isReady, isGenerating, response } = useLLMState();
  const { generate, interrupt } = useLLMActions();

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Arabic');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'source' | 'target'>('source');

  // Sync streaming response into outputText
  React.useEffect(() => {
    if (!response) return;
    setOutputText(response);
  }, [response]);

  // Interrupt generation when leaving the screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        interrupt();
        setInputText('');
        setOutputText('');
        setCopied(false);
      };
    }, [])
  );

  const handleTranslate = async () => {
    if (!inputText.trim() || !isReady || isGenerating) return;

    setOutputText(''); 

    const prompt: LLMMessage[] = [
      {
        role: 'system',
        content: `You are a professional translator. Translate the user's text from ${sourceLang} to ${targetLang}. Reply with ONLY the translated text — no explanations, no notes, no alternatives.`,
      },
      {
        role: 'user',
        content: inputText.trim(),
      },
    ];

    await generate(prompt);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await Clipboard.setStringAsync(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openLangSelector = (type: 'source' | 'target') => {
    setSelectingFor(type);
    setModalVisible(true);
  };

  const selectLanguage = (lang: string) => {
    if (selectingFor === 'source') setSourceLang(lang);
    else setTargetLang(lang);
    setModalVisible(false);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  return (
    <View className="flex-1 bg-slate-100">
      <LinearGradient
        colors={['#2563EB', '#FFFFFF']}
        className="h-52 px-6 pt-14 rounded-b-[40px] absolute w-full"
      />

      <ScrollView className="flex-1 px-5 pt-9" showsVerticalScrollIndicator={false}>
        {/* Input box */}
        <View className="bg-white rounded-[30px] p-6 shadow-xl mb-4 relative">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() => openLangSelector('source')}
              className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200"
            >
              <Text className="font-semibold text-slate-700 mr-1">{sourceLang}</Text>
              <Ionicons name="chevron-down" size={14} color="#64748b" />
            </TouchableOpacity>

            {/* Translate button — shows spinner while generating */}
            <TouchableOpacity
              onPress={isGenerating ? interrupt : handleTranslate}
              disabled={!isReady || !inputText.trim()}
              className={`flex-row items-center px-4 py-1.5 rounded-full shadow-md active:scale-95 ${
                isGenerating ? 'bg-red-500 shadow-red-800/20' : 'bg-blue-600 shadow-blue-800/20'
              } ${(!isReady || !inputText.trim()) ? 'opacity-50' : ''}`}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator size="small" color="white" style={{ marginRight: 6 }} />
                  <Text className="text-white font-bold text-[13px] uppercase tracking-widest">Stop</Text>
                </>
              ) : (
                <Text className="text-white font-bold text-[13px] uppercase tracking-widest">
                  {!isReady ? 'Loading...' : 'Translate'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="relative">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type text to translate..."
              placeholderTextColor="#94A3B8"
              multiline
              className="text-slate-800 text-[15px] leading-7 font-medium pr-8"
              style={{ height: 120, textAlignVertical: "top" }}
              editable={!isGenerating}
            />
            {inputText.length > 0 && (
              <TouchableOpacity
                onPress={() => setInputText('')}
                className="absolute top-0 right-0 p-1 bg-slate-100 rounded-full opacity-80"
              >
                <Ionicons name="close" size={16} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Swap button */}
        <TouchableOpacity
          onPress={swapLanguages}
          className="self-center bg-white p-2.5 rounded-full shadow-lg shadow-slate-300 mb-4 z-10 active:scale-95"
          style={{ marginTop: -25 }}
        >
          <Ionicons name="swap-vertical" size={22} color="#2563EB" />
        </TouchableOpacity>

        {/* Output box */}
        <View className="bg-white rounded-[30px] p-6 shadow-xl mb-9">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() => openLangSelector('target')}
              className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200"
            >
              <Text className="font-semibold text-slate-700 mr-1">{targetLang}</Text>
              <Ionicons name="chevron-down" size={14} color="#64748b" />
            </TouchableOpacity>

            {outputText.length > 0 && (
              <TouchableOpacity
                onPress={handleCopy}
                className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 active:scale-95"
              >
                <Ionicons
                  name={copied ? "checkmark-circle" : "copy-outline"}
                  size={14}
                  color={copied ? "#16a34a" : "#64748b"}
                />
                <Text className={`font-bold text-[10px] uppercase ml-1.5 ${copied ? 'text-green-600' : 'text-slate-500'}`}>
                  {copied ? "Copied" : "Copy"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Streaming translation output */}
          {isGenerating && !outputText ? (
            <View className="min-h-[100px] justify-center items-center">
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : (
            <Text className="text-slate-800 text-[15px] leading-7 font-medium min-h-[100px]">
              {outputText || <Text className="text-slate-400 italic">Translation will appear here...</Text>}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Language selector modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-[35px] p-6 h-1/2 shadow-2xl">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-slate-800">Select Language</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1 bg-slate-100 rounded-full">
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectLanguage(item)}
                  className={`py-4 flex-row justify-between items-center ${
                    (selectingFor === 'source' ? sourceLang : targetLang) === item
                      ? 'bg-blue-50 px-4 rounded-2xl'
                      : 'px-2'
                  }`}
                >
                  <Text className="text-slate-700 font-medium">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}