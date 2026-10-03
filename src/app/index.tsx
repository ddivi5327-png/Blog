// import { Redirect } from "expo-router";

// export default function Index() {
//   return <Redirect href="/login" />;
// }

import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Blog</Text>

      <Text style={styles.description}>
        Share your thoughts, read interesting posts, and connect with other
        bloggers.
      </Text>

      <View style={styles.buttons}>
        <Link href="/login" style={styles.loginButton}>
          Login
        </Link>

        <Link href="/register" style={styles.registerButton}>
          Register
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f5f6fa",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 500,
  },

  buttons: {
    flexDirection: "row",
    marginTop: 30,
    gap: 15,
  },

  loginButton: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: "600",
  },

  registerButton: {
    backgroundColor: "#fff",
    color: "#4f46e5",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4f46e5",
    fontWeight: "600",
  },
});
