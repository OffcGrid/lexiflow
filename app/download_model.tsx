import React from "react";
import { View, Text, Image, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLLMState } from "../context/LLMContext";

export default function DownloadScreen() {
  const { downloadProgress } = useLLMState();


  const percent = Math.round(downloadProgress * 100);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#2563EB", "#60A5FA", "#F8FAFC"]}
        className="pt-24 pb-36 items-center rounded-b-[60px]"
      >
        <Image
          source={require("../assets/images/logo.png")}
          className="w-[90px] h-[90px]"
          style={{ resizeMode: "contain" }}
        />
      </LinearGradient>

      <View className="flex-1 px-8 -mt-28 items-center">
        <Text className="text-[#0F172A] text-2xl font-black text-center">
          Setting up LexiFlow AI
        </Text>
        <Text className="text-slate-500 text-center mt-3 leading-6 font-medium">
          We're downloading the language model so you can chat even when offline.
        </Text>

        {/* Real progress bar */}
        <View className="w-full mt-14">
          <View className="h-5 bg-slate-100 rounded-full overflow-hidden">
            <LinearGradient
              colors={["#2563EB", "#1E78FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: `${percent}%`, height: "100%" }}
            />
          </View>
          <View className="flex-row justify-between mt-3">
            <Text className="text-slate-400 font-bold">{percent}%</Text>
            <Text className="text-slate-400 font-bold">
              {percent === 0 ? "Initializing..." : `${percent}% downloaded`}
            </Text>
          </View>
        </View>

        <View className="mt-auto mb-12 bg-white p-5 rounded-3xl border border-slate-200 flex-row items-center shadow-sm">
          <Ionicons name="bulb-outline" size={22} color="#2563EB" />
          <Text className="text-slate-600 ml-3 flex-1 font-medium text-[13px]">
            Tip: Keep the app open to finish setup faster.
          </Text>
        </View>
      </View>
    </View>
  );
}