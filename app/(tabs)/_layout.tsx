import { Tabs } from "expo-router";
import { Image, TouchableOpacity, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LexiFlowLogo from "../../components/LexiFlowLogo";

export default function Layout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true, // الهيدر سيظهر بشكل افتراضي
        headerTitle: "",
        headerTransparent: true, 
        headerStyle: {
          height: Platform.OS === 'ios' ? 90 : 60, 
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerLeft: () => (
          <View
            className="ml-[15px] flex-row items-center"
            style={{ 
              height: '100%', 
              paddingTop: Platform.OS === 'android' ? 10 : 0 
            }} 
          >
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[40px] h-[40px] mr-[5px]"
              style={{ resizeMode: "contain" }}
            />
            <LexiFlowLogo fontSize={18} color="white" /> 
          </View>
        ),
        headerRight: () => (
          <View
            className="mr-[16px] justify-center"
            style={{ 
              height: '100%',
              paddingTop: Platform.OS === 'android' ? 10 : 0 
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={28} color="#ffffff" /> 
            </TouchableOpacity>
          </View>
        ),
        tabBarActiveTintColor: "#1E78FF",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          position: 'absolute',
          bottom: 15,
          left: 20,
          right: 20,
          height: 60,
          borderRadius: 20,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5,
          shadowOpacity: 0.1,
        }
      }}
    >
      {/* 1. شاشة الهوم - الهيدر موجود */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} /> 
        }} 
      />

      {/* 2. شاشة الترجمة - هنا نقوم بحذف الهيدر */}
      <Tabs.Screen 
        name="translate" 
        options={{ 
          title: "Translate", 
          headerShown: false, // هذا السطر هو الذي سيحذف الهيدر في هذه الشاشة فقط
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "language" : "language-outline"} size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}