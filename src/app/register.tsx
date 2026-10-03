// import { Link } from "expo-router";
// import { useState } from "react";
// import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
// import API_URL from "../api/api";
// export default function RegisterScreen() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const handleRegister = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//         }),
//       });

//       const data = await response.json();

//       console.log(data);
//     } catch (error) {
//       console.log("Registration error:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.form}>
//         <Text style={styles.title}>Create Account</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />

//         <Pressable style={styles.button} onPress={handleRegister}>
//           <Text style={styles.buttonText}>Register</Text>
//         </Pressable>
//         <Link href="/login" style={styles.loginLink}>
//           Already have an account? Login
//         </Link>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   form: {
//     width: "100%",
//     maxWidth: 400,
//     alignSelf: "center",
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
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
//   loginLink: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#00695c",
//   },
// });
// import { Link, router } from "expo-router";
// import { useState } from "react";
// import {
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     View,
// } from "react-native";
// import API_URL from "../api/api";

// export default function RegisterScreen() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     if (!name || !email || !password) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert("Success", "Registered successfully", [
//           {
//             text: "OK",
//             onPress: () => router.replace("/login"),
//           },
//         ]);
//       } else {
//         Alert.alert("Registration failed", data.message);
//       }
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         "Unable to connect to the server. Please try again.",
//       );
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
//           <Text style={styles.title}>Create Account</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={name}
//             onChangeText={setName}
//           />

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

//           <Pressable style={styles.button} onPress={handleRegister}>
//             <Text style={styles.buttonText}>Register</Text>
//           </Pressable>

//           <Link href="/login" style={styles.loginLink}>
//             Already have an account? Login
//           </Link>
//         </View>
//       </ScrollView>
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

//   loginLink: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#00695c",
//   },
// });
import { Link, router } from "expo-router";
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

export default function RegisterScreen() {
  const [name, setName] = useState("");
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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Registered successfully", "success");

        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      } else {
        showToast(data.message || "Registration failed", "error");
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
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

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

          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          <Link href="/login" style={styles.loginLink}>
            Already have an account? Login
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

  loginLink: {
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
