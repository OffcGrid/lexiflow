import { Image, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type CardProps = {
  title: string;
  icon: any;
  onPress?: () => void;
};

export default function ServiceCard({ icon, title, onPress }: CardProps) {
  return ( 
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
     onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f1f1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    color: "#555",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
  },
});
