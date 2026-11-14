import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Message as LLMMessage } from "react-native-executorch";
import { useLLMActions, useLLMState } from "../context/LLMContext";

type UIMessage = {
  id: string;
  text: string;
  sender: "user" | "ai";
  time: string;
};

const WELCOME: UIMessage = {
  id: "1",
  text: "Welcome! I am your LexiFlow Assistant. How can I inspire you today?",
  sender: "ai",
  time: "",
};

const MAX_HISTORY = 14;

export default function GlobalChatScreen() {
  const { isReady, isGenerating, response } = useLLMState();
  const { generate, interrupt } = useLLMActions();

  const [messages, setMessages] = useState<UIMessage[]>([WELCOME]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const chatHistory = useRef<LLMMessage[]>([
    {
      role: "system",
      content: "You are a helpful assistant called LexiFlow. /no_think",
    },
  ]);

  const formatTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (!response) return;
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "ai-streaming" ? { ...msg, text: response } : msg,
      ),
    );
    flatListRef.current?.scrollToEnd({ animated: false });
  }, [response]);

  useEffect(() => {
    if (!isGenerating && response) {
      chatHistory.current = [
        ...chatHistory.current,
        { role: "assistant", content: response },
      ];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "ai-streaming"
            ? { ...msg, id: Date.now().toString() }
            : msg,
        ),
      );
    }
  }, [isGenerating]);

  const sendMessage = async () => {
    if (!inputText.trim() || !isReady || isGenerating) return;

    const text = inputText.trim();

    chatHistory.current = [
      ...chatHistory.current,
      { role: "user", content: text },
    ];

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, sender: "user", time: formatTime() },
      { id: "ai-streaming", text: "", sender: "ai", time: formatTime() },
    ]);

    setInputText("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // ✅ Sliding window — system prompt always kept, last MAX_HISTORY trimmed
    const trimmedHistory: LLMMessage[] = [
      chatHistory.current[0], // system prompt — always first
      ...chatHistory.current.slice(1).slice(-MAX_HISTORY), // last 20 messages only
    ];

    await generate(trimmedHistory);
  };

  const renderMessage = ({ item }: { item: UIMessage }) => (
    <View
      className={`mb-6 flex-row ${item.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      {item.sender === "ai" && (
        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2 self-end mb-1">
          <Ionicons name="sparkles" size={16} color="#1E78FF" />
        </View>
      )}
      <View
        className={`max-w-[75%] px-5 py-3.5 rounded-[26px] ${
          item.sender === "user"
            ? "bg-[#1E78FF] rounded-br-none shadow-sm shadow-blue-400"
            : "bg-white border border-gray-100 rounded-bl-none shadow-sm shadow-gray-200"
        }`}
      >
        <Text
          className={`text-[15px] leading-6 ${
            item.sender === "user" ? "text-white" : "text-[#1A3644] font-medium"
          }`}
        >
          {item.text}
          {item.id === "ai-streaming" && (
            <Text className="text-[#1E78FF]"> ▋</Text>
          )}
        </Text>
        {item.time ? (
          <Text
            className={`text-[9px] mt-1 ${
              item.sender === "user"
                ? "text-blue-200 text-right"
                : "text-gray-400"
            }`}
          >
            {item.time}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen
        options={{
          title: "LexiFlow AI Chat",
          headerTitleStyle: { fontWeight: "900", color: "#1A3644" },
          headerStyle: { backgroundColor: "#F8FAFC" },
          headerShadowVisible: false,
        }}
      />

      {!isReady && (
        <View className="bg-amber-50 border-b border-amber-100 px-4 py-2">
          <Text className="text-amber-600 text-center text-xs font-medium">
            ⏳ Model is loading...
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="px-4 py-6 bg-white border-t border-gray-50 rounded-t-[35px] shadow-2xl">
          <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-1 border border-gray-100">
            <TextInput
              placeholder={
                isGenerating ? "AI is responding..." : "Message LexiFlow..."
              }
              placeholderTextColor="#94A3B8"
              className="flex-1 min-h-[45px] max-h-[100px] text-[#1A3644] font-medium py-2"
              multiline
              value={inputText}
              onChangeText={setInputText}
              editable={!isGenerating && isReady}
            />
            {isGenerating ? (
              <TouchableOpacity
                onPress={interrupt}
                className="p-2 rounded-xl bg-red-500"
              >
                <Ionicons name="stop" size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!inputText.trim() || !isReady}
                className={`p-2 rounded-xl ${inputText.trim() && isReady ? "bg-[#1E78FF]" : "bg-gray-200"}`}
              >
                <Ionicons name="arrow-up" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
