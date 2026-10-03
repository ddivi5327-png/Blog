// import { Link, router } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useState } from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import API_URL from "../api/api";

// export default function LoginScreen() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [toast, setToast] = useState("");
//   const [toastType, setToastType] = useState<"success" | "error">("success");

//   const showToast = (message: string, type: "success" | "error") => {
//     setToast(message);
//     setToastType(type);

//     setTimeout(() => {
//       setToast("");
//     }, 2000);
//   };

//   const saveToken = async (token: string) => {
//     if (Platform.OS === "web") {
//       localStorage.setItem("token", token);
//     } else {
//       await SecureStore.setItemAsync("token", token);
//     }
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       showToast("Please enter email and password", "error");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         await saveToken(data.token);

//         showToast("Login successful", "success");

//         setTimeout(() => {
//           router.replace("/home");
//         }, 1500);
//       } else {
//         showToast(data.message || "Login failed", "error");
//       }
//     } catch (error) {
//       showToast("Unable to connect to server", "error");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.form}>
//           <Text style={styles.title}>Blog Login</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />

//           <Pressable style={styles.button} onPress={handleLogin}>
//             <Text style={styles.buttonText}>Login</Text>
//           </Pressable>

//           <Link href="/register" style={styles.registerLink}>
//             Don't have an account? Register
//           </Link>
//         </View>
//       </ScrollView>

//       {toast !== "" && (
//         <View
//           style={[
//             styles.toast,
//             toastType === "success" ? styles.successToast : styles.errorToast,
//           ]}
//         >
//           <Text style={styles.toastText}>
//             {toastType === "success" ? "✓ " : "✕ "}
//             {toast}
//           </Text>
//         </View>
//       )}
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     padding: 20,
//   },

//   form: {
//     width: "100%",
//     maxWidth: 400,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 30,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#999",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//   },

//   button: {
//     backgroundColor: "#00695c",
//     padding: 14,
//     borderRadius: 8,
//     alignItems: "center",
//   },

//   buttonText: {
//     color: "#fff",
//     fontSize: 17,
//     fontWeight: "bold",
//   },

//   registerLink: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#00695c",
//   },

//   toast: {
//     position: "absolute",
//     bottom: 40,
//     alignSelf: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },

//   successToast: {
//     backgroundColor: "#00695c",
//   },

//   errorToast: {
//     backgroundColor: "#c62828",
//   },

//   toastText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "bold",
//   },
// });
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import API_URL from "../api/api";

type LoggedInUser = {
  id: string;
  name: string;
  email: string;
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState("");

  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error") => {
    setToast(message);
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  const saveToken = async (token: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem("token", token);
    } else {
      await SecureStore.setItemAsync("token", token);
    }
  };

  const saveUser = async (user: LoggedInUser) => {
    const userData = JSON.stringify(user);

    if (Platform.OS === "web") {
      localStorage.setItem("user", userData);
    } else {
      await SecureStore.setItemAsync("user", userData);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await saveToken(data.token);

        if (data.user) {
          await saveUser(data.user);
        }

        showToast("Login successful", "success");

        setTimeout(() => {
          router.replace("/home");
        }, 1500);
      } else {
        showToast(data.message || "Login failed", "error");
      }
    } catch (error) {
      showToast("Unable to connect to server", "error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.title}>Blog Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <Link href="/register" style={styles.registerLink}>
            Don't have an account? Register
          </Link>
        </View>
      </ScrollView>

      {toast !== "" && (
        <View
          style={[
            styles.toast,
            toastType === "success" ? styles.successToast : styles.errorToast,
          ]}
        >
          <Text style={styles.toastText}>
            {toastType === "success" ? "✓ " : "✕ "}
            {toast}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#00695c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  registerLink: {
    textAlign: "center",
    marginTop: 20,
    color: "#00695c",
  },

  toast: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  successToast: {
    backgroundColor: "#00695c",
  },

  errorToast: {
    backgroundColor: "#c62828",
  },

  toastText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
