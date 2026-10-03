// import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
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

// type StoredUser = {
//   id: string;
//   name: string;
//   email: string;
// };

// export default function EditProfileScreen() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");

//   const getToken = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("token");
//     }

//     return await SecureStore.getItemAsync("token");
//   };

//   const getStoredUser = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("user");
//     }

//     return await SecureStore.getItemAsync("user");
//   };

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const token = await getToken();

//         if (!token) {
//           router.replace("/login");
//           return;
//         }

//         const userJson = await getStoredUser();

//         if (!userJson) {
//           router.replace("/login");
//           return;
//         }

//         const user: StoredUser = JSON.parse(userJson);

//         setName(user.name || "");
//         setEmail(user.email || "");
//       } catch (error) {
//         console.error("Load edit profile error:", error);

//         setError("Unable to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const saveUserLocally = async (user: StoredUser) => {
//     const userJson = JSON.stringify(user);

//     if (Platform.OS === "web") {
//       localStorage.setItem("user", userJson);
//     } else {
//       await SecureStore.setItemAsync("user", userJson);
//     }
//   };

//   const handleSave = async () => {
//     const trimmedName = name.trim();
//     const trimmedEmail = email.trim().toLowerCase();

//     if (!trimmedName || !trimmedEmail) {
//       setError("Name and email are required");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");

//       const token = await getToken();

//       if (!token) {
//         router.replace("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/auth/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: trimmedName,
//           email: trimmedEmail,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to update profile");
//         return;
//       }

//       if (data.user) {
//         await saveUserLocally(data.user);
//       }

//       if (Platform.OS === "web") {
//         window.alert("Profile updated successfully");
//       } else {
//         Alert.alert("Success", "Profile updated successfully");
//       }

//       router.replace("/profile");
//     } catch (error) {
//       console.error("Update profile error:", error);

//       setError("Unable to connect to server");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />

//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

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
//           <Pressable style={styles.backButton} onPress={() => router.back()}>
//             <Text style={styles.backButtonText}>← Back</Text>
//           </Pressable>

//           <Text style={styles.heading}>Edit Profile</Text>

//           {error !== "" && (
//             <View style={styles.errorBox}>
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           )}

//           <Text style={styles.label}>Name</Text>

//           <TextInput
//             style={styles.input}
//             value={name}
//             onChangeText={setName}
//             placeholder="Enter your name"
//             autoCapitalize="words"
//             editable={!saving}
//           />

//           <Text style={styles.label}>Email</Text>

//           <TextInput
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             placeholder="Enter your email"
//             keyboardType="email-address"
//             autoCapitalize="none"
//             editable={!saving}
//           />

//           <Pressable
//             style={[styles.saveButton, saving && styles.disabledButton]}
//             onPress={handleSave}
//             disabled={saving}
//           >
//             <Text style={styles.saveButtonText}>
//               {saving ? "Saving..." : "Save Changes"}
//             </Text>
//           </Pressable>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     justifyContent: "center",
//   },

//   form: {
//     width: "100%",
//     maxWidth: 500,
//     alignSelf: "center",
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//     padding: 24,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fbfbfa",
//   },

//   loadingText: {
//     marginTop: 10,
//     color: "#666",
//   },

//   backButton: {
//     alignSelf: "flex-start",
//     marginBottom: 20,
//   },

//   backButtonText: {
//     color: "#00695c",
//     fontSize: 15,
//     fontWeight: "700",
//   },

//   heading: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#14231f",
//     marginBottom: 24,
//   },

//   label: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#37433f",
//     marginBottom: 7,
//   },

//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#d8ddda",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     fontSize: 15,
//     color: "#20302c",
//     backgroundColor: "#fff",
//     marginBottom: 18,
//   },

//   saveButton: {
//     backgroundColor: "#00695c",
//     paddingVertical: 13,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 8,
//   },

//   disabledButton: {
//     opacity: 0.6,
//   },

//   saveButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },

//   errorBox: {
//     backgroundColor: "#ffebee",
//     borderWidth: 1,
//     borderColor: "#ffcdd2",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 18,
//   },

//   errorText: {
//     color: "#c62828",
//     fontSize: 14,
//     textAlign: "center",
//   },
// });

import { File, UploadType } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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

type StoredUser = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  profileImageWidth?: number | null;
  profileImageHeight?: number | null;
};

type SelectedImage = {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
};

export default function EditProfileScreen() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [profileImage, setProfileImage] = useState("");

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );

  const [removeProfileImage, setRemoveProfileImage] = useState(false);

  const [profileImageWidth, setProfileImageWidth] = useState<number | null>(
    null,
  );

  const [profileImageHeight, setProfileImageHeight] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /* ========================================================== */
  /* TOKEN                                                       */
  /* ========================================================== */

  const getToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    }

    return await SecureStore.getItemAsync("token");
  };

  /* ========================================================== */
  /* STORED USER                                                 */
  /* ========================================================== */

  const getStoredUser = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("user");
    }

    return await SecureStore.getItemAsync("user");
  };

  /* ========================================================== */
  /* SAVE USER LOCALLY                                           */
  /* ========================================================== */

  const saveUserLocally = async (user: StoredUser) => {
    const userJson = JSON.stringify(user);

    if (Platform.OS === "web") {
      localStorage.setItem("user", userJson);
    } else {
      await SecureStore.setItemAsync("user", userJson);
    }
  };

  /* ========================================================== */
  /* LOAD USER                                                    */
  /* ========================================================== */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();

        if (!token) {
          router.replace("/login");
          return;
        }

        const userJson = await getStoredUser();

        if (!userJson) {
          router.replace("/login");
          return;
        }

        const user: StoredUser = JSON.parse(userJson);

        setName(user.name || "");
        setEmail(user.email || "");

        setProfileImage(user.profileImage || "");

        setProfileImageWidth(user.profileImageWidth ?? null);

        setProfileImageHeight(user.profileImageHeight ?? null);

        setSelectedImage(null);
        setRemoveProfileImage(false);
      } catch (error) {
        console.error("Load edit profile error:", error);

        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ========================================================== */
  /* PICK PROFILE IMAGE                                          */
  /* ========================================================== */

  const pickProfileImage = async () => {
    try {
      setError("");

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setError("Permission to access images was denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];

      const newImage: SelectedImage = {
        uri: asset.uri,
        width: asset.width || 1,
        height: asset.height || 1,
        mimeType: asset.mimeType || "image/jpeg",
      };

      setSelectedImage(newImage);

      setProfileImage(newImage.uri);

      setProfileImageWidth(newImage.width);

      setProfileImageHeight(newImage.height);

      setRemoveProfileImage(false);
    } catch (error) {
      console.error("Pick profile image error:", error);

      setError("Unable to select profile image");
    }
  };

  /* ========================================================== */
  /* REMOVE PROFILE IMAGE                                       */
  /* ========================================================== */

  const handleRemoveProfileImage = () => {
    setSelectedImage(null);
    setProfileImage("");
    setRemoveProfileImage(true);
    setProfileImageWidth(null);
    setProfileImageHeight(null);
  };

  /* ========================================================== */
  /* RESPONSE HELPER                                             */
  /* ========================================================== */

  const parseResponse = (text: string) => {
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      return {
        message: text,
      };
    }
  };

  /* ========================================================== */
  /* SAVE PROFILE                                                */
  /* ========================================================== */

  const handleSave = async () => {
    const trimmedName = name.trim();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      setError("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = await getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      /* ====================================================== */
      /* MOBILE + NEW PROFILE IMAGE                              */
      /* ====================================================== */

      if (Platform.OS !== "web" && selectedImage) {
        const file = new File(selectedImage.uri);

        const uploadResult = await file.upload(`${API_URL}/api/auth/profile`, {
          uploadType: UploadType.MULTIPART,

          httpMethod: "PUT",

          fieldName: "profileImage",

          mimeType: selectedImage.mimeType,

          headers: {
            Authorization: `Bearer ${token}`,
          },

          parameters: {
            name: trimmedName,

            email: trimmedEmail,

            profileImageWidth: String(selectedImage.width),

            profileImageHeight: String(selectedImage.height),
          },
        });

        console.log("MOBILE PROFILE STATUS:", uploadResult.status);

        console.log("MOBILE PROFILE RESPONSE:", uploadResult.body);

        const data = parseResponse(uploadResult.body || "");

        if (uploadResult.status < 200 || uploadResult.status >= 300) {
          setError(data.message || "Failed to update profile");
          return;
        }

        if (data.user) {
          await saveUserLocally(data.user);
        }

        Alert.alert("Success", "Profile updated successfully");

        router.replace("/profile");

        return;
      }

      /* ====================================================== */
      /* WEB + NEW PROFILE IMAGE                                 */
      /* ====================================================== */

      if (Platform.OS === "web" && selectedImage) {
        const formData = new FormData();

        formData.append("name", trimmedName);

        formData.append("email", trimmedEmail);

        formData.append("profileImageWidth", String(selectedImage.width));

        formData.append("profileImageHeight", String(selectedImage.height));

        const imageResponse = await fetch(selectedImage.uri);

        if (!imageResponse.ok) {
          throw new Error("Unable to read selected image");
        }

        const blob = await imageResponse.blob();

        if (blob.size === 0) {
          throw new Error("Selected image is empty");
        }

        formData.append("profileImage", blob, `profile-${Date.now()}.jpg`);

        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        });

        const responseText = await response.text();

        console.log("WEB PROFILE STATUS:", response.status);

        console.log("WEB PROFILE RESPONSE:", responseText);

        const data = parseResponse(responseText);

        if (!response.ok) {
          setError(data.message || "Failed to update profile");
          return;
        }

        if (data.user) {
          await saveUserLocally(data.user);
        }

        window.alert("Profile updated successfully");

        router.replace("/profile");

        return;
      }

      /* ====================================================== */
      /* REMOVE IMAGE OR TEXT-ONLY UPDATE                       */
      /* ====================================================== */

      const bodyData = {
        name: trimmedName,
        email: trimmedEmail,
        removeProfileImage: removeProfileImage ? "true" : "false",
      };

      if (Platform.OS === "web") {
        const formData = new FormData();

        formData.append("name", trimmedName);

        formData.append("email", trimmedEmail);

        if (removeProfileImage) {
          formData.append("removeProfileImage", "true");
        }

        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        });

        const responseText = await response.text();

        const data = parseResponse(responseText);

        if (!response.ok) {
          setError(data.message || "Failed to update profile");
          return;
        }

        if (data.user) {
          await saveUserLocally(data.user);
        }

        window.alert("Profile updated successfully");

        router.replace("/profile");

        return;
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(bodyData),
      });

      const responseText = await response.text();

      const data = parseResponse(responseText);

      if (!response.ok) {
        setError(data.message || "Failed to update profile");
        return;
      }

      if (data.user) {
        await saveUserLocally(data.user);
      }

      Alert.alert("Success", "Profile updated successfully");

      router.replace("/profile");
    } catch (error) {
      console.error("Update profile error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to connect to server",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================== */
  /* LOADING                                                      */
  /* ========================================================== */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00695c" />

        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  /* ========================================================== */
  /* PREVIEW URI                                                  */
  /* ========================================================== */

  const previewImage = selectedImage?.uri || profileImage;

  /* ========================================================== */
  /* UI                                                           */
  /* ========================================================== */

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* BACK */}

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          <Text style={styles.heading}>Edit Profile</Text>

          {/* ERROR */}

          {error !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* ================================================== */}
          {/* PROFILE IMAGE                                       */}
          {/* ================================================== */}

          <View style={styles.profileImageSection}>
            <Text style={styles.label}>Profile Picture</Text>

            <View style={styles.avatarContainer}>
              {previewImage ? (
                <Image
                  source={{
                    uri: previewImage,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>
                    {name?.charAt(0)?.toUpperCase() || "U"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.imageButtonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.imageButton,
                  pressed && styles.pressed,
                  saving && styles.disabledButton,
                ]}
                onPress={pickProfileImage}
                disabled={saving}
              >
                <Text style={styles.imageButtonText}>🖼️ Change Photo</Text>
              </Pressable>

              {(previewImage || profileImage) && (
                <Pressable
                  style={({ pressed }) => [
                    styles.removeImageButton,
                    pressed && styles.pressed,
                    saving && styles.disabledButton,
                  ]}
                  onPress={handleRemoveProfileImage}
                  disabled={saving}
                >
                  <Text style={styles.removeImageText}>🗑️ Remove</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* NAME */}

          <Text style={styles.label}>Name</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#9aa5a2"
            autoCapitalize="words"
            editable={!saving}
          />

          {/* EMAIL */}

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#9aa5a2"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!saving}
          />

          {/* SAVE */}

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              saving && styles.disabledButton,
              pressed && styles.pressed,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={styles.saveSpinner}
              />
            )}

            <Text style={styles.saveButtonText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ============================================================ */
/* STYLES                                                        */
/* ============================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbfa",
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },

  form: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eceeed",
    padding: 24,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fbfbfa",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  backButtonText: {
    color: "#00695c",
    fontSize: 15,
    fontWeight: "700",
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#14231f",
    marginBottom: 24,
  },

  /* PROFILE IMAGE */

  profileImageSection: {
    alignItems: "center",
    marginBottom: 24,
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#e7f3f0",
    borderWidth: 3,
    borderColor: "#ffffff",
    elevation: 5,
    shadowColor: "#00352e",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#00695c",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarLetter: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "800",
  },

  imageButtonRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  imageButton: {
    backgroundColor: "#e0f2ef",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  imageButtonText: {
    color: "#00695c",
    fontSize: 13.5,
    fontWeight: "700",
  },

  removeImageButton: {
    backgroundColor: "#fdeaea",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  removeImageText: {
    color: "#c62828",
    fontSize: 13.5,
    fontWeight: "700",
  },

  /* FORM */

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#37433f",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d8ddda",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#20302c",
    backgroundColor: "#fff",
    marginBottom: 18,
  },

  /* SAVE */

  saveButton: {
    backgroundColor: "#00695c",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 8,
  },

  saveSpinner: {
    marginRight: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  /* ERROR */

  errorBox: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#ffcdd2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
  },

  errorText: {
    color: "#c62828",
    fontSize: 14,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.7,
  },
});
