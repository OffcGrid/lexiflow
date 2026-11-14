import React from "react";
import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type RecentItemProps = {
  title: string;
  sub: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
};

const RecentItem: React.FC<RecentItemProps> = ({ title, sub, iconName, color }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color + "25" }]}>
        <MaterialCommunityIcons name={iconName} size={24} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F8FAFC",
  },
  iconContainer: {
    padding: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  sub: {
    fontSize: 10,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 2,
  },
});

export default RecentItem;
