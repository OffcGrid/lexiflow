import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Switch, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  rightElement?: React.ReactNode;
  hasArrow?: boolean;
  onPress?: () => void;
  iconBgColor?: string;
  isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  rightElement, 
  hasArrow = false, 
  onPress,
  iconBgColor = "#F3F4F6",
  isLast = false
}) => (
  <View>
    <TouchableOpacity 
      className="flex-row items-center justify-between py-[15px] px-[16px]"
      activeOpacity={0.6}
      onPress={onPress}
      disabled={!onPress}
    >
      <View className="flex-row items-center">
        <View 
          style={{ backgroundColor: iconBgColor }}
          className="w-[40px] h-[40px] rounded-[12px] items-center justify-center"
        >
          {icon}
        </View>
        <Text className="ml-[15px] text-[16px] font-semibold text-[#1A3644]">
          {title}
        </Text>
      </View>

      <View className="flex-row items-center">
        {rightElement}
        {hasArrow && <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />}
      </View>
    </TouchableOpacity>
    {!isLast && <View className="h-[1px] bg-gray-50 ml-[70px]" />}
  </View>
);

const SettingsScreen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-[18px]" 
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        {/* القسم الأول: المشاركة */}
        <View className="bg-white rounded-[25px] mb-[18px] overflow-hidden shadow-sm border border-gray-100">
          <SettingItem 
            icon={<Ionicons name="share-social" size={20} color="#3B82F6" />}
            iconBgColor="#EFF6FF"
            title="Share App"
            onPress={() => {}}
            isLast={true}
          />
        </View>

        {/* القسم الثاني: التفضيلات */}
        <View className="bg-white rounded-[25px] mb-[18px] overflow-hidden shadow-sm border border-gray-100">
          <SettingItem 
            icon={<Ionicons name="language" size={20} color="#10B981" />}
            iconBgColor="#ECFDF5"
            title="Language Options"
            rightElement={<Text className="text-[#3B82F6] font-bold mr-[5px]">Default</Text>}
            hasArrow={true}
            onPress={() => {}}
          />
          <SettingItem 
            icon={<Ionicons name="moon" size={20} color="#8B5CF6" />}
            iconBgColor="#F5F3FF"
            title="Dark Mode"
            rightElement={
              <Switch 
                value={isDarkMode} 
                onValueChange={setIsDarkMode}
                trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                thumbColor={Platform.OS === 'ios' ? undefined : "#FFFFFF"}
              />
            }
            isLast={true}
          />
        </View>

        {/* القسم الثالث: الدعم والقانونية */}
        <View className="bg-white rounded-[25px] mb-[20px] overflow-hidden shadow-sm border border-gray-100">
          <SettingItem 
            icon={<MaterialIcons name="chat-bubble" size={20} color="#F59E0B" />}
            iconBgColor="#FFFBEB"
            title="Feedback"
            onPress={() => {}}
          />
          <SettingItem 
            icon={<Ionicons name="rocket" size={20} color="#EC4899" />}
            iconBgColor="#FDF2F8"
            title="Request a new feature"
            onPress={() => {}}
          />
          <SettingItem 
            icon={<Ionicons name="shield-checkmark" size={20} color="#64748B" />}
            iconBgColor="#F8FAFC"
            title="Privacy Policy"
            onPress={() => {}}
            isLast={true}
          />
        </View>

        <Text className="text-center text-gray-300 text-[12px] mt-4 font-bold uppercase tracking-[2px]">
          Lexiflow v1.0.0
        </Text>

      </ScrollView>
    </View>
  );
}

export default SettingsScreen;