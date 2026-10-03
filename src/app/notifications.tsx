// import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     Image,
//     Platform,
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
// } from "react-native";
// import API_URL from "../api/api";

// //const API_URL = "http://192.168.10.119:5000";

// type NotificationItem = {
//   _id: string;
//   type: "like" | "comment";
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   sender?: {
//     _id: string;
//     name: string;
//     email: string;
//     profileImage?: string;
//   };
//   post?: {
//     _id: string;
//     title: string;
//   };
// };

// const getToken = async () => {
//   if (Platform.OS === "web") {
//     return localStorage.getItem("token");
//   }

//   return await SecureStore.getItemAsync("token");
// };

// export default function Notifications() {
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   const loadNotifications = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = await getToken();

//       console.log("NOTIFICATION TOKEN:", token);

//       if (!token) {
//         setError("Login token not found. Please login again.");
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/notifications`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("NOTIFICATION STATUS:", response.status);

//       const data = await response.json();

//       console.log("NOTIFICATION DATA:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load notifications");
//       }

//       setNotifications(data.notifications || []);
//     } catch (error) {
//       console.error("NOTIFICATION ERROR:", error);

//       setError(
//         error instanceof Error ? error.message : "Unable to load notifications",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (id: string) => {
//     try {
//       const token = await getToken();

//       if (!token) {
//         return;
//       }

//       await fetch(`${API_URL}/api/notifications/${id}/read`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//     } catch (error) {
//       console.log("MARK READ ERROR:", error);
//     }
//   };

//   const handleNotificationPress = async (notification: NotificationItem) => {
//     if (!notification.isRead) {
//       await markAsRead(notification._id);

//       setNotifications((current) =>
//         current.map((item) =>
//           item._id === notification._id ? { ...item, isRead: true } : item,
//         ),
//       );
//     }

//     if (notification.post?._id) {
//       router.push({
//         pathname: "/post-detail",
//         params: {
//           id: notification.post._id,
//         },
//       });
//     }
//   };

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleString([], {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//         <Text style={styles.loadingText}>Loading notifications...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Pressable onPress={() => router.back()}>
//           <Text style={styles.back}>←</Text>
//         </Pressable>

//         <Text style={styles.headerTitle}>Notifications</Text>
//       </View>

//       {error ? (
//         <View style={styles.center}>
//           <Text style={styles.error}>{error}</Text>

//           <Pressable style={styles.retryButton} onPress={loadNotifications}>
//             <Text style={styles.retryText}>Retry</Text>
//           </Pressable>
//         </View>
//       ) : notifications.length === 0 ? (
//         <View style={styles.center}>
//           <Text style={styles.emptyIcon}>🔔</Text>

//           <Text style={styles.emptyTitle}>No notifications</Text>

//           <Text style={styles.emptyText}>
//             Likes and comments will appear here.
//           </Text>
//         </View>
//       ) : (
//         <ScrollView
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//         >
//           {notifications.map((notification) => (
//             <Pressable
//               key={notification._id}
//               style={[styles.card, !notification.isRead && styles.unreadCard]}
//               onPress={() => handleNotificationPress(notification)}
//             >
//               <View style={styles.avatarContainer}>
//                 {notification.sender?.profileImage ? (
//                   <Image
//                     source={{
//                       uri: notification.sender.profileImage,
//                     }}
//                     style={styles.avatarImage}
//                   />
//                 ) : (
//                   <View style={styles.avatar}>
//                     <Text style={styles.avatarText}>
//                       {notification.sender?.name?.charAt(0)?.toUpperCase() ||
//                         "U"}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               <View style={styles.content}>
//                 <View style={styles.row}>
//                   <Text style={styles.icon}>
//                     {notification.type === "like" ? "❤️" : "💬"}
//                   </Text>

//                   <Text style={styles.time}>
//                     {formatDate(notification.createdAt)}
//                   </Text>
//                 </View>

//                 <Text style={styles.message}>
//                   <Text style={styles.name}>
//                     {notification.sender?.name || "Someone"}
//                   </Text>{" "}
//                   {notification.type === "like"
//                     ? "liked your post"
//                     : "commented on your post"}
//                 </Text>

//                 <Text style={styles.postTitle}>
//                   {notification.post?.title || "Your post"}
//                 </Text>
//               </View>

//               {!notification.isRead && <View style={styles.dot} />}
//             </Pressable>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f6fa",
//   },

//   header: {
//     height: 70,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },

//   back: {
//     fontSize: 30,
//     color: "#111827",
//     marginRight: 18,
//   },

//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   list: {
//     padding: 16,
//   },

//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//   },

//   unreadCard: {
//     backgroundColor: "#f5f7ff",
//     borderColor: "#c7d2fe",
//   },

//   avatarContainer: {
//     marginRight: 12,
//   },

//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#4f46e5",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   avatarImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },

//   content: {
//     flex: 1,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },

//   icon: {
//     fontSize: 17,
//   },

//   time: {
//     fontSize: 11,
//     color: "#6b7280",
//   },

//   message: {
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 21,
//   },

//   name: {
//     fontWeight: "700",
//     color: "#111827",
//   },

//   postTitle: {
//     marginTop: 5,
//     fontSize: 13,
//     color: "#4f46e5",
//     fontWeight: "600",
//   },

//   dot: {
//     width: 9,
//     height: 9,
//     borderRadius: 5,
//     backgroundColor: "#4f46e5",
//     marginLeft: 8,
//   },

//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },

//   loadingText: {
//     marginTop: 10,
//     color: "#6b7280",
//   },

//   error: {
//     color: "#dc2626",
//     textAlign: "center",
//     marginBottom: 15,
//   },

//   retryButton: {
//     backgroundColor: "#4f46e5",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },

//   retryText: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   emptyIcon: {
//     fontSize: 45,
//     marginBottom: 10,
//   },

//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   emptyText: {
//     marginTop: 6,
//     color: "#6b7280",
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     Image,
//     Platform,
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
// } from "react-native";
// import API_URL from "../api/api";

// type NotificationItem = {
//   _id: string;
//   type: "like" | "comment";
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   sender?: {
//     _id: string;
//     name: string;
//     email: string;
//     profileImage?: string;
//   };
//   post?: {
//     _id: string;
//     title: string;
//   };
// };

// // Get JWT token from the correct storage
// const getToken = async () => {
//   if (Platform.OS === "web") {
//     return localStorage.getItem("token");
//   }

//   return await SecureStore.getItemAsync("token");
// };

// export default function Notifications() {
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // =====================================================
//   // LOAD NOTIFICATIONS
//   // =====================================================
//   const loadNotifications = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = await getToken();

//       console.log("NOTIFICATION TOKEN:", token);

//       if (!token) {
//         setError("Login token not found. Please login again.");
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/notifications`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("NOTIFICATION STATUS:", response.status);

//       const data = await response.json();

//       console.log("NOTIFICATION DATA:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load notifications");
//       }

//       setNotifications(data.notifications || []);
//     } catch (error) {
//       console.error("NOTIFICATION ERROR:", error);

//       setError(
//         error instanceof Error ? error.message : "Unable to load notifications",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // =====================================================
//   // LOAD EVERY TIME SCREEN GETS FOCUS
//   // =====================================================
//   useFocusEffect(
//     useCallback(() => {
//       loadNotifications();
//     }, [loadNotifications]),
//   );

//   // =====================================================
//   // MARK NOTIFICATION AS READ
//   // =====================================================
//   const markAsRead = async (id: string) => {
//     try {
//       const token = await getToken();

//       if (!token) {
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         console.log("Failed to mark notification as read");
//       }
//     } catch (error) {
//       console.log("MARK READ ERROR:", error);
//     }
//   };

//   // =====================================================
//   // NOTIFICATION PRESS
//   // =====================================================
//   const handleNotificationPress = async (notification: NotificationItem) => {
//     // Mark unread notification as read
//     if (!notification.isRead) {
//       await markAsRead(notification._id);

//       // Update UI immediately
//       setNotifications((current) =>
//         current.map((item) =>
//           item._id === notification._id ? { ...item, isRead: true } : item,
//         ),
//       );
//     }

//     // Open related post
//     if (notification.post?._id) {
//       router.push({
//         pathname: "/post-detail",
//         params: {
//           id: notification.post._id,
//         },
//       });
//     }
//   };

//   // =====================================================
//   // FORMAT DATE
//   // =====================================================
//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleString([], {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />

//         <Text style={styles.loadingText}>Loading notifications...</Text>
//       </View>
//     );
//   }

//   // =====================================================
//   // MAIN SCREEN
//   // =====================================================
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Pressable onPress={() => router.back()}>
//           <Text style={styles.back}>←</Text>
//         </Pressable>

//         <Text style={styles.headerTitle}>Notifications</Text>
//       </View>

//       {/* Error */}
//       {error ? (
//         <View style={styles.center}>
//           <Text style={styles.error}>{error}</Text>

//           <Pressable style={styles.retryButton} onPress={loadNotifications}>
//             <Text style={styles.retryText}>Retry</Text>
//           </Pressable>
//         </View>
//       ) : notifications.length === 0 ? (
//         // =================================================
//         // EMPTY STATE
//         // =================================================
//         <View style={styles.center}>
//           <Text style={styles.emptyIcon}>🔔</Text>

//           <Text style={styles.emptyTitle}>No notifications</Text>

//           <Text style={styles.emptyText}>
//             Likes and comments will appear here.
//           </Text>
//         </View>
//       ) : (
//         // =================================================
//         // NOTIFICATION LIST
//         // =================================================
//         <ScrollView
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//         >
//           {notifications.map((notification) => (
//             <Pressable
//               key={notification._id}
//               style={[styles.card, !notification.isRead && styles.unreadCard]}
//               onPress={() => handleNotificationPress(notification)}
//             >
//               {/* Avatar */}
//               <View style={styles.avatarContainer}>
//                 {notification.sender?.profileImage ? (
//                   <Image
//                     source={{
//                       uri: notification.sender.profileImage,
//                     }}
//                     style={styles.avatarImage}
//                   />
//                 ) : (
//                   <View style={styles.avatar}>
//                     <Text style={styles.avatarText}>
//                       {notification.sender?.name?.charAt(0)?.toUpperCase() ||
//                         "U"}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               {/* Content */}
//               <View style={styles.content}>
//                 <View style={styles.row}>
//                   <Text style={styles.icon}>
//                     {notification.type === "like" ? "❤️" : "💬"}
//                   </Text>

//                   <Text style={styles.time}>
//                     {formatDate(notification.createdAt)}
//                   </Text>
//                 </View>

//                 <Text style={styles.message}>
//                   <Text style={styles.name}>
//                     {notification.sender?.name || "Someone"}
//                   </Text>{" "}
//                   {notification.type === "like"
//                     ? "liked your post"
//                     : "commented on your post"}
//                 </Text>

//                 <Text style={styles.postTitle}>
//                   {notification.post?.title || "Your post"}
//                 </Text>
//               </View>

//               {/* Unread indicator */}
//               {!notification.isRead && <View style={styles.dot} />}
//             </Pressable>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f6fa",
//   },

//   header: {
//     height: 70,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },

//   back: {
//     fontSize: 30,
//     color: "#111827",
//     marginRight: 18,
//   },

//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   list: {
//     padding: 16,
//   },

//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//   },

//   unreadCard: {
//     backgroundColor: "#f5f7ff",
//     borderColor: "#c7d2fe",
//   },

//   avatarContainer: {
//     marginRight: 12,
//   },

//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#4f46e5",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   avatarImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },

//   content: {
//     flex: 1,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },

//   icon: {
//     fontSize: 17,
//   },

//   time: {
//     fontSize: 11,
//     color: "#6b7280",
//   },

//   message: {
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 21,
//   },

//   name: {
//     fontWeight: "700",
//     color: "#111827",
//   },

//   postTitle: {
//     marginTop: 5,
//     fontSize: 13,
//     color: "#4f46e5",
//     fontWeight: "600",
//   },

//   dot: {
//     width: 9,
//     height: 9,
//     borderRadius: 5,
//     backgroundColor: "#4f46e5",
//     marginLeft: 8,
//   },

//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },

//   loadingText: {
//     marginTop: 10,
//     color: "#6b7280",
//   },

//   error: {
//     color: "#dc2626",
//     textAlign: "center",
//     marginBottom: 15,
//   },

//   retryButton: {
//     backgroundColor: "#4f46e5",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },

//   retryText: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   emptyIcon: {
//     fontSize: 45,
//     marginBottom: 10,
//   },

//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   emptyText: {
//     marginTop: 6,
//     color: "#6b7280",
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// import API_URL from "../api/api";
// import socket from "../socket/socket";

// type NotificationItem = {
//   _id: string;
//   type: "like" | "comment";
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   sender?: {
//     _id: string;
//     name: string;
//     email: string;
//     profileImage?: string;
//   };
//   post?: {
//     _id: string;
//     title: string;
//   };
// };

// // =====================================================
// // GET JWT TOKEN
// // =====================================================

// const getToken = async () => {
//   if (Platform.OS === "web") {
//     return localStorage.getItem("token");
//   }

//   return await SecureStore.getItemAsync("token");
// };

// export default function Notifications() {
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // =====================================================
//   // LOAD NOTIFICATIONS
//   // =====================================================

//   const loadNotifications = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = await getToken();

//       console.log("NOTIFICATION TOKEN:", token);

//       if (!token) {
//         setError("Login token not found. Please login again.");
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/notifications`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("NOTIFICATION STATUS:", response.status);

//       const data = await response.json();

//       console.log("NOTIFICATION DATA:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load notifications");
//       }

//       setNotifications(data.notifications || []);
//     } catch (error) {
//       console.error("NOTIFICATION ERROR:", error);

//       setError(
//         error instanceof Error ? error.message : "Unable to load notifications",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // =====================================================
//   // SOCKET.IO - RECEIVE REAL-TIME NOTIFICATION
//   // =====================================================

//   useEffect(() => {
//     const handleNewNotification = (notification: NotificationItem) => {
//       console.log("NEW REAL-TIME NOTIFICATION:", notification);

//       setNotifications((current) => {
//         // Prevent duplicate notification
//         const alreadyExists = current.some(
//           (item) => item._id === notification._id,
//         );

//         if (alreadyExists) {
//           return current;
//         }

//         // Add newest notification at the top
//         return [notification, ...current];
//       });
//     };

//     socket.on("new-notification", handleNewNotification);

//     console.log("Listening for real-time notifications");

//     return () => {
//       socket.off("new-notification", handleNewNotification);

//       console.log("Stopped listening for real-time notifications");
//     };
//   }, []);

//   // =====================================================
//   // LOAD EVERY TIME SCREEN GETS FOCUS
//   // =====================================================

//   useFocusEffect(
//     useCallback(() => {
//       loadNotifications();
//     }, [loadNotifications]),
//   );

//   // =====================================================
//   // MARK NOTIFICATION AS READ
//   // =====================================================

//   const markAsRead = async (id: string) => {
//     try {
//       const token = await getToken();

//       if (!token) {
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         console.log("Failed to mark notification as read");
//       }
//     } catch (error) {
//       console.log("MARK READ ERROR:", error);
//     }
//   };

//   // =====================================================
//   // NOTIFICATION PRESS
//   // =====================================================

//   const handleNotificationPress = async (notification: NotificationItem) => {
//     // Mark unread notification as read
//     if (!notification.isRead) {
//       await markAsRead(notification._id);

//       // Update UI immediately
//       setNotifications((current) =>
//         current.map((item) =>
//           item._id === notification._id ? { ...item, isRead: true } : item,
//         ),
//       );
//     }

//     // Open related post
//     if (notification.post?._id) {
//       router.push({
//         pathname: "/post-detail",
//         params: {
//           id: notification.post._id,
//         },
//       });
//     }
//   };

//   // =====================================================
//   // FORMAT DATE
//   // =====================================================

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleString([], {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />

//         <Text style={styles.loadingText}>Loading notifications...</Text>
//       </View>
//     );
//   }

//   // =====================================================
//   // MAIN SCREEN
//   // =====================================================

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       {/*
//       <View style={styles.header}>
//         <Pressable onPress={() => router.back()}>
//           <Text style={styles.back}>←</Text>
//         </Pressable>

//         <Text style={styles.headerTitle}>Notifications</Text>
//       </View> */}

//       {/* Error */}

//       {error ? (
//         <View style={styles.center}>
//           <Text style={styles.error}>{error}</Text>

//           <Pressable style={styles.retryButton} onPress={loadNotifications}>
//             <Text style={styles.retryText}>Retry</Text>
//           </Pressable>
//         </View>
//       ) : notifications.length === 0 ? (
//         // =================================================
//         // EMPTY STATE
//         // =================================================

//         <View style={styles.center}>
//           <Text style={styles.emptyIcon}>🔔</Text>

//           <Text style={styles.emptyTitle}>No notifications</Text>

//           <Text style={styles.emptyText}>
//             Likes and comments will appear here.
//           </Text>
//         </View>
//       ) : (
//         // =================================================
//         // NOTIFICATION LIST
//         // =================================================

//         <ScrollView
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//         >
//           {notifications.map((notification) => (
//             <Pressable
//               key={notification._id}
//               style={[styles.card, !notification.isRead && styles.unreadCard]}
//               onPress={() => handleNotificationPress(notification)}
//             >
//               {/* Avatar */}

//               <View style={styles.avatarContainer}>
//                 {notification.sender?.profileImage ? (
//                   <Image
//                     source={{
//                       uri: notification.sender.profileImage,
//                     }}
//                     style={styles.avatarImage}
//                   />
//                 ) : (
//                   <View style={styles.avatar}>
//                     <Text style={styles.avatarText}>
//                       {notification.sender?.name?.charAt(0)?.toUpperCase() ||
//                         "U"}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               {/* Content */}

//               <View style={styles.content}>
//                 <View style={styles.row}>
//                   <Text style={styles.icon}>
//                     {notification.type === "like" ? "❤️" : "💬"}
//                   </Text>

//                   <Text style={styles.time}>
//                     {formatDate(notification.createdAt)}
//                   </Text>
//                 </View>

//                 <Text style={styles.message}>
//                   <Text style={styles.name}>
//                     {notification.sender?.name || "Someone"}
//                   </Text>{" "}
//                   {notification.type === "like"
//                     ? "liked your post"
//                     : "commented on your post"}
//                 </Text>

//                 {/* <Text style={styles.postTitle}>
//                   {notification.post?.title || "Your post"}
//                 </Text> */}
//               </View>

//               {/* Unread indicator */}

//               {!notification.isRead && <View style={styles.dot} />}
//             </Pressable>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f6fa",
//   },

//   header: {
//     height: 70,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },

//   back: {
//     fontSize: 30,
//     color: "#111827",
//     marginRight: 18,
//   },

//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   list: {
//     padding: 16,
//   },

//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//   },

//   unreadCard: {
//     backgroundColor: "#f5f7ff",
//     borderColor: "#c7d2fe",
//   },

//   avatarContainer: {
//     marginRight: 12,
//   },

//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#4f46e5",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   avatarImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },

//   content: {
//     flex: 1,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },

//   icon: {
//     fontSize: 17,
//   },

//   time: {
//     fontSize: 11,
//     color: "#6b7280",
//   },

//   message: {
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 21,
//   },

//   name: {
//     fontWeight: "700",
//     color: "#111827",
//   },

//   postTitle: {
//     marginTop: 5,
//     fontSize: 13,
//     color: "#4f46e5",
//     fontWeight: "600",
//   },

//   dot: {
//     width: 9,
//     height: 9,
//     borderRadius: 5,
//     backgroundColor: "#4f46e5",
//     marginLeft: 8,
//   },

//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },

//   loadingText: {
//     marginTop: 10,
//     color: "#6b7280",
//   },

//   error: {
//     color: "#dc2626",
//     textAlign: "center",
//     marginBottom: 15,
//   },

//   retryButton: {
//     backgroundColor: "#4f46e5",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },

//   retryText: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   emptyIcon: {
//     fontSize: 45,
//     marginBottom: 10,
//   },

//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   emptyText: {
//     marginTop: 6,
//     color: "#6b7280",
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// import API_URL from "../api/api";
// import socket from "../socket/socket";

// type NotificationItem = {
//   _id: string;
//   type: "like" | "comment";
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   sender?: {
//     _id: string;
//     name: string;
//     email: string;
//     profileImage?: string;
//   };
//   post?: {
//     _id: string;
//     title: string;
//   };
// };

// // =====================================================
// // GET JWT TOKEN
// // =====================================================
// const getToken = async () => {
//   if (Platform.OS === "web") {
//     return localStorage.getItem("token");
//   }
//   return await SecureStore.getItemAsync("token");
// };

// export default function Notifications() {
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // =====================================================
//   // LOAD NOTIFICATIONS
//   // =====================================================
//   const loadNotifications = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = await getToken();

//       if (!token) {
//         setError("Login token not found. Please login again.");
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/notifications`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load notifications");
//       }

//       setNotifications(data.notifications || []);
//     } catch (error) {
//       console.error("NOTIFICATION ERROR:", error);
//       setError(
//         error instanceof Error ? error.message : "Unable to load notifications",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // =====================================================
//   // SOCKET.IO - RECEIVE REAL-TIME NOTIFICATION
//   // =====================================================
//   useEffect(() => {
//     const handleNewNotification = (notification: NotificationItem) => {
//       setNotifications((current) => {
//         const alreadyExists = current.some(
//           (item) => item._id === notification._id,
//         );
//         if (alreadyExists) return current;
//         return [notification, ...current];
//       });
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, []);

//   // =====================================================
//   // LOAD EVERY TIME SCREEN GETS FOCUS
//   // =====================================================
//   useFocusEffect(
//     useCallback(() => {
//       loadNotifications();
//     }, [loadNotifications]),
//   );

//   // =====================================================
//   // MARK NOTIFICATION AS READ
//   // =====================================================
//   const markAsRead = async (id: string) => {
//     try {
//       const token = await getToken();
//       if (!token) return;

//       const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         console.log("Failed to mark notification as read");
//       }
//     } catch (error) {
//       console.log("MARK READ ERROR:", error);
//     }
//   };

//   // =====================================================
//   // NOTIFICATION PRESS
//   // =====================================================
//   const handleNotificationPress = async (notification: NotificationItem) => {
//     if (!notification.isRead) {
//       await markAsRead(notification._id);
//       setNotifications((current) =>
//         current.map((item) =>
//           item._id === notification._id ? { ...item, isRead: true } : item,
//         ),
//       );
//     }

//     if (notification.post?._id) {
//       router.push({
//         pathname: "/post-detail",
//         params: { id: notification.post._id },
//       });
//     }
//   };

//   // =====================================================
//   // FORMAT DATE
//   // =====================================================
//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleString([], {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0f172a" />
//         <Text style={styles.loadingText}>Loading notifications...</Text>
//       </View>
//     );
//   }

//   // =====================================================
//   // MAIN SCREEN
//   // =====================================================
//   return (
//     <View style={styles.container}>
//       {/* Error State */}
//       {error ? (
//         <View style={styles.center}>
//           <Text style={styles.errorText}>{error}</Text>
//           <Pressable
//             style={({ pressed }) => [
//               styles.retryButton,
//               pressed && styles.pressed,
//             ]}
//             onPress={loadNotifications}
//           >
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </Pressable>
//         </View>
//       ) : notifications.length === 0 ? (
//         // =================================================
//         // EMPTY STATE
//         // =================================================
//         <View style={styles.center}>
//           <View style={styles.emptyIconWrap}>
//             <Text style={styles.emptyIcon}>🔔</Text>
//           </View>
//           <Text style={styles.emptyTitle}>No notifications</Text>
//           <Text style={styles.emptySubtitle}>
//             Likes and comments on your posts will appear here.
//           </Text>
//         </View>
//       ) : (
//         // =================================================
//         // NOTIFICATION LIST
//         // =================================================
//         <ScrollView
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//         >
//           {notifications.map((notification) => (
//             <Pressable
//               key={notification._id}
//               style={({ pressed }) => [
//                 styles.card,
//                 !notification.isRead && styles.unreadCard,
//                 pressed && styles.pressed,
//               ]}
//               onPress={() => handleNotificationPress(notification)}
//             >
//               {/* Avatar */}
//               <View style={styles.avatarContainer}>
//                 {notification.sender?.profileImage ? (
//                   <Image
//                     source={{ uri: notification.sender.profileImage }}
//                     style={styles.avatarImage}
//                   />
//                 ) : (
//                   <View style={styles.avatarFallback}>
//                     <Text style={styles.avatarText}>
//                       {notification.sender?.name?.charAt(0)?.toUpperCase() ||
//                         "U"}
//                     </Text>
//                   </View>
//                 )}
//                 <View style={styles.typeBadge}>
//                   <Text style={styles.typeIcon}>
//                     {notification.type === "like" ? "❤️" : "💬"}
//                   </Text>
//                 </View>
//               </View>

//               {/* Content */}
//               <View style={styles.content}>
//                 <Text style={styles.message}>
//                   <Text style={styles.name}>
//                     {notification.sender?.name || "Someone"}
//                   </Text>{" "}
//                   {notification.type === "like"
//                     ? "liked your post"
//                     : "commented on your post"}
//                 </Text>
//                 <Text style={styles.time}>
//                   {formatDate(notification.createdAt)}
//                 </Text>
//               </View>

//               {/* Unread indicator */}
//               {!notification.isRead && <View style={styles.unreadDot} />}
//             </Pressable>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8fafc", // Slate-50
//   },
//   list: {
//     padding: 20,
//     paddingTop: 24,
//     maxWidth: 800,
//     width: "100%",
//     alignSelf: "center",
//   },
//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 30,
//     backgroundColor: "#f8fafc",
//   },

//   // Card
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 14,
//     shadowColor: "#0f172a",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.04,
//     shadowRadius: 12,
//     elevation: 3,
//   },
//   unreadCard: {
//     backgroundColor: "#eef2ff", // Subtle Indigo-50 tint for unread
//     borderColor: "#e0e7ff",
//   },
//   pressed: {
//     opacity: 0.7,
//     transform: [{ scale: 0.98 }],
//   },

//   // Avatar & Type Badge
//   avatarContainer: {
//     marginRight: 16,
//     position: "relative",
//   },
//   avatarFallback: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#0f172a",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#334155",
//   },
//   avatarImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   avatarText: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "800",
//   },
//   typeBadge: {
//     position: "absolute",
//     bottom: -4,
//     right: -4,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#ffffff",
//     borderWidth: 2,
//     borderColor: "#ffffff",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#0f172a",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   typeIcon: {
//     fontSize: 11,
//   },

//   // Content
//   content: {
//     flex: 1,
//   },
//   message: {
//     fontSize: 15,
//     color: "#334155", // Slate-700
//     lineHeight: 21,
//     fontWeight: "500",
//   },
//   name: {
//     fontWeight: "800",
//     color: "#0f172a", // Slate-900
//   },
//   time: {
//     fontSize: 12,
//     color: "#94a3b8", // Slate-400
//     marginTop: 6,
//     fontWeight: "600",
//   },

//   // Unread Dot
//   unreadDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#6366f1", // Indigo-500
//     marginLeft: 12,
//   },

//   // Loading
//   loadingText: {
//     marginTop: 16,
//     color: "#64748b",
//     fontSize: 15,
//     fontWeight: "600",
//   },

//   // Error
//   errorText: {
//     color: "#ef4444",
//     textAlign: "center",
//     marginBottom: 20,
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   retryButton: {
//     backgroundColor: "#0f172a",
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     borderRadius: 14,
//   },
//   retryButtonText: {
//     color: "#ffffff",
//     fontWeight: "800",
//     fontSize: 14,
//   },

//   // Empty State
//   emptyIconWrap: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "#f1f5f9",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   emptyIcon: {
//     fontSize: 44,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#0f172a",
//     letterSpacing: -0.5,
//   },
//   emptySubtitle: {
//     marginTop: 8,
//     color: "#64748b",
//     fontSize: 15,
//     textAlign: "center",
//     fontWeight: "500",
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// import API_URL from "../api/api";
// import socket from "../socket/socket";

// type NotificationItem = {
//   _id: string;
//   type: "like" | "comment";
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   sender?: {
//     _id: string;
//     name: string;
//     email: string;
//     profileImage?: string;
//   };
//   post?: {
//     _id: string;
//     title: string;
//   };
// };

// // =====================================================
// // GET JWT TOKEN
// // =====================================================
// const getToken = async () => {
//   if (Platform.OS === "web") {
//     return localStorage.getItem("token");
//   }

//   return await SecureStore.getItemAsync("token");
// };

// export default function Notifications() {
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // =====================================================
//   // LOAD NOTIFICATIONS
//   // =====================================================
//   const loadNotifications = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = await getToken();

//       if (!token) {
//         setError("Login token not found. Please login again.");
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/notifications`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load notifications");
//       }

//       setNotifications(data.notifications || []);
//     } catch (error) {
//       console.error("NOTIFICATION ERROR:", error);

//       setError(
//         error instanceof Error
//           ? error.message
//           : "Unable to load notifications",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // =====================================================
//   // SOCKET.IO - RECEIVE REAL-TIME NOTIFICATION
//   // =====================================================
//   useEffect(() => {
//     const handleNewNotification = (notification: NotificationItem) => {
//       setNotifications((current) => {
//         const alreadyExists = current.some(
//           (item) => item._id === notification._id,
//         );

//         if (alreadyExists) {
//           return current;
//         }

//         return [notification, ...current];
//       });
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, []);

//   // =====================================================
//   // LOAD EVERY TIME SCREEN GETS FOCUS
//   // =====================================================
//   useFocusEffect(
//     useCallback(() => {
//       loadNotifications();
//     }, [loadNotifications]),
//   );

//   // =====================================================
//   // MARK NOTIFICATION AS READ
//   // =====================================================
//   const markAsRead = async (id: string) => {
//     try {
//       const token = await getToken();

//       if (!token) return;

//       const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.log("Failed to mark notification as read:", data);
//         return;
//       }

//       console.log("NOTIFICATION MARKED AS READ:", id);

//       socket.emit("notification-read", id);
//     } catch (error) {
//       console.log("MARK READ ERROR:", error);
//     }
//   };

//   // =====================================================
//   // NOTIFICATION PRESS
//   // =====================================================
//   const handleNotificationPress = async (
//     notification: NotificationItem,
//   ) => {
//     if (!notification.isRead) {
//       await markAsRead(notification._id);

//       setNotifications((current) =>
//         current.map((item) =>
//           item._id === notification._id
//             ? { ...item, isRead: true }
//             : item,
//         ),
//       );
//     }

//     if (notification.post?._id) {
//       router.push({
//         pathname: "/post-detail",
//         params: {
//           id: notification.post._id,
//         },
//       });
//     }
//   };

//   // =====================================================
//   // FORMAT DATE
//   // =====================================================
//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleString([], {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0f172a" />
//         <Text style={styles.loadingText}>Loading notifications...</Text>
//       </View>
//     );
//   }

//   // =====================================================
//   // MAIN SCREEN
//   // =====================================================
//   return (
//     <View style={styles.container}>
//       {/* Error State */}
//       {error ? (
//         <View style={styles.center}>
//           <Text style={styles.errorText}>{error}</Text>

//           <Pressable
//             style={({ pressed }) => [
//               styles.retryButton,
//               pressed && styles.pressed,
//             ]}
//             onPress={loadNotifications}
//           >
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </Pressable>
//         </View>
//       ) : notifications.length === 0 ? (
//         // =================================================
//         // EMPTY STATE
//         // =================================================
//         <View style={styles.center}>
//           <View style={styles.emptyIconWrap}>
//             <Text style={styles.emptyIcon}>🔔</Text>
//           </View>

//           <Text style={styles.emptyTitle}>No notifications</Text>

//           <Text style={styles.emptySubtitle}>
//             Likes and comments on your posts will appear here.
//           </Text>
//         </View>
//       ) : (
//         // =================================================
//         // NOTIFICATION LIST
//         // =================================================
//         <ScrollView
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//         >
//           {notifications.map((notification) => (
//             <Pressable
//               key={notification._id}
//               style={({ pressed }) => [
//                 styles.card,
//                 !notification.isRead && styles.unreadCard,
//                 pressed && styles.pressed,
//               ]}
//               onPress={() => handleNotificationPress(notification)}
//             >
//               {/* Avatar */}
//               <View style={styles.avatarContainer}>
//                 {notification.sender?.profileImage ? (
//                   <Image
//                     source={{ uri: notification.sender.profileImage }}
//                     style={styles.avatarImage}
//                   />
//                 ) : (
//                   <View style={styles.avatarFallback}>
//                     <Text style={styles.avatarText}>
//                       {notification.sender?.name?.charAt(0)?.toUpperCase() ||
//                         "U"}
//                     </Text>
//                   </View>
//                 )}

//                 <View style={styles.typeBadge}>
//                   <Text style={styles.typeIcon}>
//                     {notification.type === "like" ? "❤️" : "💬"}
//                   </Text>
//                 </View>
//               </View>

//               {/* Content */}
//               <View style={styles.content}>
//                 <Text style={styles.message}>
//                   <Text style={styles.name}>
//                     {notification.sender?.name || "Someone"}
//                   </Text>{" "}
//                   {notification.type === "like"
//                     ? "liked your post"
//                     : "commented on your post"}
//                 </Text>

//                 <Text style={styles.time}>
//                   {formatDate(notification.createdAt)}
//                 </Text>
//               </View>

//               {/* Unread indicator */}
//               {!notification.isRead && <View style={styles.unreadDot} />}
//             </Pressable>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//   },

//   list: {
//     padding: 20,
//     paddingTop: 24,
//     maxWidth: 800,
//     width: "100%",
//     alignSelf: "center",
//   },

//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 30,
//     backgroundColor: "#f8fafc",
//   },

//   // Card
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 14,
//     shadowColor: "#0f172a",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.04,
//     shadowRadius: 12,
//     elevation: 3,
//   },

//   unreadCard: {
//     backgroundColor: "#eef2ff",
//     borderColor: "#e0e7ff",
//   },

//   pressed: {
//     opacity: 0.7,
//     transform: [{ scale: 0.98 }],
//   },

//   // Avatar & Type Badge
//   avatarContainer: {
//     marginRight: 16,
//     position: "relative",
//   },

//   avatarFallback: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#0f172a",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#334155",
//   },

//   avatarImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },

//   avatarText: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "800",
//   },

//   typeBadge: {
//     position: "absolute",
//     bottom: -4,
//     right: -4,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#ffffff",
//     borderWidth: 2,
//     borderColor: "#ffffff",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#0f172a",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },

//   typeIcon: {
//     fontSize: 11,
//   },

//   // Content
//   content: {
//     flex: 1,
//   },

//   message: {
//     fontSize: 15,
//     color: "#334155",
//     lineHeight: 21,
//     fontWeight: "500",
//   },

//   name: {
//     fontWeight: "800",
//     color: "#0f172a",
//   },

//   time: {
//     fontSize: 12,
//     color: "#94a3b8",
//     marginTop: 6,
//     fontWeight: "600",
//   },

//   // Unread Dot
//   unreadDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#6366f1",
//     marginLeft: 12,
//   },

//   // Loading
//   loadingText: {
//     marginTop: 16,
//     color: "#64748b",
//     fontSize: 15,
//     fontWeight: "600",
//   },

//   // Error
//   errorText: {
//     color: "#ef4444",
//     textAlign: "center",
//     marginBottom: 20,
//     fontSize: 15,
//     fontWeight: "600",
//   },

//   retryButton: {
//     backgroundColor: "#0f172a",
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     borderRadius: 14,
//   },

//   retryButtonText: {
//     color: "#ffffff",
//     fontWeight: "800",
//     fontSize: 14,
//   },

//   // Empty State
//   emptyIconWrap: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "#f1f5f9",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 24,
//   },

//   emptyIcon: {
//     fontSize: 44,
//   },

//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#0f172a",
//     letterSpacing: -0.5,
//   },

//   emptySubtitle: {
//     marginTop: 8,
//     color: "#64748b",
//     fontSize: 15,
//     textAlign: "center",
//     fontWeight: "500",
//   },
// });

import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import API_URL from "../api/api";
import socket from "../socket/socket";

type NotificationItem = {
  _id: string;
  type: "like" | "comment";
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  post?: {
    _id: string;
    title: string;
  };
};

// =====================================================
// GET JWT TOKEN
// =====================================================

const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }

  return await SecureStore.getItemAsync("token");
};

// =====================================================
// NOTIFICATIONS
// =====================================================

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      if (!token) {
        setError("Login token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load notifications",
        );
      }

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("NOTIFICATION ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // SOCKET.IO - NEW NOTIFICATION
  // =====================================================

  useEffect(() => {
    const handleNewNotification = (
      notification: NotificationItem,
    ) => {
      console.log("NEW NOTIFICATION:", notification);

      setNotifications((current) => {
        const alreadyExists = current.some(
          (item) => String(item._id) === String(notification._id),
        );

        if (alreadyExists) {
          return current;
        }

        return [notification, ...current];
      });
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, []);

  // =====================================================
  // LOAD WHEN SCREEN GETS FOCUS
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  // =====================================================
  // MARK NOTIFICATION AS READ
  // =====================================================

  const markAsRead = async (id: string) => {
    try {
      const token = await getToken();

      if (!token) {
        console.log("TOKEN NOT FOUND");
        return false;
      }

      const response = await fetch(
        `${API_URL}/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(
          "FAILED TO MARK NOTIFICATION AS READ:",
          data,
        );
        return false;
      }
      console.log("MARK READ API RESPONSE:", data);
      console.log("SERVER isRead VALUE:", data.notification?.isRead);
      console.log("NOTIFICATION MARKED AS READ:", id);

      // =================================================
      // UPDATE WEBLAYOUT IMMEDIATELY
      // =================================================

      if (Platform.OS === "web") {
        window.dispatchEvent(
          new CustomEvent("notification-read", {
            detail: id,
          }),
        );
      }

      return true;
    } catch (error) {
      console.log("MARK READ ERROR:", error);
      return false;
    }
  };

  // =====================================================
  // NOTIFICATION PRESS
  // =====================================================

  const handleNotificationPress = async (
    notification: NotificationItem,
  ) => {
    if (!notification.isRead) {
      const success = await markAsRead(notification._id);

      if (success) {
        // Update notification page immediately
        setNotifications((current) =>
          current.map((item) =>
            String(item._id) === String(notification._id)
              ? {
                ...item,
                isRead: true,
              }
              : item,
          ),
        );
      }
    }

    // Open post
    if (notification.post?._id) {
      router.push({
        pathname: "/post-detail",
        params: {
          id: notification.post._id,
        },
      });
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#0f172a"
        />

        <Text style={styles.loadingText}>
          Loading notifications...
        </Text>
      </View>
    );
  }

  // =====================================================
  // MAIN SCREEN
  // =====================================================

  return (
    <View style={styles.container}>
      {error ? (
        // =================================================
        // ERROR STATE
        // =================================================

        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
            onPress={loadNotifications}
          >
            <Text style={styles.retryButtonText}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : notifications.length === 0 ? (
        // =================================================
        // EMPTY STATE
        // =================================================

        <View style={styles.center}>
          <View style={styles.emptyIconWrap}>
            <Text style={styles.emptyIcon}>
              🔔
            </Text>
          </View>

          <Text style={styles.emptyTitle}>
            No notifications
          </Text>

          <Text style={styles.emptySubtitle}>
            Likes and comments on your posts will appear here.
          </Text>
        </View>
      ) : (
        // =================================================
        // NOTIFICATION LIST
        // =================================================

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((notification) => (
            <Pressable
              key={notification._id}
              style={({ pressed }) => [
                styles.card,
                !notification.isRead &&
                styles.unreadCard,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                handleNotificationPress(notification)
              }
            >
              {/* Avatar */}

              <View style={styles.avatarContainer}>
                {notification.sender?.profileImage ? (
                  <Image
                    source={{
                      uri: notification.sender.profileImage,
                    }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>
                      {notification.sender?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </Text>
                  </View>
                )}

                <View style={styles.typeBadge}>
                  <Text style={styles.typeIcon}>
                    {notification.type === "like"
                      ? "❤️"
                      : "💬"}
                  </Text>
                </View>
              </View>

              {/* Content */}

              <View style={styles.content}>
                <Text style={styles.message}>
                  <Text style={styles.name}>
                    {notification.sender?.name ||
                      "Someone"}
                  </Text>{" "}
                  {notification.type === "like"
                    ? "liked your post"
                    : "commented on your post"}
                </Text>

                <Text style={styles.time}>
                  {formatDate(notification.createdAt)}
                </Text>
              </View>

              {/* Unread indicator */}

              {!notification.isRead && (
                <View style={styles.unreadDot} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  list: {
    padding: 20,
    paddingTop: 24,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#f8fafc",
  },

  // ===================================================
  // CARD
  // ===================================================

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#0f172a",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  unreadCard: {
    backgroundColor: "#eef2ff",
    borderColor: "#e0e7ff",
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  // ===================================================
  // AVATAR
  // ===================================================

  avatarContainer: {
    marginRight: 16,
    position: "relative",
  },

  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },

  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  typeBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  typeIcon: {
    fontSize: 11,
  },

  // ===================================================
  // CONTENT
  // ===================================================

  content: {
    flex: 1,
  },

  message: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 21,
    fontWeight: "500",
  },

  name: {
    fontWeight: "800",
    color: "#0f172a",
  },

  time: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 6,
    fontWeight: "600",
  },

  // ===================================================
  // UNREAD DOT
  // ===================================================

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6366f1",
    marginLeft: 12,
  },

  // ===================================================
  // LOADING
  // ===================================================

  loadingText: {
    marginTop: 16,
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },

  // ===================================================
  // ERROR
  // ===================================================

  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 15,
    fontWeight: "600",
  },

  retryButton: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },

  retryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },

  // ===================================================
  // EMPTY STATE
  // ===================================================

  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyIcon: {
    fontSize: 44,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },

  emptySubtitle: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
  },
});
