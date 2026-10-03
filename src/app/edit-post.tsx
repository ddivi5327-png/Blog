// import { File, UploadType } from "expo-file-system";
// import * as ImagePicker from "expo-image-picker";
// import { router, useLocalSearchParams } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
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

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   image: string;
//   imageWidth?: number;
//   imageHeight?: number;
// };

// type SelectedImage = {
//   uri: string;
//   width: number;
//   height: number;
//   mimeType: string;
// };

// export default function EditPostScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();

//   const [post, setPost] = useState<Post | null>(null);

//   const [title, setTitle] = useState("");

//   const [body, setBody] = useState("");

//   const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
//     null,
//   );

//   const [existingImage, setExistingImage] = useState("");

//   const [existingImageWidth, setExistingImageWidth] = useState<
//     number | undefined
//   >();

//   const [existingImageHeight, setExistingImageHeight] = useState<
//     number | undefined
//   >();

//   const [removeImage, setRemoveImage] = useState(false);

//   const [loading, setLoading] = useState(true);

//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");

//   const [success, setSuccess] = useState("");

//   /* ========================================================== */
//   /* TOKEN                                                       */
//   /* ========================================================== */

//   const getToken = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("token");
//     }

//     return await SecureStore.getItemAsync("token");
//   };

//   /* ========================================================== */
//   /* LOAD POST                                                   */
//   /* ========================================================== */

//   useEffect(() => {
//     const loadPost = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         setSuccess("");

//         const response = await fetch(`${API_URL}/api/posts/${id}`);

//         const data = await response.json();

//         if (!response.ok) {
//           setError(data.message || "Failed to load post");
//           return;
//         }

//         const loadedPost: Post = data.post;

//         setPost(loadedPost);
//         setTitle(loadedPost.title || "");
//         setBody(loadedPost.body || "");

//         setExistingImage(loadedPost.image || "");

//         setExistingImageWidth(loadedPost.imageWidth);

//         setExistingImageHeight(loadedPost.imageHeight);

//         setSelectedImage(null);
//         setRemoveImage(false);
//       } catch (error) {
//         console.error("LOAD POST ERROR:", error);

//         setError("Unable to connect to server");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!id) {
//       setLoading(false);
//       setError("Post ID is missing");
//       return;
//     }

//     loadPost();
//   }, [id]);

//   /* ========================================================== */
//   /* PICK IMAGE                                                  */
//   /* ========================================================== */

//   const pickImage = async () => {
//     try {
//       setError("");
//       setSuccess("");

//       const permission =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (!permission.granted) {
//         setError("Permission to access images was denied");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (result.canceled || result.assets.length === 0) {
//         return;
//       }

//       const asset = result.assets[0];

//       const newImage: SelectedImage = {
//         uri: asset.uri,
//         width: asset.width || 1,
//         height: asset.height || 1,
//         mimeType: asset.mimeType || "image/jpeg",
//       };

//       setSelectedImage(newImage);
//       setRemoveImage(false);

//       console.log("SELECTED IMAGE:", newImage);
//     } catch (error) {
//       console.error("PICK IMAGE ERROR:", error);

//       setError("Unable to select image");
//     }
//   };

//   /* ========================================================== */
//   /* REMOVE IMAGE                                                */
//   /* ========================================================== */

//   const handleRemoveImage = () => {
//     setSelectedImage(null);
//     setRemoveImage(true);
//     setSuccess("");
//   };

//   /* ========================================================== */
//   /* KEEP EXISTING IMAGE                                         */
//   /* ========================================================== */

//   const handleKeepExistingImage = () => {
//     setSelectedImage(null);
//     setRemoveImage(false);
//     setSuccess("");
//   };

//   /* ========================================================== */
//   /* SAFE RESPONSE                                               */
//   /* ========================================================== */

//   const parseResponseText = (text: string) => {
//     if (!text) {
//       return {};
//     }

//     try {
//       return JSON.parse(text);
//     } catch {
//       return {
//         message: text,
//       };
//     }
//   };

//   /* ========================================================== */
//   /* MOBILE IMAGE UPDATE                                        */
//   /* ========================================================== */

//   const updateWithMobileImage = async (token: string, image: SelectedImage) => {
//     const file = new File(image.uri);

//     const uploadResult = await file.upload(`${API_URL}/api/posts/${id}`, {
//       uploadType: UploadType.MULTIPART,

//       httpMethod: "PUT",

//       fieldName: "image",

//       mimeType: image.mimeType,

//       headers: {
//         Authorization: `Bearer ${token}`,
//       },

//       parameters: {
//         title: title.trim(),
//         body: body.trim(),
//         imageWidth: String(image.width),
//         imageHeight: String(image.height),
//       },
//     });

//     console.log("MOBILE UPDATE STATUS:", uploadResult.status);

//     console.log("MOBILE UPDATE RESPONSE:", uploadResult.body);

//     const data = parseResponseText(uploadResult.body || "");

//     if (uploadResult.status < 200 || uploadResult.status >= 300) {
//       throw new Error(data.message || "Failed to update image");
//     }
//   };

//   /* ========================================================== */
//   /* WEB IMAGE UPDATE                                            */
//   /* ========================================================== */

//   const updateWithWebImage = async (token: string, image: SelectedImage) => {
//     const formData = new FormData();

//     formData.append("title", title.trim());

//     formData.append("body", body.trim());

//     formData.append("imageWidth", String(image.width));

//     formData.append("imageHeight", String(image.height));

//     const imageResponse = await fetch(image.uri);

//     if (!imageResponse.ok) {
//       throw new Error("Unable to read selected image");
//     }

//     const blob = await imageResponse.blob();

//     if (blob.size === 0) {
//       throw new Error("Selected image is empty");
//     }

//     formData.append("image", blob, `blog-image-${Date.now()}.jpg`);

//     console.log("WEB IMAGE SIZE:", blob.size);

//     console.log("WEB IMAGE TYPE:", blob.type);

//     const response = await fetch(`${API_URL}/api/posts/${id}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const responseText = await response.text();

//     console.log("WEB IMAGE UPDATE STATUS:", response.status);

//     console.log("WEB IMAGE UPDATE RESPONSE:", responseText);

//     const data = parseResponseText(responseText);

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to update image");
//     }
//   };

//   /* ========================================================== */
//   /* TEXT / REMOVE IMAGE UPDATE                                 */
//   /* ========================================================== */

//   const updateTextOnly = async (token: string) => {
//     if (Platform.OS === "web") {
//       const formData = new FormData();

//       formData.append("title", title.trim());

//       formData.append("body", body.trim());

//       if (removeImage) {
//         formData.append("removeImage", "true");
//       }

//       const response = await fetch(`${API_URL}/api/posts/${id}`, {
//         method: "PUT",

//         headers: {
//           Authorization: `Bearer ${token}`,
//         },

//         body: formData,
//       });

//       const responseText = await response.text();

//       const data = parseResponseText(responseText);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to update post");
//       }

//       return;
//     }

//     const response = await fetch(`${API_URL}/api/posts/${id}`, {
//       method: "PUT",

//       headers: {
//         "Content-Type": "application/json",

//         Authorization: `Bearer ${token}`,
//       },

//       body: JSON.stringify({
//         title: title.trim(),
//         body: body.trim(),
//         removeImage: removeImage ? "true" : "false",
//       }),
//     });

//     const responseText = await response.text();

//     const data = parseResponseText(responseText);

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to update post");
//     }
//   };

//   /* ========================================================== */
//   /* SAVE                                                         */
//   /* ========================================================== */

//   const handleSave = async () => {
//     if (!title.trim()) {
//       setError("Title is required");
//       return;
//     }

//     if (!body.trim()) {
//       setError("Body is required");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");
//       setSuccess("");

//       const token = await getToken();

//       if (!token) {
//         setError("Please login again");
//         return;
//       }

//       if (selectedImage) {
//         if (Platform.OS === "web") {
//           await updateWithWebImage(token, selectedImage);
//         } else {
//           await updateWithMobileImage(token, selectedImage);
//         }
//       } else {
//         await updateTextOnly(token);
//       }

//       setSuccess("Post updated successfully");

//       setTimeout(() => {
//         router.replace({
//           pathname: "/post-detail",
//           params: {
//             id,
//           },
//         });
//       }, 700);
//     } catch (error) {
//       console.error("EDIT POST ERROR:", error);

//       setError(
//         error instanceof Error ? error.message : "Unable to update post",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ========================================================== */
//   /* CANCEL                                                       */
//   /* ========================================================== */

//   const handleCancel = () => {
//     if (router.canGoBack()) {
//       router.back();
//       return;
//     }

//     router.replace({
//       pathname: "/post-detail",
//       params: {
//         id,
//       },
//     });
//   };

//   /* ========================================================== */
//   /* PREVIEW                                                      */
//   /* ========================================================== */

//   const previewUri = selectedImage?.uri || (!removeImage ? existingImage : "");

//   const previewWidth = selectedImage?.width || existingImageWidth || 16;

//   const previewHeight = selectedImage?.height || existingImageHeight || 9;

//   const previewRatio = previewWidth / previewHeight;

//   /* ========================================================== */
//   /* LOADING                                                      */
//   /* ========================================================== */

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#00695c" />

//         <Text style={styles.loadingText}>Loading post...</Text>
//       </View>
//     );
//   }

//   /* ========================================================== */
//   /* NOT FOUND                                                    */
//   /* ========================================================== */

//   if (!post) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorEmoji}>⚠️</Text>

//         <Text style={styles.standaloneErrorText}>
//           {error || "Post not found"}
//         </Text>
//       </View>
//     );
//   }

//   /* ========================================================== */
//   /* UI                                                           */
//   /* ========================================================== */

//   return (
//     <View style={styles.screen}>
//       <KeyboardAvoidingView
//         style={styles.keyboard}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={styles.container}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <Text style={styles.heading}>Edit Post</Text>

//           <Text style={styles.subheading}>
//             Make your changes and save when you're ready.
//           </Text>

//           {/* ERROR */}

//           {error !== "" && (
//             <View style={styles.errorBox}>
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           )}

//           {/* SUCCESS */}

//           {success !== "" && (
//             <View style={styles.successBox}>
//               <Text style={styles.successText}>✓ {success}</Text>
//             </View>
//           )}

//           {/* IMAGE */}

//           <View style={styles.imageSection}>
//             <Text style={styles.label}>Cover Image</Text>

//             {previewUri ? (
//               <>
//                 {Platform.OS === "web" ? (
//                   /* ================================================= */
//                   /* WEB / LAPTOP — BOTH ICONS TOP RIGHT               */
//                   /* ================================================= */

//                   <View style={styles.webImageContainer}>
//                     <Image
//                       source={{
//                         uri: previewUri,
//                       }}
//                       resizeMode="contain"
//                       style={[
//                         styles.previewImage,
//                         {
//                           aspectRatio: previewRatio,
//                         },
//                       ]}
//                     />

//                     <View style={styles.webImageActions}>
//                       {/* CHANGE */}

//                       <Pressable
//                         style={({ pressed }) => [
//                           styles.webImageIconButton,
//                           pressed && styles.iconPressed,
//                           saving && styles.disabledButton,
//                         ]}
//                         onPress={pickImage}
//                         disabled={saving}
//                       >
//                         <Text style={styles.webImageIcon}>🖼️Change</Text>
//                       </Pressable>

//                       {/* REMOVE */}

//                       <Pressable
//                         style={({ pressed }) => [
//                           styles.webImageIconButton,
//                           styles.webRemoveIconButton,
//                           pressed && styles.iconPressed,
//                           saving && styles.disabledButton,
//                         ]}
//                         onPress={handleRemoveImage}
//                         disabled={saving}
//                       >
//                         <Text style={styles.webImageIcon}>🗑️Delete</Text>
//                       </Pressable>
//                     </View>
//                   </View>
//                 ) : (
//                   /* ================================================= */
//                   /* MOBILE — KEEP CURRENT BUTTON STYLE               */
//                   /* ================================================= */

//                   <View style={styles.mobileImageContainer}>
//                     <Image
//                       source={{
//                         uri: previewUri,
//                       }}
//                       resizeMode="contain"
//                       style={[
//                         styles.previewImage,
//                         {
//                           aspectRatio: previewRatio,
//                         },
//                       ]}
//                     />

//                     <View style={styles.mobileImageActions}>
//                       <Pressable
//                         style={({ pressed }) => [
//                           styles.changeButton,
//                           pressed && styles.pressed,
//                           saving && styles.disabledButton,
//                         ]}
//                         onPress={pickImage}
//                         disabled={saving}
//                       >
//                         <Text style={styles.changeButtonText}>
//                           Change Image
//                         </Text>
//                       </Pressable>

//                       <Pressable
//                         style={({ pressed }) => [
//                           styles.removeButton,
//                           pressed && styles.pressed,
//                           saving && styles.disabledButton,
//                         ]}
//                         onPress={handleRemoveImage}
//                         disabled={saving}
//                       >
//                         <Text style={styles.removeButtonText}>Remove</Text>
//                       </Pressable>
//                     </View>
//                   </View>
//                 )}
//               </>
//             ) : (
//               <View style={styles.noImageContainer}>
//                 <Text style={styles.noImageText}>No cover image</Text>

//                 <Pressable
//                   style={({ pressed }) => [
//                     styles.addImageButton,
//                     pressed && styles.pressed,
//                     saving && styles.disabledButton,
//                   ]}
//                   onPress={pickImage}
//                   disabled={saving}
//                 >
//                   <Text style={styles.addImageButtonText}>🖼️ Add Image</Text>
//                 </Pressable>

//                 {removeImage && existingImage && (
//                   <Pressable
//                     style={({ pressed }) => [
//                       styles.keepButton,
//                       pressed && styles.pressed,
//                     ]}
//                     onPress={handleKeepExistingImage}
//                     disabled={saving}
//                   >
//                     <Text style={styles.keepButtonText}>
//                       Keep Current Image
//                     </Text>
//                   </Pressable>
//                 )}
//               </View>
//             )}
//           </View>

//           {/* TITLE */}

//           <View style={styles.field}>
//             <Text style={styles.label}>Title</Text>

//             <TextInput
//               value={title}
//               onChangeText={setTitle}
//               placeholder="Enter blog title"
//               placeholderTextColor="#9aa5a2"
//               style={styles.input}
//               editable={!saving}
//             />
//           </View>

//           {/* BODY */}

//           <View style={styles.field}>
//             <View style={styles.labelRow}>
//               <Text style={styles.label}>Body</Text>

//               <Text style={styles.charCount}>{body.length} characters</Text>
//             </View>

//             <TextInput
//               value={body}
//               onChangeText={setBody}
//               placeholder="Enter blog content"
//               placeholderTextColor="#9aa5a2"
//               multiline
//               textAlignVertical="top"
//               style={[styles.input, styles.bodyInput]}
//               editable={!saving}
//             />
//           </View>

//           {/* BUTTONS */}

//           <View style={styles.buttonRow}>
//             <Pressable
//               style={({ pressed }) => [
//                 styles.cancelButton,
//                 pressed && styles.pressed,
//                 saving && styles.disabledButton,
//               ]}
//               onPress={handleCancel}
//               disabled={saving}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </Pressable>

//             <Pressable
//               style={({ pressed }) => [
//                 styles.saveButton,
//                 pressed && styles.pressed,
//                 saving && styles.disabledButton,
//               ]}
//               onPress={handleSave}
//               disabled={saving}
//             >
//               {saving && (
//                 <ActivityIndicator
//                   size="small"
//                   color="#fff"
//                   style={styles.saveSpinner}
//                 />
//               )}

//               <Text style={styles.saveButtonText}>
//                 {saving ? "Saving..." : "Save Changes"}
//               </Text>
//             </Pressable>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// /* ============================================================ */
// /* STYLES                                                        */
// /* ============================================================ */

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   keyboard: {
//     flex: 1,
//   },

//   container: {
//     width: "100%",
//     alignSelf: "center",
//     padding: 20,
//     paddingBottom: 60,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#fbfbfa",
//   },

//   loadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   errorEmoji: {
//     fontSize: 38,
//     marginBottom: 10,
//   },

//   standaloneErrorText: {
//     color: "#c62828",
//     fontSize: 15.5,
//     fontWeight: "600",
//     textAlign: "center",
//   },

//   /* ======================================================== */
//   /* COMMON                                                     */
//   /* ======================================================== */

//   pressed: {
//     opacity: 0.7,
//   },

//   iconPressed: {
//     opacity: 0.8,
//     transform: [
//       {
//         scale: 0.96,
//       },
//     ],
//   },

//   disabledButton: {
//     opacity: 0.6,
//   },

//   /* ======================================================== */
//   /* HEADING                                                    */
//   /* ======================================================== */

//   heading: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//     marginBottom: 6,
//   },

//   subheading: {
//     fontSize: 14.5,
//     color: "#8d9995",
//     marginBottom: 26,
//     fontWeight: "500",
//   },

//   /* ======================================================== */
//   /* IMAGE SECTION                                              */
//   /* ======================================================== */

//   imageSection: {
//     marginBottom: 22,
//   },

//   previewImage: {
//     width: "100%",
//     maxHeight: 320,
//     backgroundColor: "#eef1f0",
//   },

//   /* ======================================================== */
//   /* WEB IMAGE                                                  */
//   /* ======================================================== */

//   webImageContainer: {
//     position: "relative",
//     width: "100%",
//     borderRadius: 16,
//     overflow: "hidden",
//     backgroundColor: "#eef1f0",
//   },

//   webImageActions: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     zIndex: 20,

//     flexDirection: "row",
//     gap: 8,
//   },

//   webImageIconButton: {
//     width: 100,
//     height: 40,
//     borderRadius: 20,

//     backgroundColor: "#ffffff",
//     //color: "#ffffff",
//     justifyContent: "center",
//     alignItems: "center",

//     shadowColor: "#ffffff",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 6,
//   },

//   webRemoveIconButton: {
//     backgroundColor: "#ffffff",
//   },

//   webImageIcon: {
//     fontSize: 17,
//   },

//   /* ======================================================== */
//   /* MOBILE IMAGE                                               */
//   /* ======================================================== */

//   mobileImageContainer: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#e0e4e2",
//     borderRadius: 16,
//     overflow: "hidden",
//     backgroundColor: "#eef1f0",
//   },

//   mobileImageActions: {
//     flexDirection: "row",
//     gap: 10,
//     padding: 12,
//     backgroundColor: "#ffffff",
//   },

//   changeButton: {
//     flex: 1,
//     backgroundColor: "#00695c",
//     paddingVertical: 11,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   changeButtonText: {
//     color: "#ffffff",
//     fontSize: 13.5,
//     fontWeight: "700",
//   },

//   removeButton: {
//     flex: 1,
//     backgroundColor: "#fdeaea",
//     paddingVertical: 11,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   removeButtonText: {
//     color: "#c62828",
//     fontSize: 13.5,
//     fontWeight: "700",
//   },

//   /* ======================================================== */
//   /* NO IMAGE                                                   */
//   /* ======================================================== */

//   noImageContainer: {
//     minHeight: 180,
//     borderWidth: 1,
//     borderColor: "#e0e4e2",
//     borderRadius: 16,
//     backgroundColor: "#f1f4f3",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },

//   noImageText: {
//     color: "#8d9995",
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 14,
//   },

//   addImageButton: {
//     backgroundColor: "#00695c",
//     paddingHorizontal: 18,
//     paddingVertical: 11,
//     borderRadius: 20,
//   },

//   addImageButtonText: {
//     color: "#ffffff",
//     fontSize: 13.5,
//     fontWeight: "700",
//   },

//   keepButton: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#e0e4e2",
//     backgroundColor: "#ffffff",
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },

//   keepButtonText: {
//     color: "#55635f",
//     fontSize: 13.5,
//     fontWeight: "700",
//   },

//   /* ======================================================== */
//   /* FORM                                                       */
//   /* ======================================================== */

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
//     backgroundColor: "#ffffff",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: "#14231f",
//   },

//   bodyInput: {
//     minHeight: 220,
//     lineHeight: 23,
//   },

//   /* ======================================================== */
//   /* MESSAGES                                                   */
//   /* ======================================================== */

//   errorBox: {
//     backgroundColor: "#ffebee",
//     borderWidth: 1,
//     borderColor: "#ffcdd2",
//     padding: 13,
//     borderRadius: 12,
//     marginBottom: 20,
//   },

//   errorText: {
//     color: "#c62828",
//     textAlign: "center",
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   successBox: {
//     backgroundColor: "#e8f5e9",
//     borderWidth: 1,
//     borderColor: "#c8e6c9",
//     padding: 13,
//     borderRadius: 12,
//     marginBottom: 20,
//   },

//   successText: {
//     color: "#2e7d32",
//     textAlign: "center",
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   /* ======================================================== */
//   /* BUTTONS                                                    */
//   /* ======================================================== */

//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 12,
//     marginTop: 8,
//     flexWrap: "wrap",
//   },

//   cancelButton: {
//     borderWidth: 1,
//     borderColor: "#e0e4e2",
//     backgroundColor: "#ffffff",
//     paddingVertical: 14,
//     borderRadius: 22,
//     alignItems: "center",
//     justifyContent: "center",
//     width: 250,
//   },

//   cancelButtonText: {
//     color: "#55635f",
//     fontWeight: "700",
//     fontSize: 15,
//   },

//   saveButton: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#00695c",
//     paddingVertical: 14,
//     borderRadius: 22,
//     width: 250,

//     shadowColor: "#00695c",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   saveSpinner: {
//     marginRight: 8,
//   },

//   saveButtonText: {
//     color: "#ffffff",
//     fontWeight: "700",
//     fontSize: 15,
//   },
// });

import { File, UploadType } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

const CATEGORIES = [
  "Technology",
  "Travel",
  "Food",
  "Education",
  "Lifestyle",
  "Business",
  "Other",
];

type Post = {
  _id: string;
  title: string;
  body: string;
  category: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
};

type SelectedImage = {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
};

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);

  const [title, setTitle] = useState("");

  const [body, setBody] = useState("");

  const [category, setCategory] = useState("");

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );

  const [existingImage, setExistingImage] = useState("");

  const [existingImageWidth, setExistingImageWidth] = useState<
    number | undefined
  >();

  const [existingImageHeight, setExistingImageHeight] = useState<
    number | undefined
  >();

  const [removeImage, setRemoveImage] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

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
  /* LOAD POST                                                   */
  /* ========================================================== */

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const response = await fetch(`${API_URL}/api/posts/${id}`);

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load post");
          return;
        }

        const loadedPost: Post = data.post;

        setPost(loadedPost);
        setTitle(loadedPost.title || "");
        setBody(loadedPost.body || "");
        setCategory(loadedPost.category || "");

        setExistingImage(loadedPost.image || "");

        setExistingImageWidth(loadedPost.imageWidth);

        setExistingImageHeight(loadedPost.imageHeight);

        setSelectedImage(null);
        setRemoveImage(false);
      } catch (error) {
        console.error("LOAD POST ERROR:", error);

        setError("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      setLoading(false);
      setError("Post ID is missing");
      return;
    }

    loadPost();
  }, [id]);

  /* ========================================================== */
  /* PICK IMAGE                                                  */
  /* ========================================================== */

  const pickImage = async () => {
    try {
      setError("");
      setSuccess("");

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setError("Permission to access images was denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
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
      setRemoveImage(false);

      console.log("SELECTED IMAGE:", newImage);
    } catch (error) {
      console.error("PICK IMAGE ERROR:", error);

      setError("Unable to select image");
    }
  };

  /* ========================================================== */
  /* REMOVE IMAGE                                                */
  /* ========================================================== */

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setRemoveImage(true);
    setSuccess("");
  };

  /* ========================================================== */
  /* KEEP EXISTING IMAGE                                         */
  /* ========================================================== */

  const handleKeepExistingImage = () => {
    setSelectedImage(null);
    setRemoveImage(false);
    setSuccess("");
  };

  /* ========================================================== */
  /* SAFE RESPONSE                                               */
  /* ========================================================== */

  const parseResponseText = (text: string) => {
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
  /* MOBILE IMAGE UPDATE                                        */
  /* ========================================================== */

  const updateWithMobileImage = async (token: string, image: SelectedImage) => {
    const file = new File(image.uri);

    const uploadResult = await file.upload(`${API_URL}/api/posts/${id}`, {
      uploadType: UploadType.MULTIPART,

      httpMethod: "PUT",

      fieldName: "image",

      mimeType: image.mimeType,

      headers: {
        Authorization: `Bearer ${token}`,
      },

      parameters: {
        title: title.trim(),
        body: body.trim(),
        category: category.trim(),
        imageWidth: String(image.width),
        imageHeight: String(image.height),
      },
    });

    console.log("MOBILE UPDATE STATUS:", uploadResult.status);

    console.log("MOBILE UPDATE RESPONSE:", uploadResult.body);

    const data = parseResponseText(uploadResult.body || "");

    if (uploadResult.status < 200 || uploadResult.status >= 300) {
      throw new Error(data.message || "Failed to update image");
    }
  };

  /* ========================================================== */
  /* WEB IMAGE UPDATE                                            */
  /* ========================================================== */

  const updateWithWebImage = async (token: string, image: SelectedImage) => {
    const formData = new FormData();

    formData.append("title", title.trim());

    formData.append("body", body.trim());

    formData.append("category", category.trim());

    formData.append("imageWidth", String(image.width));

    formData.append("imageHeight", String(image.height));

    const imageResponse = await fetch(image.uri);

    if (!imageResponse.ok) {
      throw new Error("Unable to read selected image");
    }

    const blob = await imageResponse.blob();

    if (blob.size === 0) {
      throw new Error("Selected image is empty");
    }

    formData.append("image", blob, `blog-image-${Date.now()}.jpg`);

    console.log("WEB IMAGE SIZE:", blob.size);

    console.log("WEB IMAGE TYPE:", blob.type);

    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseText = await response.text();

    console.log("WEB IMAGE UPDATE STATUS:", response.status);

    console.log("WEB IMAGE UPDATE RESPONSE:", responseText);

    const data = parseResponseText(responseText);

    if (!response.ok) {
      throw new Error(data.message || "Failed to update image");
    }
  };

  /* ========================================================== */
  /* TEXT / REMOVE IMAGE UPDATE                                 */
  /* ========================================================== */

  const updateTextOnly = async (token: string) => {
    if (Platform.OS === "web") {
      const formData = new FormData();

      formData.append("title", title.trim());

      formData.append("body", body.trim());

      formData.append("category", category.trim());

      if (removeImage) {
        formData.append("removeImage", "true");
      }

      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const responseText = await response.text();

      const data = parseResponseText(responseText);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update post");
      }

      return;
    }

    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        category: category.trim(),
        removeImage: removeImage ? "true" : "false",
      }),
    });

    const responseText = await response.text();

    const data = parseResponseText(responseText);

    if (!response.ok) {
      throw new Error(data.message || "Failed to update post");
    }
  };

  /* ========================================================== */
  /* SAVE                                                         */
  /* ========================================================== */

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!body.trim()) {
      setError("Body is required");
      return;
    }

    if (!category) {
      setError("Category is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = await getToken();

      if (!token) {
        setError("Please login again");
        return;
      }

      if (selectedImage) {
        if (Platform.OS === "web") {
          await updateWithWebImage(token, selectedImage);
        } else {
          await updateWithMobileImage(token, selectedImage);
        }
      } else {
        await updateTextOnly(token);
      }

      setSuccess("Post updated successfully");

      setTimeout(() => {
        router.replace({
          pathname: "/post-detail",
          params: {
            id,
          },
        });
      }, 700);
    } catch (error) {
      console.error("EDIT POST ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Unable to update post",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================== */
  /* CANCEL                                                       */
  /* ========================================================== */

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({
      pathname: "/post-detail",
      params: {
        id,
      },
    });
  };

  /* ========================================================== */
  /* PREVIEW                                                      */
  /* ========================================================== */

  const previewUri = selectedImage?.uri || (!removeImage ? existingImage : "");

  const previewWidth = selectedImage?.width || existingImageWidth || 16;

  const previewHeight = selectedImage?.height || existingImageHeight || 9;

  const previewRatio = previewWidth / previewHeight;

  /* ========================================================== */
  /* LOADING                                                      */
  /* ========================================================== */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00695c" />

        <Text style={styles.loadingText}>Loading post...</Text>
      </View>
    );
  }

  /* ========================================================== */
  /* NOT FOUND                                                    */
  /* ========================================================== */

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>⚠️</Text>

        <Text style={styles.standaloneErrorText}>
          {error || "Post not found"}
        </Text>
      </View>
    );
  }

  /* ========================================================== */
  /* UI                                                           */
  /* ========================================================== */

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Edit Post</Text>

          <Text style={styles.subheading}>
            Make your changes and save when you're ready.
          </Text>

          {/* ERROR */}

          {error !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* SUCCESS */}

          {success !== "" && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✓ {success}</Text>
            </View>
          )}

          {/* IMAGE */}

          <View style={styles.imageSection}>
            <Text style={styles.label}>Cover Image</Text>

            {previewUri ? (
              <>
                {Platform.OS === "web" ? (
                  <View style={styles.webImageContainer}>
                    <Image
                      source={{
                        uri: previewUri,
                      }}
                      resizeMode="contain"
                      style={[
                        styles.previewImage,
                        {
                          aspectRatio: previewRatio,
                        },
                      ]}
                    />

                    <View style={styles.webImageActions}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.webImageIconButton,
                          pressed && styles.iconPressed,
                          saving && styles.disabledButton,
                        ]}
                        onPress={pickImage}
                        disabled={saving}
                      >
                        <Text style={styles.webImageIcon}>🖼️Change</Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          styles.webImageIconButton,
                          styles.webRemoveIconButton,
                          pressed && styles.iconPressed,
                          saving && styles.disabledButton,
                        ]}
                        onPress={handleRemoveImage}
                        disabled={saving}
                      >
                        <Text style={styles.webImageIcon}>🗑️Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.mobileImageContainer}>
                    <Image
                      source={{
                        uri: previewUri,
                      }}
                      resizeMode="contain"
                      style={[
                        styles.previewImage,
                        {
                          aspectRatio: previewRatio,
                        },
                      ]}
                    />

                    <View style={styles.mobileImageActions}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.changeButton,
                          pressed && styles.pressed,
                          saving && styles.disabledButton,
                        ]}
                        onPress={pickImage}
                        disabled={saving}
                      >
                        <Text style={styles.changeButtonText}>
                          Change Image
                        </Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          styles.removeButton,
                          pressed && styles.pressed,
                          saving && styles.disabledButton,
                        ]}
                        onPress={handleRemoveImage}
                        disabled={saving}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>No cover image</Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.addImageButton,
                    pressed && styles.pressed,
                    saving && styles.disabledButton,
                  ]}
                  onPress={pickImage}
                  disabled={saving}
                >
                  <Text style={styles.addImageButtonText}>🖼️ Add Image</Text>
                </Pressable>

                {removeImage && existingImage && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.keepButton,
                      pressed && styles.pressed,
                    ]}
                    onPress={handleKeepExistingImage}
                    disabled={saving}
                  >
                    <Text style={styles.keepButtonText}>
                      Keep Current Image
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          {/* TITLE */}

          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter blog title"
              placeholderTextColor="#9aa5a2"
              style={styles.input}
              editable={!saving}
            />
          </View>

          {/* BODY */}

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Body</Text>

              <Text style={styles.charCount}>{body.length} characters</Text>
            </View>

            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Enter blog content"
              placeholderTextColor="#9aa5a2"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.bodyInput]}
              editable={!saving}
            />
          </View>

          {/* CATEGORY */}

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>

            <View style={styles.categoryContainer}>
              {CATEGORIES.map((item) => {
                const selected = category === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setCategory(item);
                      setError("");
                      setSuccess("");
                    }}
                    disabled={saving}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      selected && styles.categoryChipSelected,
                      pressed && styles.pressed,
                      saving && styles.disabledButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* BUTTONS */}

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
                saving && styles.disabledButton,
              ]}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.pressed,
                saving && styles.disabledButton,
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
    </View>
  );
}

/* ============================================================ */
/* STYLES                                                        */
/* ============================================================ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fbfbfa",
  },

  keyboard: {
    flex: 1,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    padding: 20,
    paddingBottom: 60,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fbfbfa",
  },

  loadingText: {
    marginTop: 12,
    color: "#8d9995",
    fontSize: 15,
    fontWeight: "500",
  },

  errorEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },

  standaloneErrorText: {
    color: "#c62828",
    fontSize: 15.5,
    fontWeight: "600",
    textAlign: "center",
  },

  /* ======================================================== */
  /* COMMON                                                     */
  /* ======================================================== */

  pressed: {
    opacity: 0.7,
  },

  iconPressed: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  disabledButton: {
    opacity: 0.6,
  },

  /* ======================================================== */
  /* HEADING                                                    */
  /* ======================================================== */

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#14231f",
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  subheading: {
    fontSize: 14.5,
    color: "#8d9995",
    marginBottom: 26,
    fontWeight: "500",
  },

  /* ======================================================== */
  /* IMAGE SECTION                                              */
  /* ======================================================== */

  imageSection: {
    marginBottom: 22,
  },

  previewImage: {
    width: "100%",
    maxHeight: 320,
    backgroundColor: "#eef1f0",
  },

  /* ======================================================== */
  /* WEB IMAGE                                                  */
  /* ======================================================== */

  webImageContainer: {
    position: "relative",
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eef1f0",
  },

  webImageActions: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 20,

    flexDirection: "row",
    gap: 8,
  },

  webImageIconButton: {
    width: 100,
    height: 40,
    borderRadius: 20,

    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },

  webRemoveIconButton: {
    backgroundColor: "#ffffff",
  },

  webImageIcon: {
    fontSize: 17,
  },

  /* ======================================================== */
  /* MOBILE IMAGE                                               */
  /* ======================================================== */

  mobileImageContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e4e2",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eef1f0",
  },

  mobileImageActions: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    backgroundColor: "#ffffff",
  },

  changeButton: {
    flex: 1,
    backgroundColor: "#00695c",
    paddingVertical: 11,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  changeButtonText: {
    color: "#ffffff",
    fontSize: 13.5,
    fontWeight: "700",
  },

  removeButton: {
    flex: 1,
    backgroundColor: "#fdeaea",
    paddingVertical: 11,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  removeButtonText: {
    color: "#c62828",
    fontSize: 13.5,
    fontWeight: "700",
  },

  /* ======================================================== */
  /* NO IMAGE                                                   */
  /* ======================================================== */

  noImageContainer: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: "#e0e4e2",
    borderRadius: 16,
    backgroundColor: "#f1f4f3",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  noImageText: {
    color: "#8d9995",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 14,
  },

  addImageButton: {
    backgroundColor: "#00695c",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 20,
  },

  addImageButtonText: {
    color: "#ffffff",
    fontSize: 13.5,
    fontWeight: "700",
  },

  keepButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e0e4e2",
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },

  keepButtonText: {
    color: "#55635f",
    fontSize: 13.5,
    fontWeight: "700",
  },

  /* ======================================================== */
  /* FORM                                                       */
  /* ======================================================== */

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
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#14231f",
  },

  bodyInput: {
    minHeight: 220,
    lineHeight: 23,
  },

  /* ======================================================== */
  /* CATEGORY                                                   */
  /* ======================================================== */

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryChip: {
    borderWidth: 1,
    borderColor: "#dce2df",
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },

  categoryChipSelected: {
    backgroundColor: "#00695c",
    borderColor: "#00695c",
  },

  categoryChipText: {
    color: "#55635f",
    fontSize: 13.5,
    fontWeight: "600",
  },

  categoryChipTextSelected: {
    color: "#ffffff",
    fontWeight: "700",
  },

  /* ======================================================== */
  /* MESSAGES                                                   */
  /* ======================================================== */

  errorBox: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#ffcdd2",
    padding: 13,
    borderRadius: 12,
    marginBottom: 20,
  },

  errorText: {
    color: "#c62828",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },

  successBox: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#c8e6c9",
    padding: 13,
    borderRadius: 12,
    marginBottom: 20,
  },

  successText: {
    color: "#2e7d32",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
  },

  /* ======================================================== */
  /* BUTTONS                                                    */
  /* ======================================================== */

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    flexWrap: "wrap",
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: "#e0e4e2",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    width: 250,
  },

  cancelButtonText: {
    color: "#55635f",
    fontWeight: "700",
    fontSize: 15,
  },

  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00695c",
    paddingVertical: 14,
    borderRadius: 22,
    width: 250,

    shadowColor: "#00695c",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },

  saveSpinner: {
    marginRight: 8,
  },

  saveButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
