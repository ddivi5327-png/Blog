// import { File, UploadType } from "expo-file-system";
// import * as ImagePicker from "expo-image-picker";
// import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useState } from "react";
// import {
//   Image,
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

// type SelectedImage = {
//   uri: string;
//   width: number;
//   height: number;
//   mimeType?: string;
// };

// export default function CreatePostScreen() {
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");

//   const [image, setImage] = useState<SelectedImage | null>(null);

//   const [toast, setToast] = useState("");
//   const [toastType, setToastType] = useState<"success" | "error">("success");

//   const [creating, setCreating] = useState(false);

//   const showToast = (message: string, type: "success" | "error") => {
//     setToast(message);
//     setToastType(type);

//     setTimeout(() => {
//       setToast("");
//     }, 2000);
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images"],
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       const selected = result.assets[0];

//       setImage({
//         uri: selected.uri,
//         width: selected.width,
//         height: selected.height,
//         mimeType: selected.mimeType || "image/jpeg",
//       });
//     }
//   };

//   const removeImage = () => {
//     setImage(null);
//   };

//   const getToken = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("token");
//     }

//     return await SecureStore.getItemAsync("token");
//   };

//   const parseResponse = async (response: Response) => {
//     const text = await response.text();

//     try {
//       return text ? JSON.parse(text) : {};
//     } catch {
//       return {
//         message: text || "Server returned an invalid response",
//       };
//     }
//   };

//   const handleCreatePost = async () => {
//     if (!title.trim() || !body.trim()) {
//       showToast("Title and body are required", "error");
//       return;
//     }

//     try {
//       setCreating(true);

//       const token = await getToken();

//       if (!token) {
//         showToast("Please login again", "error");
//         return;
//       }

//       /*
//        * MOBILE + IMAGE
//        *
//        * Use Expo File.upload() instead of putting
//        * { uri, type, name } directly into FormData.
//        */
//       if (Platform.OS !== "web" && image) {
//         const file = new File(image.uri);

//         const uploadResult = await file.upload(`${API_URL}/api/posts`, {
//           uploadType: UploadType.MULTIPART,
//           fieldName: "image",
//           mimeType: image.mimeType || "image/jpeg",

//           headers: {
//             Authorization: `Bearer ${token}`,
//           },

//           parameters: {
//             title: title.trim(),
//             body: body.trim(),
//             imageWidth: String(image.width),
//             imageHeight: String(image.height),
//           },
//         });

//         console.log("MOBILE CREATE STATUS:", uploadResult.status);

//         console.log("MOBILE CREATE RESPONSE:", uploadResult.body);

//         let data: any = {};

//         try {
//           data = uploadResult.body ? JSON.parse(uploadResult.body) : {};
//         } catch {
//           data = {
//             message: uploadResult.body || "Invalid server response",
//           };
//         }

//         if (uploadResult.status >= 200 && uploadResult.status < 300) {
//           showToast("Post created successfully", "success");

//           setTimeout(() => {
//             router.replace("/home");
//           }, 800);

//           return;
//         }

//         showToast(data.message || "Post creation failed", "error");

//         return;
//       }

//       /*
//        * WEB
//        *
//        * Normal browser FormData upload.
//        */
//       const formData = new FormData();

//       formData.append("title", title.trim());
//       formData.append("body", body.trim());

//       if (image) {
//         formData.append("imageWidth", String(image.width));

//         formData.append("imageHeight", String(image.height));

//         const imageResponse = await fetch(image.uri);

//         const blob = await imageResponse.blob();

//         formData.append("image", blob, "blog-image.jpg");
//       }

//       console.log("WEB CREATE URL:", `${API_URL}/api/posts`);

//       const response = await fetch(`${API_URL}/api/posts`, {
//         method: "POST",

//         headers: {
//           Authorization: `Bearer ${token}`,
//         },

//         body: formData,
//       });

//       console.log("WEB CREATE STATUS:", response.status);

//       const data = await parseResponse(response);

//       console.log("WEB CREATE RESPONSE:", data);

//       // if (response.ok) {
//       //   showToast("Post created successfully", "success");

//       //   setTimeout(() => {
//       //     router.replace("/home");
//       //   }, 800);
//       if (response.ok) {
//         showToast("Post created successfully", "success");

//         router.replace("/home");
//       } else {
//         showToast(data.message || "Post creation failed", "error");
//       }
//     } catch (error) {
//       console.error("CREATE POST ERROR:", error);

//       showToast(
//         error instanceof Error ? error.message : "Unable to connect to server",
//         "error",
//       );
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleCancel = () => {
//     if (creating) {
//       return;
//     }

//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.replace("/home");
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
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.form}>
//           {/* <Pressable
//             style={({ pressed }) => [
//               styles.backButton,
//               pressed && styles.pressed,
//             ]}
//             onPress={handleCancel}
//             disabled={creating}
//           >
//             <Text style={styles.backButtonText}>← Back</Text>
//           </Pressable> */}

//           <Text style={styles.title}>Create Blog Post</Text>
//           <Text style={styles.subtitle}>
//             Share your thoughts with the world.
//           </Text>

//           <View style={styles.field}>
//             <Text style={styles.label}>Title</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Give your post a title"
//               placeholderTextColor="#9aa5a2"
//               value={title}
//               onChangeText={setTitle}
//               editable={!creating}
//             />
//           </View>

//           <View style={styles.field}>
//             <View style={styles.labelRow}>
//               <Text style={styles.label}>Body</Text>
//               <Text style={styles.charCount}>{body.length} characters</Text>
//             </View>

//             <TextInput
//               style={[styles.input, styles.bodyInput]}
//               placeholder="Write your blog..."
//               placeholderTextColor="#9aa5a2"
//               value={body}
//               onChangeText={setBody}
//               multiline
//               textAlignVertical="top"
//               editable={!creating}
//             />
//           </View>

//           <View style={styles.field}>
//             <Text style={styles.label}>Cover Image</Text>

//             {image ? (
//               <View style={styles.previewWrap}>
//                 <Image
//                   source={{ uri: image.uri }}
//                   style={styles.previewImage}
//                 />

//                 <View style={styles.previewActions}>
//                   <Pressable
//                     style={({ pressed }) => [
//                       styles.previewActionButton,
//                       pressed && styles.pressed,
//                     ]}
//                     onPress={pickImage}
//                     disabled={creating}
//                   >
//                     <Text style={styles.previewActionText}>Change</Text>
//                   </Pressable>

//                   <Pressable
//                     style={({ pressed }) => [
//                       styles.previewActionButton,
//                       styles.previewRemoveButton,
//                       pressed && styles.pressed,
//                     ]}
//                     onPress={removeImage}
//                     disabled={creating}
//                   >
//                     <Text style={styles.previewRemoveText}>Remove</Text>
//                   </Pressable>
//                 </View>
//               </View>
//             ) : (
//               <Pressable
//                 style={({ pressed }) => [
//                   styles.imagePicker,
//                   pressed && styles.pressed,
//                 ]}
//                 onPress={pickImage}
//                 disabled={creating}
//               >
//                 <Text style={styles.imagePickerIcon}>🖼️</Text>
//                 <Text style={styles.imagePickerText}>
//                   Tap to choose an image
//                 </Text>
//                 <Text style={styles.imagePickerHint}>
//                   Optional · JPG or PNG
//                 </Text>
//               </Pressable>
//             )}
//           </View>

//           <Pressable
//             style={({ pressed }) => [
//               styles.submitButton,
//               creating && styles.disabledButton,
//               pressed && styles.pressed,
//             ]}
//             onPress={handleCreatePost}
//             disabled={creating}
//           >
//             <Text style={styles.submitButtonText}>
//               {creating ? "Publishing..." : "Publish Post"}
//             </Text>
//           </Pressable>

//           <Pressable
//             style={({ pressed }) => [
//               styles.cancelButton,
//               pressed && styles.pressed,
//             ]}
//             onPress={handleCancel}
//             disabled={creating}
//           >
//             <Text style={styles.cancelText}>Cancel</Text>
//           </Pressable>
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
//     backgroundColor: "#fbfbfa",
//   },

//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     padding: 20,
//     paddingVertical: 30,
//   },

//   form: {
//     width: "100%",
//     // maxWidth: 520,
//     alignSelf: "center",
//   },

//   pressed: {
//     opacity: 0.7,
//   },

//   backButton: {
//     alignSelf: "flex-start",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#e0e4e2",
//     paddingVertical: 9,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginBottom: 22,
//   },

//   backButtonText: {
//     color: "#00695c",
//     fontWeight: "700",
//     fontSize: 14,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//     marginBottom: 6,
//   },

//   subtitle: {
//     fontSize: 14.5,
//     color: "#8d9995",
//     fontWeight: "500",
//     marginBottom: 28,
//   },

//   field: {
//     marginBottom: 20,
//   },

//   labelRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   label: {
//     fontSize: 13.5,
//     fontWeight: "700",
//     color: "#3f4b47",
//     marginBottom: 8,
//     textTransform: "uppercase",
//     letterSpacing: 0.4,
//   },

//   charCount: {
//     fontSize: 12,
//     color: "#9aa5a2",
//     fontWeight: "500",
//     marginBottom: 8,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#e0e4e2",
//     borderRadius: 14,
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: "#14231f",
//   },

//   bodyInput: {
//     height: 180,
//     lineHeight: 23,
//   },

//   imagePicker: {
//     borderWidth: 1.5,
//     borderColor: "#cfd6d3",
//     borderStyle: "dashed",
//     borderRadius: 16,
//     paddingVertical: 34,
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },

//   imagePickerIcon: {
//     fontSize: 28,
//     marginBottom: 8,
//   },

//   imagePickerText: {
//     color: "#14231f",
//     fontSize: 15,
//     fontWeight: "700",
//   },

//   imagePickerHint: {
//     color: "#9aa5a2",
//     fontSize: 12.5,
//     marginTop: 4,
//   },

//   previewWrap: {
//     borderWidth: 1,
//     borderColor: "#e0e4e2",
//     borderRadius: 16,
//     overflow: "hidden",
//     backgroundColor: "#fff",
//   },

//   previewImage: {
//     width: "100%",
//     height: 200,
//     backgroundColor: "#eef1f0",
//   },

//   previewActions: {
//     flexDirection: "row",
//     gap: 10,
//     padding: 12,
//   },

//   previewActionButton: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 18,
//     alignItems: "center",
//     backgroundColor: "#e0f2ef",
//   },

//   previewActionText: {
//     color: "#00695c",
//     fontWeight: "700",
//     fontSize: 13.5,
//   },

//   previewRemoveButton: {
//     backgroundColor: "#fdeaea",
//   },

//   previewRemoveText: {
//     color: "#c62828",
//     fontWeight: "700",
//     fontSize: 13.5,
//   },

//   submitButton: {
//     backgroundColor: "#00695c",
//     paddingVertical: 15,
//     borderRadius: 24,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 6,
//     width: 300,
//     alignSelf: "center",
//     shadowColor: "#00695c",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   disabledButton: {
//     opacity: 0.6,
//   },

//   submitButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },

//   cancelButton: {
//     paddingVertical: 14,
//     alignItems: "center",
//     marginTop: 6,
//   },

//   cancelText: {
//     color: "#8d9995",
//     fontSize: 15,
//     fontWeight: "600",
//   },

//   toast: {
//     position: "absolute",
//     bottom: 40,
//     alignSelf: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 22,
//     borderRadius: 25,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 5,
//   },

//   successToast: {
//     backgroundColor: "#00695c",
//   },

//   errorToast: {
//     backgroundColor: "#c62828",
//   },

//   toastText: {
//     color: "#fff",
//     fontSize: 14.5,
//     fontWeight: "700",
//   },
// });

import { File, UploadType } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
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

type SelectedImage = {
  uri: string;
  width: number;
  height: number;
  mimeType?: string;
};

const CATEGORIES = [
  "Technology",
  "Travel",
  "Food",
  "Education",
  "Lifestyle",
  "Business",
  "Other",
];

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");

  const [image, setImage] = useState<SelectedImage | null>(null);

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [creating, setCreating] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast(message);
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];

      setImage({
        uri: selected.uri,
        width: selected.width,
        height: selected.height,
        mimeType: selected.mimeType || "image/jpeg",
      });
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const getToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    }

    return await SecureStore.getItemAsync("token");
  };

  const parseResponse = async (response: Response) => {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return {
        message: text || "Server returned an invalid response",
      };
    }
  };

  const handleCreatePost = async () => {
    if (!title.trim() || !body.trim() || !category) {
      showToast("Title, body and category are required", "error");
      return;
    }

    try {
      setCreating(true);

      const token = await getToken();

      if (!token) {
        showToast("Please login again", "error");
        return;
      }

      /*
       * MOBILE + IMAGE
       *
       * Use Expo File.upload() instead of putting
       * { uri, type, name } directly into FormData.
       */
      if (Platform.OS !== "web" && image) {
        const file = new File(image.uri);

        const uploadResult = await file.upload(`${API_URL}/api/posts`, {
          uploadType: UploadType.MULTIPART,
          fieldName: "image",
          mimeType: image.mimeType || "image/jpeg",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          parameters: {
            title: title.trim(),
            body: body.trim(),
            category: category,
            imageWidth: String(image.width),
            imageHeight: String(image.height),
          },
        });

        console.log("MOBILE CREATE STATUS:", uploadResult.status);

        console.log("MOBILE CREATE RESPONSE:", uploadResult.body);

        let data: any = {};

        try {
          data = uploadResult.body ? JSON.parse(uploadResult.body) : {};
        } catch {
          data = {
            message: uploadResult.body || "Invalid server response",
          };
        }

        if (uploadResult.status >= 200 && uploadResult.status < 300) {
          showToast("Post created successfully", "success");

          setTimeout(() => {
            router.replace("/home");
          }, 800);

          return;
        }

        showToast(data.message || "Post creation failed", "error");

        return;
      }

      /*
       * WEB
       *
       * Normal browser FormData upload.
       */
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("body", body.trim());
      formData.append("category", category);

      if (image) {
        formData.append("imageWidth", String(image.width));

        formData.append("imageHeight", String(image.height));

        const imageResponse = await fetch(image.uri);

        const blob = await imageResponse.blob();

        formData.append("image", blob, "blog-image.jpg");
      }

      console.log("WEB CREATE URL:", `${API_URL}/api/posts`);

      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      console.log("WEB CREATE STATUS:", response.status);

      const data = await parseResponse(response);

      console.log("WEB CREATE RESPONSE:", data);

      if (response.ok) {
        showToast("Post created successfully", "success");

        router.replace("/home");
      } else {
        showToast(data.message || "Post creation failed", "error");
      }
    } catch (error) {
      console.error("CREATE POST ERROR:", error);

      showToast(
        error instanceof Error ? error.message : "Unable to connect to server",
        "error",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    if (creating) {
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Create Blog Post</Text>

          <Text style={styles.subtitle}>
            Share your thoughts with the world.
          </Text>

          {/* TITLE */}

          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>

            <TextInput
              style={styles.input}
              placeholder="Give your post a title"
              placeholderTextColor="#9aa5a2"
              value={title}
              onChangeText={setTitle}
              editable={!creating}
            />
          </View>

          {/* CATEGORY */}

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>

            <View style={styles.categoryContainer}>
              {CATEGORIES.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  disabled={creating}
                  style={({ pressed }) => [
                    styles.categoryButton,
                    category === item && styles.selectedCategoryButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === item && styles.selectedCategoryText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* BODY */}

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Body</Text>

              <Text style={styles.charCount}>{body.length} characters</Text>
            </View>

            <TextInput
              style={[styles.input, styles.bodyInput]}
              placeholder="Write your blog..."
              placeholderTextColor="#9aa5a2"
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical="top"
              editable={!creating}
            />
          </View>

          {/* COVER IMAGE */}

          <View style={styles.field}>
            <Text style={styles.label}>Cover Image</Text>

            {image ? (
              <View style={styles.previewWrap}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.previewImage}
                />

                <View style={styles.previewActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.previewActionButton,
                      pressed && styles.pressed,
                    ]}
                    onPress={pickImage}
                    disabled={creating}
                  >
                    <Text style={styles.previewActionText}>Change</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.previewActionButton,
                      styles.previewRemoveButton,
                      pressed && styles.pressed,
                    ]}
                    onPress={removeImage}
                    disabled={creating}
                  >
                    <Text style={styles.previewRemoveText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.imagePicker,
                  pressed && styles.pressed,
                ]}
                onPress={pickImage}
                disabled={creating}
              >
                <Text style={styles.imagePickerIcon}>🖼️</Text>

                <Text style={styles.imagePickerText}>
                  Tap to choose an image
                </Text>

                <Text style={styles.imagePickerHint}>
                  Optional · JPG or PNG
                </Text>
              </Pressable>
            )}
          </View>

          {/* SUBMIT */}

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              creating && styles.disabledButton,
              pressed && styles.pressed,
            ]}
            onPress={handleCreatePost}
            disabled={creating}
          >
            <Text style={styles.submitButtonText}>
              {creating ? "Publishing..." : "Publish Post"}
            </Text>
          </Pressable>

          {/* CANCEL */}

          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.pressed,
            ]}
            onPress={handleCancel}
            disabled={creating}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* TOAST */}

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
    backgroundColor: "#fbfbfa",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingVertical: 30,
  },

  form: {
    width: "100%",
    alignSelf: "center",
  },

  pressed: {
    opacity: 0.7,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#14231f",
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14.5,
    color: "#8d9995",
    fontWeight: "500",
    marginBottom: 28,
  },

  field: {
    marginBottom: 20,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#3f4b47",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  charCount: {
    fontSize: 12,
    color: "#9aa5a2",
    fontWeight: "500",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e0e4e2",
    borderRadius: 14,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#14231f",
  },

  bodyInput: {
    height: 180,
    lineHeight: 23,
  },

  /* CATEGORY */

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: "#d7ddda",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  selectedCategoryButton: {
    backgroundColor: "#00695c",
    borderColor: "#00695c",
  },

  categoryButtonText: {
    color: "#53615d",
    fontSize: 14,
    fontWeight: "600",
  },

  selectedCategoryText: {
    color: "#fff",
  },

  /* IMAGE */

  imagePicker: {
    borderWidth: 1.5,
    borderColor: "#cfd6d3",
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 34,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  imagePickerIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  imagePickerText: {
    color: "#14231f",
    fontSize: 15,
    fontWeight: "700",
  },

  imagePickerHint: {
    color: "#9aa5a2",
    fontSize: 12.5,
    marginTop: 4,
  },

  previewWrap: {
    borderWidth: 1,
    borderColor: "#e0e4e2",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  previewImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#eef1f0",
  },

  previewActions: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },

  previewActionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#e0f2ef",
  },

  previewActionText: {
    color: "#00695c",
    fontWeight: "700",
    fontSize: 13.5,
  },

  previewRemoveButton: {
    backgroundColor: "#fdeaea",
  },

  previewRemoveText: {
    color: "#c62828",
    fontWeight: "700",
    fontSize: 13.5,
  },

  /* BUTTONS */

  submitButton: {
    backgroundColor: "#00695c",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    width: 300,
    alignSelf: "center",
    shadowColor: "#00695c",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },

  cancelText: {
    color: "#8d9995",
    fontSize: 15,
    fontWeight: "600",
  },

  /* TOAST */

  toast: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  successToast: {
    backgroundColor: "#00695c",
  },

  errorToast: {
    backgroundColor: "#c62828",
  },

  toastText: {
    color: "#fff",
    fontSize: 14.5,
    fontWeight: "700",
  },
});
