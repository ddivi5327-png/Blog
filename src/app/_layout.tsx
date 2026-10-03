// import { Drawer } from "expo-router/drawer";

// export default function RootLayout() {
//   return (
//     <Drawer>
//       <Drawer.Screen
//         name="home"
//         options={{
//           title: "Home",
//         }}
//       />

//       <Drawer.Screen
//         name="login"
//         options={{
//           title: "Login",
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="register"
//         options={{
//           title: "Register",
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="index"
//         options={{
//           drawerItemStyle: { display: "none" },
//         }}
//       />

//       <Drawer.Screen
//         name="create-post"
//         options={{
//           title: "Create Blog",
//         }}
//       />

//       <Drawer.Screen
//         name="post-detail"
//         options={{
//           drawerItemStyle: { display: "none" },
//         }}
//       />
//     </Drawer>
//   );
// }
// import { Stack } from "expo-router";
// import { Drawer } from "expo-router/drawer";
// import { Platform } from "react-native";
// import WebLayout from "./web-layout";

// export default function RootLayout() {
//   // Laptop / Web
//   if (Platform.OS === "web") {
//     return (
//       <WebLayout>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         />
//       </WebLayout>
//     );
//   }

//   // Mobile
//   return (
//     <Drawer>
//       <Drawer.Screen
//         name="home"
//         options={{
//           title: "Home",
//         }}
//       />
//       <Drawer.Screen
//         name="login"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="register"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />
//       <Drawer.Screen
//         name="web-layout"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />
//       <Drawer.Screen
//         name="index"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       <Drawer.Screen
//         name="create-post"
//         options={{
//           title: "Create Blog",
//         }}
//       />

//       <Drawer.Screen
//         name="post-detail"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       <Drawer.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//         }}
//       />

//       <Drawer.Screen
//         name="edit-profile"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="edit-post"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />
//       <Drawer.Screen
//         name="logout"
//         options={{
//           title: "Logout",
//         }}
//       />
//     </Drawer>
//   );
// }
// import { Stack } from "expo-router";
// import { Drawer } from "expo-router/drawer";
// import { Platform } from "react-native";
// import WebLayout from "./web-layout";

// export default function RootLayout() {
//   // Laptop / Web
//   if (Platform.OS === "web") {
//     return (
//       <WebLayout>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         />
//       </WebLayout>
//     );
//   }

//   // Mobile
//   return (
//     <Drawer
//       screenOptions={{
//         headerShown: true,
//       }}
//     >
//       {/* Main page */}
//       <Drawer.Screen
//         name="home"
//         options={{
//           title: "Home",
//         }}
//       />

//       {/* Login - accessible by URL, but hidden from Drawer */}
//       <Drawer.Screen
//         name="login"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       {/* Register - accessible by URL, but hidden from Drawer */}
//       <Drawer.Screen
//         name="register"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       {/* Web layout - hidden from Drawer */}
//       <Drawer.Screen
//         name="web-layout"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       {/* Public dashboard - hidden from Drawer */}
//       <Drawer.Screen
//         name="index"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       {/* Create post */}
//       <Drawer.Screen
//         name="create-post"
//         options={{
//           title: "Create Blog",
//         }}
//       />

//       {/* Post detail - hidden from Drawer */}
//       <Drawer.Screen
//         name="post-detail"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       {/* Profile */}
//       <Drawer.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//         }}
//       />

//       {/* Edit profile - hidden from Drawer */}
//       <Drawer.Screen
//         name="edit-profile"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       {/* Edit post - hidden from Drawer */}
//       <Drawer.Screen
//         name="edit-post"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       {/* Logout */}
//       <Drawer.Screen
//         name="logout"
//         options={{
//           title: "Logout",
//         }}
//       />
//     </Drawer>
//   );
// }
// import { router, Stack, usePathname } from "expo-router";
// import { Drawer } from "expo-router/drawer";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Platform,
//   Pressable,
//   Text,
//   View,
// } from "react-native";
// import WebLayout from "./web-layout";

// type AuthUser = {
//   id: string;
//   name: string;
//   email: string;
// };

// export default function RootLayout() {
//   // =========================
//   // WEB / LAPTOP
//   // =========================
//   if (Platform.OS === "web") {
//     return (
//       <WebLayout>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         />
//       </WebLayout>
//     );
//   }

//   // =========================
//   // MOBILE
//   // =========================
//   return <MobileLayout />;
// }

// function MobileLayout() {
//   const pathname = usePathname();

//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   // =========================
//   // CHECK LOGIN STATUS
//   // =========================
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await SecureStore.getItemAsync("token");
//         const userJson = await SecureStore.getItemAsync("user");

//         // No login information
//         if (!token || !userJson) {
//           setUser(null);
//           setLoading(false);
//           return;
//         }

//         // Check JWT expiry
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));

//           if (!payload.exp || payload.exp * 1000 <= Date.now()) {
//             await SecureStore.deleteItemAsync("token");
//             await SecureStore.deleteItemAsync("user");

//             setUser(null);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.log("Invalid token");

//           await SecureStore.deleteItemAsync("token");
//           await SecureStore.deleteItemAsync("user");

//           setUser(null);
//           setLoading(false);
//           return;
//         }

//         // Get stored user
//         const storedUser: AuthUser = JSON.parse(userJson);

//         setUser(storedUser);
//       } catch (error) {
//         console.error("Authentication check failed:", error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [pathname]);

//   // =========================
//   // LOGOUT
//   // =========================
//   const handleLogout = async () => {
//     try {
//       // Delete saved login information
//       await SecureStore.deleteItemAsync("token");
//       await SecureStore.deleteItemAsync("user");

//       // Immediately update authentication state
//       setUser(null);

//       // Go to public dashboard
//       router.replace("/");
//     } catch (error) {
//       console.error("Logout error:", error);

//       Alert.alert("Logout failed", "Something went wrong. Please try again.");
//     }
//   };

//   // =========================
//   // LOADING
//   // =========================
//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // =========================
//   // NOT LOGGED IN
//   // =========================
//   if (!user) {
//     return (
//       <Stack
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="index" />
//         <Stack.Screen name="login" />
//         <Stack.Screen name="register" />

//         {/* Private routes */}
//         <Stack.Screen name="home" />
//         <Stack.Screen name="create-post" />
//         <Stack.Screen name="profile" />
//         <Stack.Screen name="edit-profile" />
//         <Stack.Screen name="edit-post" />
//         <Stack.Screen name="post-detail" />
//         <Stack.Screen name="web-layout" />
//       </Stack>
//     );
//   }

//   // =========================
//   // LOGGED IN
//   // =========================
//   return (
//     <Drawer
//       screenOptions={{
//         headerShown: true,
//       }}
//       drawerContent={(props) => (
//         <View
//           style={{
//             flex: 1,
//             paddingTop: 50,
//             paddingHorizontal: 20,
//           }}
//         >
//           {/* Drawer navigation items */}
//           <View style={{ flex: 1 }}>
//             <Pressable
//               onPress={() => router.push("/home")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Home
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={() => router.push("/create-post")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Create Blog
//               </Text>
//             </Pressable>
//             <Pressable
//               onPress={() => router.push("/notifications")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Notifications
//               </Text>
//             </Pressable>
//             <Pressable
//               onPress={() => router.push("/profile")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Profile
//               </Text>
//             </Pressable>
//           </View>

//           {/* Logout */}
//           <Pressable
//             onPress={handleLogout}
//             style={{
//               paddingVertical: 18,
//               borderTopWidth: 1,
//               borderTopColor: "#ddd",
//               marginBottom: 20,
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 17,
//                 fontWeight: "600",
//               }}
//             >
//               Logout
//             </Text>
//           </Pressable>
//         </View>
//       )}
//     >
//       {/* Home */}
//       <Drawer.Screen
//         name="home"
//         options={{
//           title: "Home",
//         }}
//       />

//       {/* Create Post */}
//       <Drawer.Screen
//         name="create-post"
//         options={{
//           title: "Create Blog",
//         }}
//       />

//       {/* Profile */}
//       <Drawer.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//         }}
//       />
//       <Drawer.Screen
//         name="notifications"
//         options={{
//           title: "Notifications",
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />
//       {/* Hidden routes */}
//       <Drawer.Screen
//         name="post-detail"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       <Drawer.Screen
//         name="edit-profile"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="edit-post"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="index"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       <Drawer.Screen
//         name="login"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="register"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="web-layout"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />
//     </Drawer>
//   );
// }

// import { router, Stack, usePathname } from "expo-router";
// import { Drawer } from "expo-router/drawer";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Platform,
//   Pressable,
//   Text,
//   View,
// } from "react-native";
// import socket from "../socket/socket";
// import WebLayout from "./web-layout";

// type AuthUser = {
//   id: string;
//   name: string;
//   email: string;
// };

// export default function RootLayout() {
//   // =========================
//   // WEB / LAPTOP
//   // =========================
//   if (Platform.OS === "web") {
//     return (
//       <WebLayout>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         />
//       </WebLayout>
//     );
//   }

//   // =========================
//   // MOBILE
//   // =========================
//   return <MobileLayout />;
// }

// function MobileLayout() {
//   const pathname = usePathname();

//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   // =========================
//   // CHECK LOGIN STATUS
//   // =========================
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await SecureStore.getItemAsync("token");
//         const userJson = await SecureStore.getItemAsync("user");

//         // No login information
//         if (!token || !userJson) {
//           setUser(null);
//           setLoading(false);
//           return;
//         }

//         // Check JWT expiry
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));

//           if (!payload.exp || payload.exp * 1000 <= Date.now()) {
//             await SecureStore.deleteItemAsync("token");
//             await SecureStore.deleteItemAsync("user");

//             setUser(null);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.log("Invalid token");

//           await SecureStore.deleteItemAsync("token");
//           await SecureStore.deleteItemAsync("user");

//           setUser(null);
//           setLoading(false);
//           return;
//         }

//         // Get stored user
//         const storedUser: AuthUser = JSON.parse(userJson);

//         setUser(storedUser);
//       } catch (error) {
//         console.error("Authentication check failed:", error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [pathname]);

//   // =========================
//   // SOCKET.IO CONNECTION
//   // =========================
//   useEffect(() => {
//     if (!user) {
//       // User is not logged in
//       socket.disconnect();
//       return;
//     }

//     // Connect socket if it is not already connected
//     if (!socket.connected) {
//       socket.connect();
//     }

//     // Join this user's private notification room
//     socket.emit("join-user", user.id);

//     console.log("JOINING SOCKET ROOM:", user.id);

//     return () => {
//       // We do not disconnect here because the user
//       // may navigate between different screens.
//     };
//   }, [user]);

//   // =========================
//   // LOGOUT
//   // =========================
//   const handleLogout = async () => {
//     try {
//       // Disconnect Socket.IO
//       // socket.disconnect();

//       // Delete saved login information
//       await SecureStore.deleteItemAsync("token");
//       await SecureStore.deleteItemAsync("user");

//       // Immediately update authentication state
//       setUser(null);

//       // Go to public dashboard
//       router.replace("/");
//     } catch (error) {
//       console.error("Logout error:", error);

//       Alert.alert("Logout failed", "Something went wrong. Please try again.");
//     }
//   };

//   // =========================
//   // LOADING
//   // =========================
//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // =========================
//   // NOT LOGGED IN
//   // =========================
//   if (!user) {
//     return (
//       <Stack
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="index" />
//         <Stack.Screen name="login" />
//         <Stack.Screen name="register" />

//         {/* Private routes */}
//         <Stack.Screen name="home" />
//         <Stack.Screen name="create-post" />
//         <Stack.Screen name="profile" />
//         <Stack.Screen name="edit-profile" />
//         <Stack.Screen name="edit-post" />
//         <Stack.Screen name="post-detail" />
//         <Stack.Screen name="notifications" />
//         <Stack.Screen name="web-layout" />
//       </Stack>
//     );
//   }

//   // =========================
//   // LOGGED IN
//   // =========================
//   return (
//     <Drawer
//       screenOptions={{
//         headerShown: true,
//       }}
//       drawerContent={(props) => (
//         <View
//           style={{
//             flex: 1,
//             paddingTop: 50,
//             paddingHorizontal: 20,
//           }}
//         >
//           {/* Drawer navigation items */}
//           <View style={{ flex: 1 }}>
//             <Pressable
//               onPress={() => router.push("/home")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Home
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={() => router.push("/create-post")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Create Blog
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={() => router.push("/notifications")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Notifications
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={() => router.push("/profile")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Profile
//               </Text>
//             </Pressable>
//           </View>

//           {/* Logout */}
//           <Pressable
//             onPress={handleLogout}
//             style={{
//               paddingVertical: 18,
//               borderTopWidth: 1,
//               borderTopColor: "#ddd",
//               marginBottom: 20,
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 17,
//                 fontWeight: "600",
//               }}
//             >
//               Logout
//             </Text>
//           </Pressable>
//         </View>
//       )}
//     >
//       {/* Home */}
//       <Drawer.Screen
//         name="home"
//         options={{
//           title: "Home",
//         }}
//       />

//       {/* Create Post */}
//       <Drawer.Screen
//         name="create-post"
//         options={{
//           title: "Create Blog",
//         }}
//       />

//       {/* Profile */}
//       <Drawer.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//         }}
//       />

//       {/* Notifications */}
//       <Drawer.Screen
//         name="notifications"
//         options={{
//           title: "Notifications",
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       {/* Hidden routes */}
//       <Drawer.Screen
//         name="post-detail"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       <Drawer.Screen
//         name="edit-profile"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="edit-post"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="index"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       <Drawer.Screen
//         name="login"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="register"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="web-layout"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />
//     </Drawer>
//   );
// }

// import { router, Stack, usePathname } from "expo-router";
// import { Drawer } from "expo-router/drawer";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
//   Pressable,
//   Text,
//   View,
// } from "react-native";
// import API_URL from "../api/api";
// import socket from "../socket/socket";
// import WebLayout from "./web-layout";

// type AuthUser = {
//   id: string;
//   name: string;
//   email: string;
//   profileImage?: string;
// };

// type NotificationItem = {
//   _id: string;
//   isRead: boolean;
// };

// export default function RootLayout() {
//   // =========================
//   // WEB / LAPTOP
//   // =========================
//   if (Platform.OS === "web") {
//     return (
//       <WebLayout>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         />
//       </WebLayout>
//     );
//   }

//   // =========================
//   // MOBILE
//   // =========================
//   return <MobileLayout />;
// }

// function MobileLayout() {
//   const pathname = usePathname();

//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Notification unread count
//   const [unreadCount, setUnreadCount] = useState(0);

//   // =========================
//   // CHECK LOGIN STATUS
//   // =========================
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await SecureStore.getItemAsync("token");
//         const userJson = await SecureStore.getItemAsync("user");

//         // No login information
//         if (!token || !userJson) {
//           setUser(null);
//           setLoading(false);
//           return;
//         }

//         // Check JWT expiry
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));

//           if (!payload.exp || payload.exp * 1000 <= Date.now()) {
//             await SecureStore.deleteItemAsync("token");
//             await SecureStore.deleteItemAsync("user");

//             setUser(null);
//             setUnreadCount(0);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.log("Invalid token");

//           await SecureStore.deleteItemAsync("token");
//           await SecureStore.deleteItemAsync("user");

//           setUser(null);
//           setUnreadCount(0);
//           setLoading(false);
//           return;
//         }

//         // Get stored user
//         const storedUser: AuthUser = JSON.parse(userJson);

//         setUser(storedUser);
//       } catch (error) {
//         console.error("Authentication check failed:", error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [pathname]);

//   // =========================
//   // SOCKET.IO CONNECTION
//   // =========================
//   useEffect(() => {
//     if (!user) {
//       socket.disconnect();
//       setUnreadCount(0);
//       return;
//     }

//     // Connect socket if it is not already connected
//     if (!socket.connected) {
//       socket.connect();
//     }

//     // Join this user's private notification room
//     socket.emit("join-user", user.id);

//     console.log("JOINING SOCKET ROOM:", user.id);

//     // =========================
//     // NEW NOTIFICATION
//     // =========================
//     const handleNewNotification = () => {
//       console.log("NEW NOTIFICATION RECEIVED");

//       setUnreadCount((current) => current + 1);
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, [user]);

//   // =========================
//   // GET NOTIFICATION COUNT
//   // =========================
//   useEffect(() => {
//     if (!user) {
//       setUnreadCount(0);
//       return;
//     }

//     const loadUnreadCount = async () => {
//       try {
//         const token = await SecureStore.getItemAsync("token");

//         if (!token) {
//           return;
//         }

//         const response = await fetch(`${API_URL}/api/notifications`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           console.log("Failed to fetch notifications:", data.message);
//           return;
//         }

//         const notifications: NotificationItem[] =
//           data.notifications || data.data || [];

//         const unread = notifications.filter(
//           (notification) => !notification.isRead,
//         ).length;

//         setUnreadCount(unread);
//       } catch (error) {
//         console.error("Failed to load notification count:", error);
//       }
//     };

//     loadUnreadCount();
//   }, [user, pathname]);

//   // =========================
//   // LOGOUT
//   // =========================
//   const handleLogout = async () => {
//     try {
//       await SecureStore.deleteItemAsync("token");
//       await SecureStore.deleteItemAsync("user");

//       setUser(null);
//       setUnreadCount(0);

//       socket.disconnect();

//       router.replace("/");
//     } catch (error) {
//       console.error("Logout error:", error);

//       Alert.alert("Logout failed", "Something went wrong. Please try again.");
//     }
//   };

//   // =========================
//   // NOTIFICATION PRESS
//   // =========================
//   const handleNotificationPress = () => {
//     router.push("/notifications");
//   };

//   // =========================
//   // CREATE POST PRESS
//   // =========================
//   const handleCreatePostPress = () => {
//     router.push("/create-post");
//   };

//   // =========================
//   // PROFILE PRESS
//   // =========================
//   const handleProfilePress = () => {
//     router.push("/profile");
//   };

//   // =========================
//   // LOADING
//   // =========================
//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // =========================
//   // NOT LOGGED IN
//   // =========================
//   if (!user) {
//     return (
//       <Stack
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="index" />
//         <Stack.Screen name="login" />
//         <Stack.Screen name="register" />

//         {/* Private routes */}
//         <Stack.Screen name="home" />
//         <Stack.Screen name="create-post" />
//         <Stack.Screen name="profile" />
//         <Stack.Screen name="edit-profile" />
//         <Stack.Screen name="edit-post" />
//         <Stack.Screen name="post-detail" />
//         <Stack.Screen name="notifications" />
//         <Stack.Screen name="web-layout" />
//       </Stack>
//     );
//   }

//   // =========================
//   // LOGGED IN
//   // =========================
//   return (
//     <Drawer
//       screenOptions={{
//         headerShown: true,

//         // =========================
//         // CUSTOM MOBILE HEADER
//         // =========================
//         headerTitle: "Blog",

//         headerRight: () => (
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginRight: 15,
//               gap: 18,
//             }}
//           >
//             {/* =========================
//                 NOTIFICATION
//             ========================= */}
//             <Pressable
//               onPress={handleNotificationPress}
//               style={{
//                 position: "relative",
//                 padding: 4,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 20,
//                 }}
//               >
//                 🔔
//               </Text>

//               {unreadCount > 0 && (
//                 <View
//                   style={{
//                     position: "absolute",
//                     top: -4,
//                     right: -7,
//                     minWidth: 18,
//                     height: 18,
//                     borderRadius: 9,
//                     backgroundColor: "red",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     paddingHorizontal: 3,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "white",
//                       fontSize: 10,
//                       fontWeight: "700",
//                     }}
//                   >
//                     {unreadCount > 99 ? "99+" : unreadCount}
//                   </Text>
//                 </View>
//               )}
//             </Pressable>

//             {/* =========================
//                 CREATE POST
//             ========================= */}
//             <Pressable
//               onPress={handleCreatePostPress}
//               style={{
//                 padding: 4,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 30,
//                   fontWeight: "400",
//                 }}
//               >
//                 +
//               </Text>
//             </Pressable>

//             {/* =========================
//                 PROFILE IMAGE
//             ========================= */}
//             <Pressable
//               onPress={handleProfilePress}
//               style={{
//                 padding: 2,
//               }}
//             >
//               {user.profileImage ? (
//                 <Image
//                   source={{
//                     uri: user.profileImage,
//                   }}
//                   style={{
//                     width: 34,
//                     height: 34,
//                     borderRadius: 17,
//                   }}
//                 />
//               ) : (
//                 <View
//                   style={{
//                     width: 34,
//                     height: 34,
//                     borderRadius: 17,
//                     backgroundColor: "#ddd",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 16,
//                       fontWeight: "600",
//                     }}
//                   >
//                     {user.name?.charAt(0)?.toUpperCase() || "U"}
//                   </Text>
//                 </View>
//               )}
//             </Pressable>
//           </View>
//         ),
//       }}
//       drawerContent={(props) => (
//         <View
//           style={{
//             flex: 1,
//             paddingTop: 50,
//             paddingHorizontal: 20,
//           }}
//         >
//           {/* Drawer navigation items */}
//           <View style={{ flex: 1 }}>
//             <Pressable
//               onPress={() => router.push("/home")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Home
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={() => router.push("/create-post")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Create Blog
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={() => router.push("/notifications")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Notifications
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={() => router.push("/profile")}
//               style={{
//                 paddingVertical: 15,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 17,
//                 }}
//               >
//                 Profile
//               </Text>
//             </Pressable>
//           </View>

//           {/* Logout */}
//           <Pressable
//             onPress={handleLogout}
//             style={{
//               paddingVertical: 18,
//               borderTopWidth: 1,
//               borderTopColor: "#ddd",
//               marginBottom: 20,
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 17,
//                 fontWeight: "600",
//               }}
//             >
//               Logout
//             </Text>
//           </Pressable>
//         </View>
//       )}
//     >
//       {/* Home */}
//       <Drawer.Screen
//         name="home"
//         options={{
//           title: "Home",
//         }}
//       />

//       {/* Create Post */}
//       <Drawer.Screen
//         name="create-post"
//         options={{
//           title: "Create Blog",
//         }}
//       />

//       {/* Profile */}
//       <Drawer.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//         }}
//       />

//       {/* Notifications */}
//       <Drawer.Screen
//         name="notifications"
//         options={{
//           title: "Notifications",
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       {/* Hidden routes */}
//       <Drawer.Screen
//         name="post-detail"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       <Drawer.Screen
//         name="edit-profile"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="edit-post"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="index"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />

//       <Drawer.Screen
//         name="login"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="register"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//           headerShown: false,
//         }}
//       />

//       <Drawer.Screen
//         name="web-layout"
//         options={{
//           drawerItemStyle: {
//             display: "none",
//           },
//         }}
//       />
//     </Drawer>
//   );
// }
import { router, Stack, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import API_URL from "../api/api";
import WebLayout from "../components/web-layout";
import socket from "../socket/socket";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
};

type NotificationItem = {
  _id: string;
  isRead: boolean;
};

export default function RootLayout() {
  // =========================
  // WEB / LAPTOP
  // =========================
  if (Platform.OS === "web") {
    return (
      <WebLayout>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </WebLayout>
    );
  }

  // =========================
  // MOBILE
  // =========================
  return <MobileLayout />;
}

function MobileLayout() {
  const pathname = usePathname();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Notification unread count
  const [unreadCount, setUnreadCount] = useState(0);

  // =========================
  // CHECK LOGIN STATUS
  // =========================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const userJson = await SecureStore.getItemAsync("user");

        // No login information
        if (!token || !userJson) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Check JWT expiry
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));

          if (!payload.exp || payload.exp * 1000 <= Date.now()) {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("user");

            setUser(null);
            setUnreadCount(0);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log("Invalid token");

          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("user");

          setUser(null);
          setUnreadCount(0);
          setLoading(false);
          return;
        }

        // Get stored user
        const storedUser: AuthUser = JSON.parse(userJson);

        setUser(storedUser);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // =========================
  // SOCKET.IO CONNECTION
  // =========================
  useEffect(() => {
    if (!user) {
      socket.disconnect();
      setUnreadCount(0);
      return;
    }

    // Connect socket if it is not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Join this user's private notification room
    socket.emit("join-user", user.id);

    console.log("JOINING SOCKET ROOM:", user.id);

    // =========================
    // NEW NOTIFICATION
    // =========================
    const handleNewNotification = () => {
      console.log("NEW NOTIFICATION RECEIVED");

      setUnreadCount((current) => current + 1);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [user]);

  // =========================
  // GET NOTIFICATION COUNT
  // =========================
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (!token) {
          return;
        }

        const response = await fetch(`${API_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.log("Failed to fetch notifications:", data.message);
          return;
        }

        const notifications: NotificationItem[] =
          data.notifications || data.data || [];

        const unread = notifications.filter(
          (notification) => !notification.isRead,
        ).length;

        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to load notification count:", error);
      }
    };

    loadUnreadCount();
  }, [user, pathname]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");

      setUser(null);
      setUnreadCount(0);

      socket.disconnect();

      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);

      Alert.alert("Logout failed", "Something went wrong. Please try again.");
    }
  };

  // =========================
  // NOTIFICATION PRESS
  // =========================
  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  // =========================
  // CREATE POST PRESS
  // =========================
  const handleCreatePostPress = () => {
    router.push("/create-post");
  };

  // =========================
  // PROFILE PRESS
  // =========================
  const handleProfilePress = () => {
    router.push("/profile");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!user) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />

        {/* Private routes */}
        <Stack.Screen name="home" />
        <Stack.Screen name="create-post" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="edit-post" />
        <Stack.Screen name="post-detail" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="web-layout" />
      </Stack>
    );
  }

  // =========================
  // LOGGED IN
  // =========================
  return (
    <Drawer
      screenOptions={{
        headerShown: true,

        // =========================
        // CUSTOM MOBILE HEADER
        // =========================
        headerTitle: "Blog",

        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 15,
              gap: 18,
            }}
          >
            {/* =========================
                NOTIFICATION
            ========================= */}
            <Pressable
              onPress={handleNotificationPress}
              style={{
                position: "relative",
                padding: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                🔔
              </Text>

              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -7,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 3,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "700",
                    }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* =========================
                CREATE POST
            ========================= */}
            <Pressable
              onPress={handleCreatePostPress}
              style={{
                padding: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "400",
                }}
              >
                +
              </Text>
            </Pressable>

            {/* =========================
                PROFILE IMAGE
            ========================= */}
            <Pressable
              onPress={handleProfilePress}
              style={{
                padding: 2,
              }}
            >
              {user.profileImage ? (
                <Image
                  source={{
                    uri: user.profileImage,
                  }}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: "#ddd",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        ),
      }}
      drawerContent={(props) => (
        <View
          style={{
            flex: 1,
            paddingTop: 50,
            paddingHorizontal: 20,
          }}
        >
          {/* Drawer navigation items */}
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => router.push("/home")}
              style={{
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                Home
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/create-post")}
              style={{
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                Create Blog
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/notifications")}
              style={{
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                Notifications
              </Text>
            </Pressable>

            {/* =========================
                BOOKMARKS
            ========================= */}
            <Pressable
              onPress={() => router.push("/bookmarks")}
              style={{
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                🔖 Bookmarks
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/profile")}
              style={{
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                Profile
              </Text>
            </Pressable>
          </View>

          {/* Logout */}
          <Pressable
            onPress={handleLogout}
            style={{
              paddingVertical: 18,
              borderTopWidth: 1,
              borderTopColor: "#ddd",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
              }}
            >
              Logout
            </Text>
          </Pressable>
        </View>
      )}
    >
      {/* Home */}
      <Drawer.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />

      {/* Create Post */}
      <Drawer.Screen
        name="create-post"
        options={{
          title: "Create Blog",
        }}
      />

      {/* Profile */}
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />

      {/* Bookmarks */}
      <Drawer.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
        }}
      />

      {/* Notifications */}
      <Drawer.Screen
        name="notifications"
        options={{
          title: "Notifications",
          drawerItemStyle: {
            display: "none",
          },
        }}
      />

      {/* Hidden routes */}
      <Drawer.Screen
        name="post-detail"
        options={{
          drawerItemStyle: {
            display: "none",
          },
        }}
      />

      <Drawer.Screen
        name="edit-profile"
        options={{
          drawerItemStyle: {
            display: "none",
          },
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="edit-post"
        options={{
          drawerItemStyle: {
            display: "none",
          },
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: {
            display: "none",
          },
        }}
      />

      <Drawer.Screen
        name="login"
        options={{
          drawerItemStyle: {
            display: "none",
          },
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="register"
        options={{
          drawerItemStyle: {
            display: "none",
          },
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="web-layout"
        options={{
          drawerItemStyle: {
            display: "none",
          },
        }}
      />
    </Drawer>
  );
}
