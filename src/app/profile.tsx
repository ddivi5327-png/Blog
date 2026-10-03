// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Image,
//     Platform,
//     Pressable,
//     StyleSheet,
//     Text,
//     View,
// } from "react-native";
// import API_URL from "../api/api";

// type StoredUser = {
//   id: string;
//   name: string;
//   email: string;
// };

// type Author = {
//   _id: string;
//   name: string;
//   email: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   image: string;
//   imageWidth?: number;
//   imageHeight?: number;
//   author: Author;
//   createdAt: string;
// };

// export default function ProfileScreen() {
//   const [user, setUser] = useState<StoredUser | null>(null);

//   const [posts, setPosts] = useState<Post[]>([]);

//   const [loading, setLoading] = useState(true);

//   const [postsLoading, setPostsLoading] = useState(true);

//   const [error, setError] = useState("");

//   const getStoredUser = async () => {
//     try {
//       let userJson: string | null = null;

//       if (Platform.OS === "web") {
//         userJson = localStorage.getItem("user");
//       } else {
//         userJson = await SecureStore.getItemAsync("user");
//       }

//       if (!userJson) {
//         router.replace("/login");
//         return null;
//       }

//       const storedUser: StoredUser = JSON.parse(userJson);

//       if (!storedUser.id) {
//         router.replace("/login");
//         return null;
//       }

//       setUser(storedUser);

//       return storedUser;
//     } catch (error) {
//       console.error("Read stored user error:", error);

//       router.replace("/login");
//       return null;
//     }
//   };

//   const loadMyPosts = async (currentUser: StoredUser) => {
//     try {
//       setPostsLoading(true);
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to load posts");
//         return;
//       }

//       const allPosts: Post[] = data.posts || [];

//       const myPosts = allPosts.filter(
//         (post) => String(post.author?._id) === String(currentUser.id),
//       );

//       setPosts(myPosts);
//     } catch (error) {
//       console.error("My posts error:", error);

//       setError("Unable to load your posts");
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const storedUser = await getStoredUser();

//       if (!storedUser) {
//         return;
//       }

//       await loadMyPosts(storedUser);
//     } catch (error) {
//       console.error("Profile loading error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadProfile();
//     }, []),
//   );

//   const handleLogout = async () => {
//     try {
//       if (Platform.OS === "web") {
//         localStorage.removeItem("token");

//         localStorage.removeItem("user");
//       } else {
//         await SecureStore.deleteItemAsync("token");

//         await SecureStore.deleteItemAsync("user");
//       }

//       router.replace("/login");
//     } catch (error) {
//       console.error("Logout error:", error);

//       if (Platform.OS === "web") {
//         window.alert("Failed to logout");
//       } else {
//         Alert.alert("Error", "Failed to logout");
//       }
//     }
//   };

//   const handlePostPress = (postId: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id: postId,
//       },
//     });
//   };

//   const handleRefresh = useCallback(async () => {
//     if (!user) {
//       return;
//     }

//     await loadMyPosts(user);
//   }, [user]);

//   const handleEditProfile = () => {
//     router.push("/edit-profile");
//   };

//   const renderPost = ({ item }: { item: Post }) => {
//     return (
//       <Pressable
//         style={styles.postCard}
//         onPress={() => handlePostPress(item._id)}
//       >
//         {item.image ? (
//           <Image
//             source={{
//               uri: item.image,
//             }}
//             resizeMode="cover"
//             style={styles.postImage}
//           />
//         ) : null}

//         <View style={styles.postContent}>
//           <Text style={styles.postTitle} numberOfLines={2}>
//             {item.title}
//           </Text>

//           <Text style={styles.postBody} numberOfLines={3}>
//             {item.body}
//           </Text>

//           <Text style={styles.postDate}>
//             {new Date(item.createdAt).toLocaleDateString()}
//           </Text>
//         </View>
//       </Pressable>
//     );
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
//     <View style={styles.container}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderPost}
//         showsVerticalScrollIndicator={false}
//         refreshing={postsLoading}
//         onRefresh={handleRefresh}
//         contentContainerStyle={styles.content}
//         ListHeaderComponent={
//           <>
//             <Text style={styles.heading}>Profile</Text>

//             <View style={styles.profileCard}>
//               <View style={styles.avatar}>
//                 <Text style={styles.avatarText}>
//                   {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                 </Text>
//               </View>

//               <Text style={styles.name}>{user?.name || "User"}</Text>

//               <Text style={styles.email}>{user?.email || ""}</Text>

//               <Pressable
//                 style={styles.editProfileButton}
//                 onPress={handleEditProfile}
//               >
//                 <Text style={styles.editProfileButtonText}>Edit Profile</Text>
//               </Pressable>
//             </View>

//             <View style={styles.statsRow}>
//               <View style={styles.statBox}>
//                 <Text style={styles.statNumber}>{posts.length}</Text>

//                 <Text style={styles.statLabel}>My Posts</Text>
//               </View>
//             </View>

//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>My Posts</Text>
//             </View>

//             {error !== "" && <Text style={styles.errorText}>{error}</Text>}

//             {postsLoading && posts.length === 0 && (
//               <View style={styles.postsLoading}>
//                 <ActivityIndicator />

//                 <Text style={styles.postsLoadingText}>
//                   Loading your posts...
//                 </Text>
//               </View>
//             )}
//           </>
//         }
//         ListEmptyComponent={
//           !postsLoading ? (
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyTitle}>No posts yet</Text>

//               <Text style={styles.emptySubtitle}>
//                 Posts you create will appear here.
//               </Text>
//             </View>
//           ) : null
//         }
//         ListFooterComponent={
//           <Pressable style={styles.logoutButton} onPress={handleLogout}>
//             <Text style={styles.logoutButtonText}>Logout</Text>
//           </Pressable>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   content: {
//     padding: 20,
//     paddingBottom: 40,
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

//   heading: {
//     fontSize: 30,
//     fontWeight: "800",
//     color: "#14231f",
//     marginBottom: 20,
//   },

//   profileCard: {
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//     padding: 24,
//   },

//   avatar: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     backgroundColor: "#00695c",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 14,
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 34,
//     fontWeight: "800",
//   },

//   name: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   email: {
//     fontSize: 15,
//     color: "#777",
//     marginTop: 5,
//   },

//   editProfileButton: {
//     marginTop: 14,
//     backgroundColor: "#eef1f0",
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 10,
//   },

//   editProfileButtonText: {
//     color: "#00695c",
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   statsRow: {
//     flexDirection: "row",
//     marginTop: 16,
//   },

//   statBox: {
//     minWidth: 120,
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//     paddingVertical: 14,
//     paddingHorizontal: 22,
//   },

//   statNumber: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#00695c",
//   },

//   statLabel: {
//     fontSize: 13,
//     color: "#777",
//     marginTop: 3,
//   },

//   sectionHeader: {
//     marginTop: 28,
//     marginBottom: 14,
//   },

//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   postCard: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//     marginBottom: 14,
//     overflow: "hidden",
//   },

//   postImage: {
//     width: "100%",
//     height: 180,
//     backgroundColor: "#eef1f0",
//   },

//   postContent: {
//     padding: 16,
//   },

//   postTitle: {
//     fontSize: 18,
//     lineHeight: 24,
//     fontWeight: "800",
//     color: "#14231f",
//     marginBottom: 7,
//   },

//   postBody: {
//     fontSize: 14,
//     lineHeight: 21,
//     color: "#6b7874",
//   },

//   postDate: {
//     fontSize: 12,
//     color: "#999",
//     marginTop: 10,
//   },

//   postsLoading: {
//     alignItems: "center",
//     paddingVertical: 20,
//   },

//   postsLoadingText: {
//     marginTop: 8,
//     color: "#777",
//   },

//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 35,
//   },

//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#2b3a36",
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: "#999",
//     marginTop: 5,
//     textAlign: "center",
//   },

//   errorText: {
//     color: "#c62828",
//     textAlign: "center",
//     marginBottom: 12,
//   },

//   logoutButton: {
//     alignSelf: "center",
//     backgroundColor: "#c62828",
//     paddingVertical: 12,
//     paddingHorizontal: 28,
//     borderRadius: 10,
//     marginTop: 24,
//   },

//   logoutButtonText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "700",
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Image,
//     Platform,
//     Pressable,
//     StyleSheet,
//     Text,
//     View,
// } from "react-native";
// import API_URL from "../api/api";

// type StoredUser = {
//   id: string;
//   name: string;
//   email: string;
// };

// type Author = {
//   _id: string;
//   name: string;
//   email: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   image: string;
//   imageWidth?: number;
//   imageHeight?: number;
//   author: Author;
//   createdAt: string;
// };

// export default function ProfileScreen() {
//   const [user, setUser] = useState<StoredUser | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [postsLoading, setPostsLoading] = useState(true);
//   const [error, setError] = useState("");

//   const getStoredUser = async () => {
//     try {
//       let userJson: string | null = null;

//       if (Platform.OS === "web") {
//         userJson = localStorage.getItem("user");
//       } else {
//         userJson = await SecureStore.getItemAsync("user");
//       }

//       if (!userJson) {
//         router.replace("/login");
//         return null;
//       }

//       const storedUser: StoredUser = JSON.parse(userJson);

//       if (!storedUser.id) {
//         router.replace("/login");
//         return null;
//       }

//       setUser(storedUser);
//       return storedUser;
//     } catch (error) {
//       console.error("Read stored user error:", error);
//       router.replace("/login");
//       return null;
//     }
//   };

//   const loadMyPosts = async (currentUser: StoredUser) => {
//     try {
//       setPostsLoading(true);
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);
//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to load posts");
//         return;
//       }

//       const allPosts: Post[] = data.posts || [];
//       const myPosts = allPosts.filter(
//         (post) => String(post.author?._id) === String(currentUser.id),
//       );

//       setPosts(myPosts);
//     } catch (error) {
//       console.error("My posts error:", error);
//       setError("Unable to load your posts");
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const storedUser = await getStoredUser();
//       if (!storedUser) return;

//       await loadMyPosts(storedUser);
//     } catch (error) {
//       console.error("Profile loading error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadProfile();
//     }, []),
//   );

//   const handleLogout = async () => {
//     try {
//       if (Platform.OS === "web") {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       } else {
//         await SecureStore.deleteItemAsync("token");
//         await SecureStore.deleteItemAsync("user");
//       }
//       router.replace("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//       if (Platform.OS === "web") {
//         window.alert("Failed to logout");
//       } else {
//         Alert.alert("Error", "Failed to logout");
//       }
//     }
//   };

//   const handlePostPress = (postId: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: { id: postId },
//     });
//   };

//   const handleRefresh = useCallback(async () => {
//     if (!user) return;
//     await loadMyPosts(user);
//   }, [user]);

//   const handleEditProfile = () => {
//     router.push("/edit-profile");
//   };

//   const renderPost = ({ item }: { item: Post }) => {
//     return (
//       <Pressable
//         style={({ pressed }) => [
//           styles.postCard,
//           pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
//         ]}
//         onPress={() => handlePostPress(item._id)}
//       >
//         {item.image ? (
//           <Image
//             source={{ uri: item.image }}
//             resizeMode="cover"
//             style={styles.postImage}
//           />
//         ) : null}

//         <View style={styles.postContent}>
//           <Text style={styles.postTitle} numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text style={styles.postBody} numberOfLines={3}>
//             {item.body}
//           </Text>
//           <View style={styles.postMeta}>
//             <View style={styles.dateBadge}>
//               <Text style={styles.postDate}>
//                 {new Date(item.createdAt).toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </Pressable>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#6366f1" />
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderPost}
//         showsVerticalScrollIndicator={false}
//         refreshing={postsLoading}
//         onRefresh={handleRefresh}
//         contentContainerStyle={styles.listContent}
//         ListHeaderComponent={
//           <>
//             {/* Curved Header Background */}
//             <View style={styles.headerBackground} />

//             {/* Floating Profile Header */}
//             <View style={styles.profileContainer}>
//               <View style={styles.avatarContainer}>
//                 <View style={styles.avatarRing}>
//                   <View style={styles.avatar}>
//                     <Text style={styles.avatarText}>
//                       {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               <Text style={styles.name}>{user?.name || "User"}</Text>
//               <Text style={styles.email}>{user?.email || ""}</Text>

//               <View style={styles.actionRow}>
//                 <Pressable
//                   style={({ pressed }) => [
//                     styles.editButton,
//                     pressed && styles.btnPressed,
//                   ]}
//                   onPress={handleEditProfile}
//                 >
//                   <Text style={styles.editButtonText}>Edit Profile</Text>
//                 </Pressable>

//                 <Pressable
//                   style={({ pressed }) => [
//                     styles.logoutButton,
//                     pressed && styles.btnPressed,
//                   ]}
//                   onPress={handleLogout}
//                 >
//                   <Text style={styles.logoutButtonText}>Logout</Text>
//                 </Pressable>
//               </View>

//               {/* Floating Stats Card */}
//               <View style={styles.statsCard}>
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>{posts.length}</Text>
//                   <Text style={styles.statLabel}>Total Posts</Text>
//                 </View>
//                 <View style={styles.statDivider} />
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>0</Text>
//                   <Text style={styles.statLabel}>Views</Text>
//                 </View>
//                 <View style={styles.statDivider} />
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>0</Text>
//                   <Text style={styles.statLabel}>Likes</Text>
//                 </View>
//               </View>
//             </View>

//             {/* Section Title */}
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>My Posts</Text>
//               <View style={styles.sectionLine} />
//             </View>

//             {error !== "" && <Text style={styles.errorText}>{error}</Text>}

//             {postsLoading && posts.length === 0 && (
//               <View style={styles.postsLoading}>
//                 <ActivityIndicator color="#6366f1" />
//                 <Text style={styles.postsLoadingText}>
//                   Loading your posts...
//                 </Text>
//               </View>
//             )}
//           </>
//         }
//         ListEmptyComponent={
//           !postsLoading ? (
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyEmoji}>📝</Text>
//               <Text style={styles.emptyTitle}>No posts yet</Text>
//               <Text style={styles.emptySubtitle}>
//                 Posts you create will appear here.
//               </Text>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC", // Soft slate background
//   },
//   listContent: {
//     paddingBottom: 40,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//   },
//   loadingText: {
//     marginTop: 12,
//     color: "#64748B",
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   // Header & Profile
//   headerBackground: {
//     height: 180,
//     backgroundColor: "#4f46e5", // Rich Indigo
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//   },
//   profileContainer: {
//     alignItems: "center",
//     marginTop: -70, // Pulls avatar up into the header
//     paddingHorizontal: 20,
//   },
//   avatarContainer: {
//     marginBottom: 16,
//   },
//   avatarRing: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#FFFFFF",
//     padding: 4,
//     shadowColor: "#4f46e5",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 10,
//   },
//   avatar: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 60,
//     backgroundColor: "#312e81",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#F8FAFC",
//   },
//   avatarText: {
//     color: "#FFFFFF",
//     fontSize: 42,
//     fontWeight: "800",
//   },
//   name: {
//     fontSize: 26,
//     fontWeight: "800",
//     color: "#0F172A",
//     letterSpacing: -0.5,
//   },
//   email: {
//     fontSize: 15,
//     color: "#64748B",
//     marginTop: 4,
//     marginBottom: 20,
//   },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 12,
//     width: "100%",
//   },
//   editButton: {
//     flex: 1,
//     backgroundColor: "#4f46e5",
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: "center",
//     shadowColor: "#4f46e5",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   editButtonText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   logoutButton: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   logoutButtonText: {
//     color: "#EF4444",
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   btnPressed: {
//     transform: [{ scale: 0.97 }],
//     opacity: 0.9,
//   },

//   // Stats Card
//   statsCard: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 20,
//     borderRadius: 20,
//     marginTop: 24,
//     width: "100%",
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.05,
//     shadowRadius: 20,
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: "#F1F5F9",
//   },
//   statItem: {
//     flex: 1,
//     alignItems: "center",
//   },
//   statNumber: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#0F172A",
//   },
//   statLabel: {
//     fontSize: 13,
//     color: "#64748B",
//     marginTop: 4,
//     fontWeight: "600",
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: "#E2E8F0",
//   },

//   // Posts Section
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 32,
//     marginBottom: 16,
//     paddingHorizontal: 4,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#0F172A",
//     marginRight: 12,
//   },
//   sectionLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E2E8F0",
//   },
//   postCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 24,
//     marginBottom: 20,
//     overflow: "hidden",
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.08,
//     shadowRadius: 16,
//     elevation: 6,
//     borderWidth: 1,
//     borderColor: "#F1F5F9",
//   },
//   postImage: {
//     width: "100%",
//     height: 180,
//     backgroundColor: "#E2E8F0",
//   },
//   postContent: {
//     padding: 18,
//   },
//   postTitle: {
//     fontSize: 18,
//     lineHeight: 24,
//     fontWeight: "800",
//     color: "#0F172A",
//     marginBottom: 8,
//   },
//   postBody: {
//     fontSize: 14,
//     lineHeight: 21,
//     color: "#64748B",
//   },
//   postMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 16,
//   },
//   dateBadge: {
//     backgroundColor: "#F1F5F9",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   postDate: {
//     fontSize: 12,
//     color: "#64748B",
//     fontWeight: "700",
//   },

//   // Empty & Loading States
//   postsLoading: {
//     alignItems: "center",
//     paddingVertical: 40,
//   },
//   postsLoadingText: {
//     marginTop: 12,
//     color: "#64748B",
//     fontSize: 14,
//   },
//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 60,
//   },
//   emptyEmoji: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#0F172A",
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: "#64748B",
//     marginTop: 8,
//     textAlign: "center",
//   },
//   errorText: {
//     color: "#EF4444",
//     textAlign: "center",
//     marginBottom: 16,
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import API_URL from "../api/api";

// type StoredUser = {
//   id: string;
//   name: string;
//   email: string;
// };

// type Author = {
//   _id: string;
//   name: string;
//   email: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   image: string;
//   imageWidth?: number;
//   imageHeight?: number;
//   author: Author;
//   createdAt: string;
// };

// export default function ProfileScreen() {
//   const [user, setUser] = useState<StoredUser | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [postsLoading, setPostsLoading] = useState(true);
//   const [error, setError] = useState("");

//   const getStoredUser = async () => {
//     try {
//       let userJson: string | null = null;

//       if (Platform.OS === "web") {
//         userJson = localStorage.getItem("user");
//       } else {
//         userJson = await SecureStore.getItemAsync("user");
//       }

//       if (!userJson) {
//         router.replace("/login");
//         return null;
//       }

//       const storedUser: StoredUser = JSON.parse(userJson);

//       if (!storedUser.id) {
//         router.replace("/login");
//         return null;
//       }

//       setUser(storedUser);
//       return storedUser;
//     } catch (error) {
//       console.error("Read stored user error:", error);
//       router.replace("/login");
//       return null;
//     }
//   };

//   const loadMyPosts = async (currentUser: StoredUser) => {
//     try {
//       setPostsLoading(true);
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);
//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to load posts");
//         return;
//       }

//       const allPosts: Post[] = data.posts || [];
//       const myPosts = allPosts.filter(
//         (post) => String(post.author?._id) === String(currentUser.id),
//       );

//       setPosts(myPosts);
//     } catch (error) {
//       console.error("My posts error:", error);
//       setError("Unable to load your posts");
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const storedUser = await getStoredUser();
//       if (!storedUser) return;

//       await loadMyPosts(storedUser);
//     } catch (error) {
//       console.error("Profile loading error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadProfile();
//     }, []),
//   );

//   const handleLogout = async () => {
//     try {
//       if (Platform.OS === "web") {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       } else {
//         await SecureStore.deleteItemAsync("token");
//         await SecureStore.deleteItemAsync("user");
//       }
//       router.replace("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//       if (Platform.OS === "web") {
//         window.alert("Failed to logout");
//       } else {
//         Alert.alert("Error", "Failed to logout");
//       }
//     }
//   };

//   const handlePostPress = (postId: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: { id: postId },
//     });
//   };

//   const handleRefresh = useCallback(async () => {
//     if (!user) return;
//     await loadMyPosts(user);
//   }, [user]);

//   const handleEditProfile = () => {
//     router.push("/edit-profile");
//   };

//   const renderPost = ({ item }: { item: Post }) => {
//     return (
//       <Pressable
//         style={({ pressed }) => [
//           styles.postCard,
//           pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
//         ]}
//         onPress={() => handlePostPress(item._id)}
//       >
//         {item.image ? (
//           <Image
//             source={{ uri: item.image }}
//             resizeMode="cover"
//             style={styles.postImage}
//           />
//         ) : null}

//         <View style={styles.postContent}>
//           <Text style={styles.postTitle} numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text style={styles.postBody} numberOfLines={3}>
//             {item.body}
//           </Text>
//           <View style={styles.postMeta}>
//             <View style={styles.dateBadge}>
//               <Text style={styles.postDate}>
//                 {new Date(item.createdAt).toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </Pressable>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#00695c" />
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderPost}
//         showsVerticalScrollIndicator={false}
//         refreshing={postsLoading}
//         onRefresh={handleRefresh}
//         contentContainerStyle={styles.listContent}
//         ListHeaderComponent={
//           <>
//             {/* Curved header background */}
//             <View style={styles.headerBackground} />

//             <View style={styles.centerWrap}>
//               {/* Floating profile card */}
//               <View style={styles.profileContainer}>
//                 <View style={styles.avatarRing}>
//                   <View style={styles.avatar}>
//                     <Text style={styles.avatarText}>
//                       {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                     </Text>
//                   </View>
//                 </View>

//                 <Text style={styles.name}>{user?.name || "User"}</Text>
//                 <Text style={styles.email}>{user?.email || ""}</Text>

//                 <View style={styles.actionRow}>
//                   <Pressable
//                     style={({ pressed }) => [
//                       styles.editButton,
//                       pressed && styles.btnPressed,
//                     ]}
//                     onPress={handleEditProfile}
//                   >
//                     <Text style={styles.editButtonText}>Edit Profile</Text>
//                   </Pressable>

//                   <Pressable
//                     style={({ pressed }) => [
//                       styles.logoutButton,
//                       pressed && styles.btnPressed,
//                     ]}
//                     onPress={handleLogout}
//                   >
//                     <Text style={styles.logoutButtonText}>Logout</Text>
//                   </Pressable>
//                 </View>

//                 {/* Stats card */}
//                 <View style={styles.statsCard}>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statNumber}>{posts.length}</Text>
//                     <Text style={styles.statLabel}>Total Posts</Text>
//                   </View>
//                   <View style={styles.statDivider} />
//                   <View style={styles.statItem}>
//                     <Text style={styles.statNumber}>0</Text>
//                     <Text style={styles.statLabel}>Views</Text>
//                   </View>
//                   <View style={styles.statDivider} />
//                   <View style={styles.statItem}>
//                     <Text style={styles.statNumber}>0</Text>
//                     <Text style={styles.statLabel}>Likes</Text>
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>My Posts</Text>
//                 <View style={styles.sectionLine} />
//               </View>

//               {error !== "" && <Text style={styles.errorText}>{error}</Text>}

//               {postsLoading && posts.length === 0 && (
//                 <View style={styles.postsLoading}>
//                   <ActivityIndicator color="#00695c" />
//                   <Text style={styles.postsLoadingText}>
//                     Loading your posts...
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </>
//         }
//         ListEmptyComponent={
//           !postsLoading ? (
//             <View style={styles.centerWrap}>
//               <View style={styles.emptyState}>
//                 <Text style={styles.emptyEmoji}>📝</Text>
//                 <Text style={styles.emptyTitle}>No posts yet</Text>
//                 <Text style={styles.emptySubtitle}>
//                   Posts you create will appear here.
//                 </Text>
//               </View>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   listContent: {
//     paddingBottom: 40,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fbfbfa",
//   },

//   loadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   centerWrap: {
//     width: "100%",
//     maxWidth: 720,
//     alignSelf: "center",
//     paddingHorizontal: 20,
//   },

//   // Header & profile

//   // headerBackground: {
//   //   height: 170,
//   //   backgroundColor: "#00695c",
//   //   borderBottomLeftRadius: 36,
//   //   borderBottomRightRadius: 36,
//   // },

//   profileContainer: {
//     alignItems: "center",
//     marginTop: 10,
//   },

//   avatarRing: {
//     width: 116,
//     height: 116,
//     borderRadius: 58,
//     backgroundColor: "#fff",
//     padding: 4,
//     marginBottom: 16,
//     shadowColor: "#00352e",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.22,
//     shadowRadius: 16,
//     elevation: 10,
//   },

//   avatar: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 54,
//     backgroundColor: "#004d40",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fbfbfa",
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 40,
//     fontWeight: "800",
//   },

//   name: {
//     fontSize: 25,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//   },

//   email: {
//     fontSize: 14.5,
//     color: "#8d9995",
//     marginTop: 4,
//     marginBottom: 20,
//   },

//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 12,
//     width: "100%",
//   },

//   editButton: {
//     flex: 1,
//     backgroundColor: "#00695c",
//     paddingVertical: 13,
//     borderRadius: 22,
//     alignItems: "center",
//     shadowColor: "#00695c",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   editButtonText: {
//     color: "#fff",
//     fontSize: 14.5,
//     fontWeight: "700",
//   },

//   logoutButton: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingVertical: 13,
//     borderRadius: 22,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e6e8e7",
//   },

//   logoutButtonText: {
//     color: "#c62828",
//     fontSize: 14.5,
//     fontWeight: "700",
//   },

//   btnPressed: {
//     transform: [{ scale: 0.97 }],
//     opacity: 0.9,
//   },

//   // Stats card

//   statsCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     paddingVertical: 20,
//     borderRadius: 20,
//     marginTop: 24,
//     width: "100%",
//     shadowColor: "#0d2b25",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.05,
//     shadowRadius: 16,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//   },

//   statItem: {
//     flex: 1,
//     alignItems: "center",
//   },

//   statNumber: {
//     fontSize: 21,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   statLabel: {
//     fontSize: 12.5,
//     color: "#8d9995",
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   statDivider: {
//     width: 1,
//     backgroundColor: "#eceeed",
//   },

//   // Posts section

//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 34,
//     justifyContent: "center",
//     marginBottom: 16,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#14231f",

//     alignItems: "center",
//     // marginRight: 12,
//     letterSpacing: -0.2,
//   },

//   // sectionLine: {
//   //   flex: 1,
//   //   height: 1,
//   //   backgroundColor: "#eceeed",
//   // },

//   postCard: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     marginBottom: 16,
//     overflow: "hidden",
//     shadowColor: "#0d2b25",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//   },

//   postImage: {
//     width: "100%",
//     height: 170,
//     backgroundColor: "#eef1f0",
//   },

//   postContent: {
//     padding: 18,
//   },

//   postTitle: {
//     fontSize: 17.5,
//     lineHeight: 23,
//     fontWeight: "800",
//     color: "#14231f",
//     marginBottom: 8,
//     letterSpacing: -0.2,
//   },

//   postBody: {
//     fontSize: 14,
//     lineHeight: 20.5,
//     color: "#6b7874",
//   },

//   postMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 14,
//   },

//   dateBadge: {
//     backgroundColor: "#f1f4f3",
//     paddingVertical: 5,
//     paddingHorizontal: 11,
//     borderRadius: 8,
//   },

//   postDate: {
//     fontSize: 11.5,
//     color: "#55635f",
//     fontWeight: "700",
//   },

//   // Empty & loading states

//   postsLoading: {
//     alignItems: "center",
//     paddingVertical: 40,
//   },

//   postsLoadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 14,
//   },

//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 60,
//   },

//   emptyEmoji: {
//     fontSize: 46,
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: "#8d9995",
//     marginTop: 6,
//     textAlign: "center",
//   },

//   errorText: {
//     color: "#c62828",
//     textAlign: "center",
//     marginBottom: 16,
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import API_URL from "../api/api";

// type StoredUser = {
//   id: string;
//   name: string;
//   email: string;
// };

// type Author = {
//   _id: string;
//   name: string;
//   email: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   image: string;
//   imageWidth?: number;
//   imageHeight?: number;
//   author: Author;
//   createdAt: string;
// };

// export default function ProfileScreen() {
//   const [user, setUser] = useState<StoredUser | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [postsLoading, setPostsLoading] = useState(true);
//   const [error, setError] = useState("");

//   const getStoredUser = async () => {
//     try {
//       let userJson: string | null = null;

//       if (Platform.OS === "web") {
//         userJson = localStorage.getItem("user");
//       } else {
//         userJson = await SecureStore.getItemAsync("user");
//       }

//       if (!userJson) {
//         router.replace("/login");
//         return null;
//       }

//       const storedUser: StoredUser = JSON.parse(userJson);

//       if (!storedUser.id) {
//         router.replace("/login");
//         return null;
//       }

//       setUser(storedUser);
//       return storedUser;
//     } catch (error) {
//       console.error("Read stored user error:", error);
//       router.replace("/login");
//       return null;
//     }
//   };

//   const loadMyPosts = async (currentUser: StoredUser) => {
//     try {
//       setPostsLoading(true);
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);
//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to load posts");
//         return;
//       }

//       const allPosts: Post[] = data.posts || [];
//       const myPosts = allPosts.filter(
//         (post) => String(post.author?._id) === String(currentUser.id),
//       );

//       setPosts(myPosts);
//     } catch (error) {
//       console.error("My posts error:", error);
//       setError("Unable to load your posts");
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const storedUser = await getStoredUser();
//       if (!storedUser) return;

//       await loadMyPosts(storedUser);
//     } catch (error) {
//       console.error("Profile loading error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadProfile();
//     }, []),
//   );

//   const handleLogout = async () => {
//     try {
//       if (Platform.OS === "web") {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       } else {
//         await SecureStore.deleteItemAsync("token");
//         await SecureStore.deleteItemAsync("user");
//       }
//       router.replace("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//       if (Platform.OS === "web") {
//         window.alert("Failed to logout");
//       } else {
//         Alert.alert("Error", "Failed to logout");
//       }
//     }
//   };

//   const handlePostPress = (postId: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: { id: postId },
//     });
//   };

//   const handleRefresh = useCallback(async () => {
//     if (!user) return;
//     await loadMyPosts(user);
//   }, [user]);

//   const handleEditProfile = () => {
//     router.push("/edit-profile");
//   };

//   const renderPost = ({ item }: { item: Post }) => {
//     const imageRatio =
//       item.imageWidth && item.imageHeight
//         ? item.imageWidth / item.imageHeight
//         : 16 / 9;

//     return (
//       <Pressable
//         style={({ pressed }) => [
//           styles.postCard,
//           pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
//         ]}
//         onPress={() => handlePostPress(item._id)}
//       >
//         {item.image ? (
//           <Image
//             source={{ uri: item.image }}
//             resizeMode="cover"
//             // style={[styles.postImage, { aspectRatio: imageRatio }]}
//             style={styles.postImage}
//           />
//         ) : (
//           <View style={styles.postImagePlaceholder}>
//             <Text style={styles.postImagePlaceholderIcon}>📄</Text>
//           </View>
//         )}

//         <View style={styles.postContent}>
//           <Text style={styles.postTitle} numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text style={styles.postBody} numberOfLines={3}>
//             {item.body}
//           </Text>
//           <View style={styles.postMeta}>
//             <View style={styles.dateBadge}>
//               <Text style={styles.postDate}>
//                 {new Date(item.createdAt).toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </Pressable>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#00695c" />
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderPost}
//         showsVerticalScrollIndicator={false}
//         refreshing={postsLoading}
//         onRefresh={handleRefresh}
//         contentContainerStyle={styles.listContent}
//         ListHeaderComponent={
//           <View style={styles.centerWrap}>
//             {/* <Text style={styles.pageTitle}>Profile</Text> */}

//             {/* Profile card */}
//             <View style={styles.profileContainer}>
//               <View style={styles.avatarRing}>
//                 <View style={styles.avatar}>
//                   <Text style={styles.avatarText}>
//                     {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </Text>
//                 </View>
//               </View>

//               <Text style={styles.name}>{user?.name || "User"}</Text>
//               <Text style={styles.email}>{user?.email || ""}</Text>

//               <View style={styles.actionRow}>
//                 <Pressable
//                   style={({ pressed }) => [
//                     styles.editButton,
//                     pressed && styles.btnPressed,
//                   ]}
//                   onPress={handleEditProfile}
//                 >
//                   <Text style={styles.editButtonText}>Edit Profile</Text>
//                 </Pressable>

//                 {/* <Pressable
//                   style={({ pressed }) => [
//                     styles.logoutButton,
//                     pressed && styles.btnPressed,
//                   ]}
//                   onPress={handleLogout}
//                 >
//                   <Text style={styles.logoutButtonText}>Logout</Text>
//                 </Pressable> */}
//               </View>

//               {/* Stats card */}
//               <View style={styles.statsCard}>
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>{posts.length}</Text>
//                   <Text style={styles.statLabel}>Total Posts</Text>
//                 </View>
//                 <View style={styles.statDivider} />
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>0</Text>
//                   <Text style={styles.statLabel}>Comments</Text>
//                 </View>
//                 <View style={styles.statDivider} />
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>0</Text>
//                   <Text style={styles.statLabel}>Likes</Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>My Posts</Text>
//               <View style={styles.sectionLine} />
//             </View>

//             {error !== "" && <Text style={styles.errorText}>{error}</Text>}

//             {postsLoading && posts.length === 0 && (
//               <View style={styles.postsLoading}>
//                 <ActivityIndicator color="#00695c" />
//                 <Text style={styles.postsLoadingText}>
//                   Loading your posts...
//                 </Text>
//               </View>
//             )}
//           </View>
//         }
//         ListEmptyComponent={
//           !postsLoading ? (
//             <View style={styles.centerWrap}>
//               <View style={styles.emptyState}>
//                 <Text style={styles.emptyEmoji}>📝</Text>
//                 <Text style={styles.emptyTitle}>No posts yet</Text>
//                 <Text style={styles.emptySubtitle}>
//                   Posts you create will appear here.
//                 </Text>
//               </View>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   listContent: {
//     paddingBottom: 40,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fbfbfa",
//   },

//   loadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   centerWrap: {
//     width: "100%",
//     // maxWidth: 720,
//     alignSelf: "center",
//     paddingHorizontal: 20,
//   },

//   pageTitle: {
//     fontSize: 26,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//     marginTop: 24,
//     marginBottom: 22,
//   },

//   // Profile card

//   profileContainer: {
//     alignItems: "center",
//   },

//   avatarRing: {
//     width: 112,
//     height: 112,
//     borderRadius: 56,
//     backgroundColor: "#fff",
//     padding: 4,
//     marginBottom: 16,
//     shadowColor: "#00352e",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.16,
//     shadowRadius: 16,
//     elevation: 6,
//   },

//   avatar: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 52,
//     backgroundColor: "#004d40",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fbfbfa",
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 38,
//     fontWeight: "800",
//   },

//   name: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//   },

//   email: {
//     fontSize: 14.5,
//     color: "#8d9995",
//     marginTop: 4,
//     marginBottom: 20,
//   },

//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 12,
//     width: "100%",
//   },

//   editButton: {
//     // flex: 1,
//     backgroundColor: "#00695c",
//     paddingVertical: 13,
//     borderRadius: 22,
//     alignItems: "center",
//     shadowColor: "#00695c",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 4,
//     width: 200,
//   },

//   editButtonText: {
//     color: "#fff",
//     fontSize: 14.5,
//     fontWeight: "700",
//   },

//   // logoutButton: {
//   //   flex: 1,
//   //   backgroundColor: "#fff",
//   //   paddingVertical: 13,
//   //   borderRadius: 22,
//   //   alignItems: "center",
//   //   borderWidth: 1,
//   //   borderColor: "#e6e8e7",
//   // },

//   logoutButtonText: {
//     color: "#c62828",
//     fontSize: 14.5,
//     fontWeight: "700",
//   },

//   btnPressed: {
//     transform: [{ scale: 0.97 }],
//     opacity: 0.9,
//   },

//   // Stats card

//   statsCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     paddingVertical: 20,
//     borderRadius: 20,
//     marginTop: 24,
//     width: "100%",
//     shadowColor: "#0d2b25",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.05,
//     shadowRadius: 16,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//   },

//   statItem: {
//     flex: 1,
//     alignItems: "center",
//   },

//   statNumber: {
//     fontSize: 21,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   statLabel: {
//     fontSize: 12.5,
//     color: "#8d9995",
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   statDivider: {
//     width: 1,
//     backgroundColor: "#eceeed",
//   },

//   // Posts section

//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 34,
//     marginBottom: 16,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#14231f",
//     marginRight: 12,
//     letterSpacing: -0.2,
//   },

//   sectionLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#eceeed",
//   },

//   postCard: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     marginBottom: 16,
//     overflow: "hidden",
//     shadowColor: "#0d2b25",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//   },

//   // postImage: {
//   //   width: "100%",
//   //   maxHeight: 320,
//   //   backgroundColor: "#eef1f0",
//   // },
//   // in styles:
//   // postImage: {
//   //   width: "100%",
//   //   height: 300, // fixed — this is what forces cropping
//   //   backgroundColor: "#eef1f0",
//   // },
//   // postImage: {
//   //   width: "100%",
//   //   aspectRatio: 12 / 7,
//   //   resizeMode: "contain",
//   //   backgroundColor: "#eef1f0",
//   //   maxHeight: 350,
//   // },
//   postImage: {
//     width: "60%",
//     height: 200,
//     resizeMode: "cover",
//     backgroundColor: "#eef1f0",
//   },
//   postImagePlaceholder: {
//     width: "100%",
//     height: 90,
//     backgroundColor: "#f1f4f3",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   postImagePlaceholderIcon: {
//     fontSize: 26,
//     opacity: 0.5,
//   },

//   postContent: {
//     padding: 18,
//   },

//   postTitle: {
//     fontSize: 17.5,
//     lineHeight: 23,
//     fontWeight: "800",
//     color: "#14231f",
//     marginBottom: 8,
//     letterSpacing: -0.2,
//   },

//   postBody: {
//     fontSize: 14,
//     lineHeight: 20.5,
//     color: "#6b7874",
//   },

//   postMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 14,
//   },

//   dateBadge: {
//     backgroundColor: "#f1f4f3",
//     paddingVertical: 5,
//     paddingHorizontal: 11,
//     borderRadius: 8,
//   },

//   postDate: {
//     fontSize: 11.5,
//     color: "#55635f",
//     fontWeight: "700",
//   },

//   // Empty & loading states

//   postsLoading: {
//     alignItems: "center",
//     paddingVertical: 40,
//   },

//   postsLoadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 14,
//   },

//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 60,
//   },

//   emptyEmoji: {
//     fontSize: 46,
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: "#8d9995",
//     marginTop: 6,
//     textAlign: "center",
//   },

//   errorText: {
//     color: "#c62828",
//     textAlign: "center",
//     marginBottom: 16,
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });

// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import API_URL from "../api/api";

// type StoredUser = {
//   id: string;
//   name: string;
//   email: string;
// };

// type Author = {
//   _id: string;
//   name: string;
//   email: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   image: string;
//   imageWidth?: number;
//   imageHeight?: number;
//   author: Author;
//   createdAt: string;
// };

// type PostStats = {
//   likeCount: number;
//   commentCount: number;
// };

// export default function ProfileScreen() {
//   const [user, setUser] = useState<StoredUser | null>(null);

//   const [posts, setPosts] = useState<Post[]>([]);

//   const [postStats, setPostStats] = useState<Record<string, PostStats>>({});

//   const [loading, setLoading] = useState(true);

//   const [postsLoading, setPostsLoading] = useState(true);

//   const [error, setError] = useState("");

//   const getToken = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("token");
//     }

//     return await SecureStore.getItemAsync("token");
//   };

//   const getStoredUser = async () => {
//     try {
//       let userJson: string | null = null;

//       if (Platform.OS === "web") {
//         userJson = localStorage.getItem("user");
//       } else {
//         userJson = await SecureStore.getItemAsync("user");
//       }

//       if (!userJson) {
//         router.replace("/login");
//         return null;
//       }

//       const storedUser: StoredUser = JSON.parse(userJson);

//       if (!storedUser.id) {
//         router.replace("/login");
//         return null;
//       }

//       setUser(storedUser);

//       return storedUser;
//     } catch (error) {
//       console.error("Read stored user error:", error);

//       router.replace("/login");
//       return null;
//     }
//   };

//   const loadPostStats = async (postList: Post[]) => {
//     try {
//       const token = await getToken();

//       const results = await Promise.all(
//         postList.map(async (post) => {
//           let likeCount = 0;
//           let commentCount = 0;

//           /* Likes */

//           try {
//             const likeResponse = await fetch(
//               `${API_URL}/api/likes/${post._id}`,
//               token
//                 ? {
//                     headers: {
//                       Authorization: `Bearer ${token}`,
//                     },
//                   }
//                 : undefined,
//             );

//             const likeData = await likeResponse.json();

//             if (likeResponse.ok) {
//               likeCount = Number(likeData.likeCount) || 0;
//             }
//           } catch (error) {
//             console.error("Load likes error:", error);
//           }

//           /* Comments */

//           try {
//             const commentResponse = await fetch(
//               `${API_URL}/api/comments/post/${post._id}`,
//             );

//             const commentData = await commentResponse.json();

//             if (commentResponse.ok && Array.isArray(commentData.comments)) {
//               commentCount = commentData.comments.length;
//             }
//           } catch (error) {
//             console.error("Load comments error:", error);
//           }

//           return {
//             postId: post._id,
//             likeCount,
//             commentCount,
//           };
//         }),
//       );

//       const statsMap: Record<string, PostStats> = {};

//       results.forEach((result) => {
//         statsMap[result.postId] = {
//           likeCount: result.likeCount,
//           commentCount: result.commentCount,
//         };
//       });

//       setPostStats(statsMap);
//     } catch (error) {
//       console.error("Load post stats error:", error);
//     }
//   };

//   const loadMyPosts = async (currentUser: StoredUser) => {
//     try {
//       setPostsLoading(true);
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to load posts");
//         return;
//       }

//       const allPosts: Post[] = data.posts || [];

//       const myPosts = allPosts.filter(
//         (post) => String(post.author?._id) === String(currentUser.id),
//       );

//       setPosts(myPosts);

//       await loadPostStats(myPosts);
//     } catch (error) {
//       console.error("My posts error:", error);

//       setError("Unable to load your posts");
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const storedUser = await getStoredUser();

//       if (!storedUser) {
//         return;
//       }

//       await loadMyPosts(storedUser);
//     } catch (error) {
//       console.error("Profile loading error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadProfile();
//     }, []),
//   );

//   const handleLogout = async () => {
//     try {
//       if (Platform.OS === "web") {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       } else {
//         await SecureStore.deleteItemAsync("token");

//         await SecureStore.deleteItemAsync("user");
//       }

//       router.replace("/login");
//     } catch (error) {
//       console.error("Logout error:", error);

//       if (Platform.OS === "web") {
//         window.alert("Failed to logout");
//       } else {
//         Alert.alert("Error", "Failed to logout");
//       }
//     }
//   };

//   const handlePostPress = (postId: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id: postId,
//       },
//     });
//   };

//   const handleRefresh = useCallback(async () => {
//     if (!user) {
//       return;
//     }

//     await loadMyPosts(user);
//   }, [user]);

//   const handleEditProfile = () => {
//     router.push("/edit-profile");
//   };

//   const getTotalLikes = () => {
//     return posts.reduce(
//       (total, post) => total + (postStats[post._id]?.likeCount || 0),
//       0,
//     );
//   };

//   const getTotalComments = () => {
//     return posts.reduce(
//       (total, post) => total + (postStats[post._id]?.commentCount || 0),
//       0,
//     );
//   };

//   const renderPost = ({ item }: { item: Post }) => {
//     const hasImage = !!item.image;

//     const imageRatio =
//       item.imageWidth && item.imageHeight
//         ? item.imageWidth / item.imageHeight
//         : 16 / 9;

//     return (
//       <Pressable
//         style={({ pressed }) => [
//           styles.postCard,
//           pressed && styles.postPressed,
//         ]}
//         onPress={() => handlePostPress(item._id)}
//       >
//         {hasImage && (
//           <Image
//             source={{
//               uri: item.image,
//             }}
//             resizeMode="contain"
//             style={[
//               styles.postImage,
//               {
//                 aspectRatio: imageRatio,
//               },
//             ]}
//           />
//         )}

//         <View style={styles.postContent}>
//           <Text style={styles.postTitle} numberOfLines={2}>
//             {item.title}
//           </Text>

//           <Text style={styles.postBody} numberOfLines={3}>
//             {item.body}
//           </Text>

//           <View style={styles.postBottomRow}>
//             <View style={styles.dateBadge}>
//               <Text style={styles.postDate}>
//                 {new Date(item.createdAt).toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </Text>
//             </View>

//             <View style={styles.postStats}>
//               <Text style={styles.postStatText}>
//                 {postStats[item._id]?.likeCount || 0} ♥
//               </Text>

//               <Text style={styles.postStatText}>
//                 {postStats[item._id]?.commentCount || 0} 💬
//               </Text>
//             </View>
//           </View>
//         </View>
//       </Pressable>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#00695c" />

//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderPost}
//         showsVerticalScrollIndicator={false}
//         refreshing={postsLoading}
//         onRefresh={handleRefresh}
//         contentContainerStyle={styles.listContent}
//         ListHeaderComponent={
//           <View style={styles.centerWrap}>
//             <View style={styles.profileContainer}>
//               <View style={styles.avatarRing}>
//                 <View style={styles.avatar}>
//                   <Text style={styles.avatarText}>
//                     {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </Text>
//                 </View>
//               </View>

//               <Text style={styles.name}>{user?.name || "User"}</Text>

//               <Text style={styles.email}>{user?.email || ""}</Text>

//               <View style={styles.actionRow}>
//                 <Pressable
//                   style={({ pressed }) => [
//                     styles.editButton,
//                     pressed && styles.btnPressed,
//                   ]}
//                   onPress={handleEditProfile}
//                 >
//                   <Text style={styles.editButtonText}>Edit Profile</Text>
//                 </Pressable>
//               </View>

//               <View style={styles.statsCard}>
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>{posts.length}</Text>

//                   <Text style={styles.statLabel}>Total Posts</Text>
//                 </View>

//                 <View style={styles.statDivider} />

//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>{getTotalComments()}</Text>

//                   <Text style={styles.statLabel}>Comments</Text>
//                 </View>

//                 <View style={styles.statDivider} />

//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>{getTotalLikes()}</Text>

//                   <Text style={styles.statLabel}>Likes</Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>My Posts</Text>

//               <View style={styles.sectionLine} />
//             </View>

//             {error !== "" && <Text style={styles.errorText}>{error}</Text>}

//             {postsLoading && posts.length === 0 && (
//               <View style={styles.postsLoading}>
//                 <ActivityIndicator color="#00695c" />

//                 <Text style={styles.postsLoadingText}>
//                   Loading your posts...
//                 </Text>
//               </View>
//             )}
//           </View>
//         }
//         ListEmptyComponent={
//           !postsLoading ? (
//             <View style={styles.centerWrap}>
//               <View style={styles.emptyState}>
//                 <Text style={styles.emptyEmoji}>📝</Text>

//                 <Text style={styles.emptyTitle}>No posts yet</Text>

//                 <Text style={styles.emptySubtitle}>
//                   Posts you create will appear here.
//                 </Text>
//               </View>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   listContent: {
//     paddingBottom: 40,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fbfbfa",
//   },

//   loadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   centerWrap: {
//     width: "100%",
//     alignSelf: "center",
//     paddingHorizontal: 20,
//   },

//   profileContainer: {
//     alignItems: "center",
//   },

//   avatarRing: {
//     width: 112,
//     height: 112,
//     borderRadius: 56,
//     backgroundColor: "#fff",
//     padding: 4,
//     marginBottom: 16,
//     shadowColor: "#00352e",
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.16,
//     shadowRadius: 16,
//     elevation: 6,
//   },

//   avatar: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 52,
//     backgroundColor: "#004d40",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fbfbfa",
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 38,
//     fontWeight: "800",
//   },

//   name: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//   },

//   email: {
//     fontSize: 14.5,
//     color: "#8d9995",
//     marginTop: 4,
//     marginBottom: 20,
//   },

//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     width: "100%",
//   },

//   editButton: {
//     backgroundColor: "#00695c",
//     paddingVertical: 13,
//     borderRadius: 22,
//     alignItems: "center",
//     justifyContent: "center",
//     width: 200,
//     shadowColor: "#00695c",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   editButtonText: {
//     color: "#fff",
//     fontSize: 14.5,
//     fontWeight: "700",
//   },

//   btnPressed: {
//     transform: [
//       {
//         scale: 0.97,
//       },
//     ],
//     opacity: 0.9,
//   },

//   statsCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     paddingVertical: 20,
//     borderRadius: 20,
//     marginTop: 24,
//     width: "100%",
//     shadowColor: "#0d2b25",
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 16,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//   },

//   statItem: {
//     flex: 1,
//     alignItems: "center",
//   },

//   statNumber: {
//     fontSize: 21,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   statLabel: {
//     fontSize: 12.5,
//     color: "#8d9995",
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   statDivider: {
//     width: 1,
//     backgroundColor: "#eceeed",
//   },

//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 34,
//     marginBottom: 16,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#14231f",
//     marginRight: 12,
//     letterSpacing: -0.2,
//   },

//   sectionLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#eceeed",
//   },

//   postCard: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     overflow: "hidden",
//     shadowColor: "#0d2b25",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//   },

//   postPressed: {
//     transform: [
//       {
//         scale: 0.98,
//       },
//     ],
//     opacity: 0.92,
//   },

//   /*
//       Image exists:
//       - width fills the card
//       - aspectRatio comes from the actual image
//       - maxHeight prevents very tall images
//       - contain shows the full image without cropping
//     */
//   postImage: {
//     width: "100%",
//     maxHeight: 280,
//     resizeMode: "contain",
//     backgroundColor: "#eef1f0",
//   },

//   /*
//       This is only used when you intentionally
//       want a placeholder.
//       Posts without images do NOT render this.
//     */
//   postImagePlaceholder: {
//     width: "100%",
//     height: 180,
//     backgroundColor: "#f1f4f3",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   postImagePlaceholderIcon: {
//     fontSize: 30,
//     opacity: 0.5,
//   },

//   postContent: {
//     padding: 18,
//   },

//   postTitle: {
//     fontSize: 17.5,
//     lineHeight: 23,
//     fontWeight: "800",
//     color: "#14231f",
//     marginBottom: 8,
//     letterSpacing: -0.2,
//   },

//   postBody: {
//     fontSize: 14,
//     lineHeight: 20.5,
//     color: "#6b7874",
//   },

//   postBottomRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 14,
//   },

//   dateBadge: {
//     backgroundColor: "#f1f4f3",
//     paddingVertical: 5,
//     paddingHorizontal: 11,
//     borderRadius: 8,
//   },

//   postDate: {
//     fontSize: 11.5,
//     color: "#55635f",
//     fontWeight: "700",
//   },

//   postStats: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },

//   postStatText: {
//     fontSize: 12.5,
//     color: "#6b7874",
//     fontWeight: "700",
//   },

//   postsLoading: {
//     alignItems: "center",
//     paddingVertical: 40,
//   },

//   postsLoadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 14,
//   },

//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 60,
//   },

//   emptyEmoji: {
//     fontSize: 46,
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: "#8d9995",
//     marginTop: 6,
//     textAlign: "center",
//   },

//   errorText: {
//     color: "#c62828",
//     textAlign: "center",
//     marginBottom: 16,
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });

// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// import API_URL from "../api/api";

// type StoredUser = {
//   id: string;
//   name: string;
//   email: string;
//   profileImage?: string;
//   profileImageWidth?: number | null;
//   profileImageHeight?: number | null;
// };

// type Author = {
//   _id: string;
//   name: string;
//   email: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   image: string;
//   imageWidth?: number;
//   imageHeight?: number;
//   author: Author;
//   createdAt: string;
// };

// type PostStats = {
//   likeCount: number;
//   commentCount: number;
// };

// export default function ProfileScreen() {
//   const [user, setUser] = useState<StoredUser | null>(null);

//   const [posts, setPosts] = useState<Post[]>([]);

//   const [postStats, setPostStats] = useState<Record<string, PostStats>>({});

//   const [loading, setLoading] = useState(true);

//   const [postsLoading, setPostsLoading] = useState(true);

//   const [error, setError] = useState("");

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
//   /* STORED USER                                                 */
//   /* ========================================================== */

//   const getStoredUser = async () => {
//     try {
//       let userJson: string | null = null;

//       if (Platform.OS === "web") {
//         userJson = localStorage.getItem("user");
//       } else {
//         userJson = await SecureStore.getItemAsync("user");
//       }

//       if (!userJson) {
//         router.replace("/login");
//         return null;
//       }

//       const storedUser: StoredUser = JSON.parse(userJson);

//       if (!storedUser.id) {
//         router.replace("/login");
//         return null;
//       }

//       setUser(storedUser);

//       return storedUser;
//     } catch (error) {
//       console.error("Read stored user error:", error);

//       router.replace("/login");
//       return null;
//     }
//   };

//   /* ========================================================== */
//   /* LOAD POST STATS                                             */
//   /* ========================================================== */

//   const loadPostStats = async (postList: Post[]) => {
//     try {
//       const token = await getToken();

//       const results = await Promise.all(
//         postList.map(async (post) => {
//           let likeCount = 0;
//           let commentCount = 0;

//           /* Likes */

//           try {
//             const likeResponse = await fetch(
//               `${API_URL}/api/likes/${post._id}`,
//               token
//                 ? {
//                     headers: {
//                       Authorization: `Bearer ${token}`,
//                     },
//                   }
//                 : undefined,
//             );

//             const likeData = await likeResponse.json();

//             if (likeResponse.ok) {
//               likeCount = Number(likeData.likeCount) || 0;
//             }
//           } catch (error) {
//             console.error("Load likes error:", error);
//           }

//           /* Comments */

//           try {
//             const commentResponse = await fetch(
//               `${API_URL}/api/comments/post/${post._id}`,
//             );

//             const commentData = await commentResponse.json();

//             if (commentResponse.ok && Array.isArray(commentData.comments)) {
//               commentCount = commentData.comments.length;
//             }
//           } catch (error) {
//             console.error("Load comments error:", error);
//           }

//           return {
//             postId: post._id,
//             likeCount,
//             commentCount,
//           };
//         }),
//       );

//       const statsMap: Record<string, PostStats> = {};

//       results.forEach((result) => {
//         statsMap[result.postId] = {
//           likeCount: result.likeCount,
//           commentCount: result.commentCount,
//         };
//       });

//       setPostStats(statsMap);
//     } catch (error) {
//       console.error("Load post stats error:", error);
//     }
//   };

//   /* ========================================================== */
//   /* LOAD MY POSTS                                               */
//   /* ========================================================== */

//   const loadMyPosts = async (currentUser: StoredUser) => {
//     try {
//       setPostsLoading(true);
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to load posts");
//         return;
//       }

//       const allPosts: Post[] = data.posts || [];

//       const myPosts = allPosts.filter(
//         (post) => String(post.author?._id) === String(currentUser.id),
//       );

//       setPosts(myPosts);

//       await loadPostStats(myPosts);
//     } catch (error) {
//       console.error("My posts error:", error);

//       setError("Unable to load your posts");
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   /* ========================================================== */
//   /* LOAD PROFILE                                                */
//   /* ========================================================== */

//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const storedUser = await getStoredUser();

//       if (!storedUser) {
//         return;
//       }

//       await loadMyPosts(storedUser);
//     } catch (error) {
//       console.error("Profile loading error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadProfile();
//     }, []),
//   );

//   /* ========================================================== */
//   /* LOGOUT                                                       */
//   /* ========================================================== */

//   const handleLogout = async () => {
//     try {
//       if (Platform.OS === "web") {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       } else {
//         await SecureStore.deleteItemAsync("token");

//         await SecureStore.deleteItemAsync("user");
//       }

//       router.replace("/login");
//     } catch (error) {
//       console.error("Logout error:", error);

//       if (Platform.OS === "web") {
//         window.alert("Failed to logout");
//       } else {
//         Alert.alert("Error", "Failed to logout");
//       }
//     }
//   };

//   /* ========================================================== */
//   /* POST PRESS                                                  */
//   /* ========================================================== */

//   const handlePostPress = (postId: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id: postId,
//       },
//     });
//   };

//   /* ========================================================== */
//   /* REFRESH                                                      */
//   /* ========================================================== */

//   const handleRefresh = useCallback(async () => {
//     if (!user) {
//       return;
//     }

//     await loadMyPosts(user);
//   }, [user]);

//   /* ========================================================== */
//   /* EDIT PROFILE                                                */
//   /* ========================================================== */

//   const handleEditProfile = () => {
//     router.push("/edit-profile");
//   };

//   /* ========================================================== */
//   /* TOTAL LIKES                                                  */
//   /* ========================================================== */

//   const getTotalLikes = () => {
//     return posts.reduce(
//       (total, post) => total + (postStats[post._id]?.likeCount || 0),
//       0,
//     );
//   };

//   /* ========================================================== */
//   /* TOTAL COMMENTS                                               */
//   /* ========================================================== */

//   const getTotalComments = () => {
//     return posts.reduce(
//       (total, post) => total + (postStats[post._id]?.commentCount || 0),
//       0,
//     );
//   };

//   /* ========================================================== */
//   /* RENDER POST                                                  */
//   /* ========================================================== */

//   const renderPost = ({ item }: { item: Post }) => {
//     const hasImage = !!item.image;

//     const imageRatio =
//       item.imageWidth && item.imageHeight
//         ? item.imageWidth / item.imageHeight
//         : 16 / 9;

//     return (
//       <Pressable
//         style={({ pressed }) => [
//           styles.postCard,
//           pressed && styles.postPressed,
//         ]}
//         onPress={() => handlePostPress(item._id)}
//       >
//         {hasImage && (
//           <Image
//             source={{
//               uri: item.image,
//             }}
//             resizeMode="contain"
//             style={[
//               styles.postImage,
//               {
//                 aspectRatio: imageRatio,
//               },
//             ]}
//           />
//         )}

//         <View style={styles.postContent}>
//           <Text style={styles.postTitle} numberOfLines={2}>
//             {item.title}
//           </Text>

//           <Text style={styles.postBody} numberOfLines={3}>
//             {item.body}
//           </Text>

//           <View style={styles.postBottomRow}>
//             <View style={styles.dateBadge}>
//               <Text style={styles.postDate}>
//                 {new Date(item.createdAt).toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </Text>
//             </View>

//             <View style={styles.postStats}>
//               <Text style={styles.postStatText}>
//                 {postStats[item._id]?.likeCount || 0} ♥
//               </Text>

//               <Text style={styles.postStatText}>
//                 {postStats[item._id]?.commentCount || 0} 💬
//               </Text>
//             </View>
//           </View>
//         </View>
//       </Pressable>
//     );
//   };

//   /* ========================================================== */
//   /* LOADING                                                      */
//   /* ========================================================== */

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#00695c" />

//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   /* ========================================================== */
//   /* PROFILE IMAGE                                               */
//   /* ========================================================== */

//   const profileImage = user?.profileImage;

//   /* ========================================================== */
//   /* UI                                                           */
//   /* ========================================================== */

//   return (
//     <View style={styles.screen}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderPost}
//         showsVerticalScrollIndicator={false}
//         refreshing={postsLoading}
//         onRefresh={handleRefresh}
//         contentContainerStyle={styles.listContent}
//         ListHeaderComponent={
//           <View style={styles.centerWrap}>
//             <View style={styles.profileContainer}>
//               {/* ================================================== */}
//               {/* PROFILE PICTURE                                    */}
//               {/* ================================================== */}

//               <View style={styles.avatarRing}>
//                 {profileImage ? (
//                   <Image
//                     source={{
//                       uri: profileImage,
//                     }}
//                     style={styles.avatarImage}
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <View style={styles.avatar}>
//                     <Text style={styles.avatarText}>
//                       {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               <Text style={styles.name}>{user?.name || "User"}</Text>

//               <Text style={styles.email}>{user?.email || ""}</Text>

//               <View style={styles.actionRow}>
//                 <Pressable
//                   style={({ pressed }) => [
//                     styles.editButton,
//                     pressed && styles.btnPressed,
//                   ]}
//                   onPress={handleEditProfile}
//                 >
//                   <Text style={styles.editButtonText}>Edit Profile</Text>
//                 </Pressable>
//               </View>

//               <View style={styles.statsCard}>
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>{posts.length}</Text>

//                   <Text style={styles.statLabel}>Total Posts</Text>
//                 </View>

//                 <View style={styles.statDivider} />

//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>{getTotalComments()}</Text>

//                   <Text style={styles.statLabel}>Comments</Text>
//                 </View>

//                 <View style={styles.statDivider} />

//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>{getTotalLikes()}</Text>

//                   <Text style={styles.statLabel}>Likes</Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>My Posts</Text>

//               <View style={styles.sectionLine} />
//             </View>

//             {error !== "" && <Text style={styles.errorText}>{error}</Text>}

//             {postsLoading && posts.length === 0 && (
//               <View style={styles.postsLoading}>
//                 <ActivityIndicator color="#00695c" />

//                 <Text style={styles.postsLoadingText}>
//                   Loading your posts...
//                 </Text>
//               </View>
//             )}
//           </View>
//         }
//         ListEmptyComponent={
//           !postsLoading ? (
//             <View style={styles.centerWrap}>
//               <View style={styles.emptyState}>
//                 <Text style={styles.emptyEmoji}>📝</Text>

//                 <Text style={styles.emptyTitle}>No posts yet</Text>

//                 <Text style={styles.emptySubtitle}>
//                   Posts you create will appear here.
//                 </Text>
//               </View>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   listContent: {
//     paddingBottom: 40,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fbfbfa",
//   },

//   loadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 15,
//     fontWeight: "500",
//   },

//   centerWrap: {
//     width: "100%",
//     alignSelf: "center",
//     paddingHorizontal: 20,
//   },

//   profileContainer: {
//     alignItems: "center",
//   },

//   /* ========================================================== */
//   /* PROFILE AVATAR                                             */
//   /* ========================================================== */

//   avatarRing: {
//     width: 112,
//     height: 112,
//     borderRadius: 56,
//     backgroundColor: "#fff",
//     padding: 4,
//     marginBottom: 16,

//     shadowColor: "#00352e",
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.16,
//     shadowRadius: 16,
//     elevation: 6,

//     overflow: "hidden",
//   },

//   avatarImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 52,
//   },

//   avatar: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 52,
//     backgroundColor: "#004d40",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fbfbfa",
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 38,
//     fontWeight: "800",
//   },

//   /* ========================================================== */
//   /* USER INFO                                                   */
//   /* ========================================================== */

//   name: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//   },

//   email: {
//     fontSize: 14.5,
//     color: "#8d9995",
//     marginTop: 4,
//     marginBottom: 20,
//   },

//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     width: "100%",
//   },

//   editButton: {
//     backgroundColor: "#00695c",
//     paddingVertical: 13,
//     borderRadius: 22,
//     alignItems: "center",
//     justifyContent: "center",
//     width: 200,

//     shadowColor: "#00695c",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   editButtonText: {
//     color: "#fff",
//     fontSize: 14.5,
//     fontWeight: "700",
//   },

//   btnPressed: {
//     transform: [
//       {
//         scale: 0.97,
//       },
//     ],
//     opacity: 0.9,
//   },

//   /* ========================================================== */
//   /* STATS                                                       */
//   /* ========================================================== */

//   statsCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     paddingVertical: 20,
//     borderRadius: 20,
//     marginTop: 24,
//     width: "100%",

//     shadowColor: "#0d2b25",
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 16,
//     elevation: 3,

//     borderWidth: 1,
//     borderColor: "#eceeed",
//   },

//   statItem: {
//     flex: 1,
//     alignItems: "center",
//   },

//   statNumber: {
//     fontSize: 21,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   statLabel: {
//     fontSize: 12.5,
//     color: "#8d9995",
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   statDivider: {
//     width: 1,
//     backgroundColor: "#eceeed",
//   },

//   /* ========================================================== */
//   /* SECTION                                                      */
//   /* ========================================================== */

//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 34,
//     marginBottom: 16,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#14231f",
//     marginRight: 12,
//     letterSpacing: -0.2,
//   },

//   sectionLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#eceeed",
//   },

//   /* ========================================================== */
//   /* POSTS                                                        */
//   /* ========================================================== */

//   postCard: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     overflow: "hidden",

//     shadowColor: "#0d2b25",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 2,

//     borderWidth: 1,
//     borderColor: "#eceeed",
//   },

//   postPressed: {
//     transform: [
//       {
//         scale: 0.98,
//       },
//     ],
//     opacity: 0.92,
//   },

//   postImage: {
//     width: "100%",
//     maxHeight: 280,
//     backgroundColor: "#eef1f0",
//   },

//   postContent: {
//     padding: 18,
//   },

//   postTitle: {
//     fontSize: 17.5,
//     lineHeight: 23,
//     fontWeight: "800",
//     color: "#14231f",
//     marginBottom: 8,
//     letterSpacing: -0.2,
//   },

//   postBody: {
//     fontSize: 14,
//     lineHeight: 20.5,
//     color: "#6b7874",
//   },

//   postBottomRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 14,
//   },

//   dateBadge: {
//     backgroundColor: "#f1f4f3",
//     paddingVertical: 5,
//     paddingHorizontal: 11,
//     borderRadius: 8,
//   },

//   postDate: {
//     fontSize: 11.5,
//     color: "#55635f",
//     fontWeight: "700",
//   },

//   postStats: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },

//   postStatText: {
//     fontSize: 12.5,
//     color: "#6b7874",
//     fontWeight: "700",
//   },

//   /* ========================================================== */
//   /* LOADING                                                      */
//   /* ========================================================== */

//   postsLoading: {
//     alignItems: "center",
//     paddingVertical: 40,
//   },

//   postsLoadingText: {
//     marginTop: 12,
//     color: "#8d9995",
//     fontSize: 14,
//   },

//   /* ========================================================== */
//   /* EMPTY                                                        */
//   /* ========================================================== */

//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 60,
//   },

//   emptyEmoji: {
//     fontSize: 46,
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#14231f",
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: "#8d9995",
//     marginTop: 6,
//     textAlign: "center",
//   },

//   /* ========================================================== */
//   /* ERROR                                                        */
//   /* ========================================================== */

//   errorText: {
//     color: "#c62828",
//     textAlign: "center",
//     marginBottom: 16,
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
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

type Author = {
  _id: string;
  name: string;
  email: string;
};

type Post = {
  _id: string;
  title: string;
  body: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  author: Author;
  createdAt: string;
};

type PostStats = {
  likeCount: number;
  commentCount: number;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postStats, setPostStats] = useState<Record<string, PostStats>>({});
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
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
    try {
      let userJson: string | null = null;
      if (Platform.OS === "web") {
        userJson = localStorage.getItem("user");
      } else {
        userJson = await SecureStore.getItemAsync("user");
      }

      if (!userJson) {
        router.replace("/login");
        return null;
      }

      const storedUser: StoredUser = JSON.parse(userJson);
      if (!storedUser.id) {
        router.replace("/login");
        return null;
      }

      setUser(storedUser);
      return storedUser;
    } catch (error) {
      console.error("Read stored user error:", error);
      router.replace("/login");
      return null;
    }
  };

  /* ========================================================== */
  /* LOAD POST STATS                                             */
  /* ========================================================== */
  const loadPostStats = async (postList: Post[]) => {
    try {
      const token = await getToken();
      const results = await Promise.all(
        postList.map(async (post) => {
          let likeCount = 0;
          let commentCount = 0;

          try {
            const likeResponse = await fetch(
              `${API_URL}/api/likes/${post._id}`,
              token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : undefined,
            );
            const likeData = await likeResponse.json();
            if (likeResponse.ok) {
              likeCount = Number(likeData.likeCount) || 0;
            }
          } catch (error) {
            console.error("Load likes error:", error);
          }

          try {
            const commentResponse = await fetch(
              `${API_URL}/api/comments/post/${post._id}`,
            );
            const commentData = await commentResponse.json();
            if (commentResponse.ok && Array.isArray(commentData.comments)) {
              commentCount = commentData.comments.length;
            }
          } catch (error) {
            console.error("Load comments error:", error);
          }

          return { postId: post._id, likeCount, commentCount };
        }),
      );

      const statsMap: Record<string, PostStats> = {};
      results.forEach((result) => {
        statsMap[result.postId] = {
          likeCount: result.likeCount,
          commentCount: result.commentCount,
        };
      });
      setPostStats(statsMap);
    } catch (error) {
      console.error("Load post stats error:", error);
    }
  };

  /* ========================================================== */
  /* LOAD MY POSTS                                               */
  /* ========================================================== */
  const loadMyPosts = async (currentUser: StoredUser) => {
    try {
      setPostsLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/posts`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load posts");
        return;
      }

      const allPosts: Post[] = data.posts || [];
      const myPosts = allPosts.filter(
        (post) => String(post.author?._id) === String(currentUser.id),
      );

      setPosts(myPosts);
      await loadPostStats(myPosts);
    } catch (error) {
      console.error("My posts error:", error);
      setError("Unable to load your posts");
    } finally {
      setPostsLoading(false);
    }
  };

  /* ========================================================== */
  /* LOAD PROFILE                                                */
  /* ========================================================== */
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const storedUser = await getStoredUser();
      if (!storedUser) return;
      await loadMyPosts(storedUser);
    } catch (error) {
      console.error("Profile loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  /* ========================================================== */
  /* LOGOUT                                                      */
  /* ========================================================== */
  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
      }
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      if (Platform.OS === "web") {
        window.alert("Failed to logout");
      } else {
        Alert.alert("Error", "Failed to logout");
      }
    }
  };

  /* ========================================================== */
  /* NAVIGATION                                                  */
  /* ========================================================== */
  const handlePostPress = (postId: string) => {
    router.push({ pathname: "/post-detail", params: { id: postId } });
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleRefresh = useCallback(async () => {
    if (!user) return;
    await loadMyPosts(user);
  }, [user]);

  /* ========================================================== */
  /* CALCULATIONS                                                */
  /* ========================================================== */
  const getTotalLikes = () => {
    return posts.reduce(
      (total, post) => total + (postStats[post._id]?.likeCount || 0),
      0,
    );
  };

  const getTotalComments = () => {
    return posts.reduce(
      (total, post) => total + (postStats[post._id]?.commentCount || 0),
      0,
    );
  };

  /* ========================================================== */
  /* RENDER POST                                                 */
  /* ========================================================== */
  const renderPost = ({ item }: { item: Post }) => {
    const hasImage = !!item.image;
    const imageRatio =
      item.imageWidth && item.imageHeight
        ? item.imageWidth / item.imageHeight
        : 16 / 9;

    return (
      <Pressable
        style={({ pressed }) => [styles.postCard, pressed && styles.pressed]}
        onPress={() => handlePostPress(item._id)}
      >
        {hasImage && (
          <Image
            source={{ uri: item.image }}
            resizeMode="cover"
            style={[styles.postImage, { aspectRatio: imageRatio }]}
          />
        )}

        <View style={styles.postContent}>
          <Text style={styles.postTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.postBody} numberOfLines={3}>
            {item.body}
          </Text>

          <View style={styles.postBottomRow}>
            <View style={styles.dateBadge}>
              <Text style={styles.postDate}>
                {new Date(item.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>

            <View style={styles.postStats}>
              <View style={styles.statPill}>
                <Text style={styles.postStatText}>
                  {postStats[item._id]?.likeCount || 0} ♥
                </Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.postStatText}>
                  {postStats[item._id]?.commentCount || 0} 💬
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  /* ========================================================== */
  /* LOADING SCREEN                                              */
  /* ========================================================== */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0f172a" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const profileImage = user?.profileImage;

  /* ========================================================== */
  /* UI                                                          */
  /* ========================================================== */
  return (
    <View style={styles.screen}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        refreshing={postsLoading}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.centerWrap}>
            <View style={styles.profileContainer}>
              {/* PROFILE PICTURE */}
              <View style={styles.avatarRing}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.name}>{user?.name || "User"}</Text>
              <Text style={styles.email}>{user?.email || ""}</Text>

              {/* ACTION BUTTONS */}
              <View style={styles.actionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={handleEditProfile}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.logoutButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </Pressable>
              </View>

              {/* STATS CARD */}
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{posts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{getTotalComments()}</Text>
                  <Text style={styles.statLabel}>Comments</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{getTotalLikes()}</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
              </View>
            </View>

            {/* MY POSTS HEADER */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Posts</Text>
              <View style={styles.sectionLine} />
            </View>

            {error !== "" && <Text style={styles.errorText}>{error}</Text>}

            {postsLoading && posts.length === 0 && (
              <View style={styles.postsLoading}>
                <ActivityIndicator color="#0f172a" />
                <Text style={styles.postsLoadingText}>
                  Loading your posts...
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !postsLoading ? (
            <View style={styles.centerWrap}>
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <Text style={styles.emptyEmoji}>📝</Text>
                </View>
                <Text style={styles.emptyTitle}>No posts yet</Text>
                <Text style={styles.emptySubtitle}>
                  Posts you create will appear here.
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc", // Slate-50
  },
  listContent: {
    paddingBottom: 60,
    paddingTop: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },
  centerWrap: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  profileContainer: {
    alignItems: "center",
  },

  /* AVATAR */
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffffff",
    padding: 4,
    marginBottom: 20,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 56,
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: 56,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "900",
  },

  /* USER INFO */
  name: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
  },
  email: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 6,
    marginBottom: 24,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  editButton: {
    flex: 2,
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 220,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 120,
  },
  logoutButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "800",
  },

  /* STATS */
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 24,
    borderRadius: 24,
    marginTop: 28,
    width: "100%",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 6,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f1f5f9",
  },

  /* SECTION */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 36,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    marginRight: 16,
    letterSpacing: -0.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },

  /* POSTS */
  postCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  postImage: {
    width: "100%",
    maxHeight: 300,
    backgroundColor: "#f1f5f9",
  },
  postContent: {
    padding: 22,
  },
  postTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  postBody: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
    fontWeight: "500",
  },
  postBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dateBadge: {
    backgroundColor: "#f8fafc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  postDate: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "700",
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statPill: {
    backgroundColor: "#f8fafc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  postStatText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "700",
  },

  /* LOADING & EMPTY */
  postsLoading: {
    alignItems: "center",
    paddingVertical: 40,
  },
  postsLoadingText: {
    marginTop: 16,
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0f172a",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
    fontWeight: "700",
  },

  /* INTERACTIONS */
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
