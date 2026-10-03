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
//   RefreshControl,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import API_URL from "../api/api";
// //const API_URL = "http://YOUR_IP_ADDRESS:5000";

// type Author = {
//   _id?: string;
//   id?: string;
//   name?: string;
//   email?: string;
//   profileImage?: string;
// };

// type BookmarkPost = {
//   _id: string;
//   title: string;
//   body: string;
//   category?: string;
//   image?: string;
//   imageWidth?: number | null;
//   imageHeight?: number | null;
//   author?: Author;
//   createdAt?: string;
//   updatedAt?: string;
// };

// export default function BookmarksScreen() {
//   const [bookmarks, setBookmarks] = useState<BookmarkPost[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [removingId, setRemovingId] = useState<string | null>(null);

//   // ================================================================
//   // GET TOKEN
//   // ================================================================

//   const getToken = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("token");
//     }

//     return await SecureStore.getItemAsync("token");
//   };

//   // ================================================================
//   // FETCH BOOKMARKS
//   // ================================================================

//   const fetchBookmarks = async () => {
//     try {
//       const token = await getToken();

//       if (!token) {
//         setBookmarks([]);
//         return;
//       }

//       const response = await fetch(`${API_URL}/api/bookmarks`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error(data.message || "Failed to fetch bookmarks");
//         return;
//       }

//       setBookmarks(data.bookmarks || []);
//     } catch (error) {
//       console.error("Fetch bookmarks error:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // ================================================================
//   // FETCH WHEN SCREEN OPENS
//   // ================================================================

//   useFocusEffect(
//     useCallback(() => {
//       fetchBookmarks();
//     }, []),
//   );

//   // ================================================================
//   // REFRESH
//   // ================================================================

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchBookmarks();
//   };

//   // ================================================================
//   // OPEN POST DETAIL
//   // ================================================================

//   // const handlePostPress = (postId: string) => {
//   //   router.push({
//   //     pathname: "/post-detail",
//   //     params: {
//   //       id: postId,
//   //     },
//   //   });
//   // };
//   const handlePostPress = (postId: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id: postId,
//       },
//     });
//   };
//   // ================================================================
//   // REMOVE BOOKMARK
//   // ================================================================

//   const handleRemoveBookmark = async (postId: string) => {
//     if (removingId === postId) {
//       return;
//     }

//     try {
//       const token = await getToken();

//       if (!token) {
//         return;
//       }

//       setRemovingId(postId);

//       const response = await fetch(`${API_URL}/api/bookmarks/${postId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         if (Platform.OS === "web") {
//           window.alert(data.message || "Failed to remove bookmark");
//         } else {
//           Alert.alert("Error", data.message || "Failed to remove bookmark");
//         }

//         return;
//       }

//       setBookmarks((previous) =>
//         previous.filter((post) => post._id !== postId),
//       );
//     } catch (error) {
//       console.error("Remove bookmark error:", error);

//       if (Platform.OS !== "web") {
//         Alert.alert("Error", "Failed to remove bookmark");
//       }
//     } finally {
//       setRemovingId(null);
//     }
//   };

//   // ================================================================
//   // CONFIRM REMOVE
//   // ================================================================

//   const confirmRemove = (postId: string) => {
//     if (Platform.OS === "web") {
//       const confirmed = window.confirm("Remove this post from bookmarks?");

//       if (confirmed) {
//         handleRemoveBookmark(postId);
//       }

//       return;
//     }

//     Alert.alert("Remove Bookmark", "Remove this post from your bookmarks?", [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Remove",
//         style: "destructive",
//         onPress: () => handleRemoveBookmark(postId),
//       },
//     ]);
//   };

//   // ================================================================
//   // FORMAT DATE
//   // ================================================================

//   const formatDate = (date?: string) => {
//     if (!date) {
//       return "";
//     }

//     return new Date(date).toLocaleDateString();
//   };

//   // ================================================================
//   // GET AUTHOR NAME
//   // ================================================================

//   const getAuthorName = (author?: Author) => {
//     if (!author) {
//       return "Unknown author";
//     }

//     return author.name || author.email || "Unknown author";
//   };

//   // ================================================================
//   // GET READING TIME
//   // ================================================================

//   const getReadingTime = (body: string) => {
//     const words = body.trim().split(/\s+/).length;
//     const minutes = Math.max(1, Math.ceil(words / 200));

//     return `${minutes} min read`;
//   };

//   // ================================================================
//   // POST CARD
//   // ================================================================

//   const renderPost = ({ item }: { item: BookmarkPost }) => {
//     return (
//       <View style={styles.card}>
//         <Pressable
//           onPress={() => handlePostPress(item._id)}
//           style={({ pressed }) => [
//             styles.cardContent,
//             pressed && styles.pressed,
//           ]}
//         >
//           {item.image ? (
//             <Image
//               source={{ uri: item.image }}
//               style={[
//                 styles.postImage,
//                 item.imageWidth && item.imageHeight
//                   ? {
//                       aspectRatio: item.imageWidth / item.imageHeight,
//                     }
//                   : null,
//               ]}
//               resizeMode="cover"
//             />
//           ) : null}

//           <View style={styles.textContainer}>
//             {item.category ? (
//               <View style={styles.categoryBadge}>
//                 <Text style={styles.categoryText}>{item.category}</Text>
//               </View>
//             ) : null}

//             <Text style={styles.title} numberOfLines={2}>
//               {item.title}
//             </Text>

//             <Text style={styles.body} numberOfLines={3}>
//               {item.body}
//             </Text>

//             <View style={styles.metaRow}>
//               <Text style={styles.author}>{getAuthorName(item.author)}</Text>

//               <Text style={styles.dot}>•</Text>

//               <Text style={styles.meta}>{getReadingTime(item.body)}</Text>

//               {item.createdAt ? (
//                 <>
//                   <Text style={styles.dot}>•</Text>

//                   <Text style={styles.meta}>{formatDate(item.createdAt)}</Text>
//                 </>
//               ) : null}
//             </View>
//           </View>
//         </Pressable>

//         <View style={styles.actionRow}>
//           <Pressable
//             onPress={() => handlePostPress(item._id)}
//             style={({ pressed }) => [
//               styles.readButton,
//               pressed && styles.pressed,
//             ]}
//           >
//             <Text style={styles.readButtonText}>Read Full Post</Text>
//           </Pressable>

//           <Pressable
//             onPress={() => confirmRemove(item._id)}
//             disabled={removingId === item._id}
//             style={({ pressed }) => [
//               styles.removeButton,
//               pressed && styles.pressed,
//               removingId === item._id && styles.disabledButton,
//             ]}
//           >
//             {removingId === item._id ? (
//               <ActivityIndicator size="small" />
//             ) : (
//               <Text style={styles.removeButtonText}>🔖 Remove</Text>
//             )}
//           </Pressable>
//         </View>
//       </View>
//     );
//   };

//   // ================================================================
//   // LOADING
//   // ================================================================

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#00695c" />

//         <Text style={styles.loadingText}>Loading bookmarks...</Text>
//       </View>
//     );
//   }

//   // ================================================================
//   // MAIN SCREEN
//   // ================================================================

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}

//       <View style={styles.header}>
//         <Pressable
//           onPress={() => router.back()}
//           style={({ pressed }) => [
//             styles.backButton,
//             pressed && styles.pressed,
//           ]}
//         >
//           <Text style={styles.backText}>‹</Text>
//         </Pressable>

//         <View style={styles.headerTextContainer}>
//           <Text style={styles.headerTitle}>Bookmarked Posts</Text>

//           <Text style={styles.headerSubtitle}>
//             {bookmarks.length} saved {bookmarks.length === 1 ? "post" : "posts"}
//           </Text>
//         </View>
//       </View>

//       {/* EMPTY STATE */}

//       {bookmarks.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyIcon}>🔖</Text>

//           <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>

//           <Text style={styles.emptyText}>
//             Posts you bookmark will appear here.
//           </Text>

//           <Pressable
//             onPress={() => router.push("/home")}
//             style={({ pressed }) => [
//               styles.homeButton,
//               pressed && styles.pressed,
//             ]}
//           >
//             <Text style={styles.homeButtonText}>Browse Posts</Text>
//           </Pressable>
//         </View>
//       ) : (
//         <FlatList
//           data={bookmarks}
//           keyExtractor={(item) => item._id}
//           renderItem={renderPost}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//           }
//         />
//       )}
//     </View>
//   );
// }

// // ================================================================
// // STYLES
// // ================================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f7faf9",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === "ios" ? 58 : 24,
//     paddingBottom: 18,
//     backgroundColor: "#ffffff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },

//   backButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#eef6f4",
//     marginRight: 12,
//   },

//   backText: {
//     fontSize: 34,
//     lineHeight: 36,
//     color: "#00695c",
//     marginTop: -4,
//   },

//   headerTextContainer: {
//     flex: 1,
//   },

//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#173b36",
//   },

//   headerSubtitle: {
//     marginTop: 3,
//     fontSize: 13,
//     color: "#71807d",
//   },

//   listContent: {
//     padding: 16,
//     paddingBottom: 30,
//   },

//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: 18,
//     marginBottom: 16,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#e5ebe9",
//   },

//   cardContent: {
//     backgroundColor: "#ffffff",
//   },

//   postImage: {
//     width: "100%",
//     height: 210,
//     backgroundColor: "#e8eeee",
//   },

//   textContainer: {
//     padding: 16,
//   },

//   categoryBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 20,
//     backgroundColor: "#e0f2ef",
//     marginBottom: 10,
//   },

//   categoryText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#00695c",
//   },

//   title: {
//     fontSize: 20,
//     lineHeight: 27,
//     fontWeight: "800",
//     color: "#173b36",
//   },

//   body: {
//     marginTop: 8,
//     fontSize: 14,
//     lineHeight: 21,
//     color: "#5d6966",
//   },

//   metaRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexWrap: "wrap",
//     marginTop: 13,
//   },

//   author: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#00695c",
//   },

//   dot: {
//     marginHorizontal: 6,
//     fontSize: 12,
//     color: "#9aa5a2",
//   },

//   meta: {
//     fontSize: 12,
//     color: "#7b8582",
//   },

//   actionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },

//   readButton: {
//     flex: 1,
//     minHeight: 42,
//     borderRadius: 12,
//     backgroundColor: "#00695c",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 12,
//   },

//   readButtonText: {
//     color: "#ffffff",
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   removeButton: {
//     minHeight: 42,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#f1f5f4",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   removeButtonText: {
//     color: "#00695c",
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   disabledButton: {
//     opacity: 0.6,
//   },

//   loadingContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f7faf9",
//   },

//   loadingText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#687572",
//   },

//   emptyContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 30,
//   },

//   emptyIcon: {
//     fontSize: 48,
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#173b36",
//   },

//   emptyText: {
//     marginTop: 8,
//     fontSize: 14,
//     lineHeight: 21,
//     textAlign: "center",
//     color: "#71807d",
//   },

//   homeButton: {
//     marginTop: 22,
//     paddingHorizontal: 22,
//     paddingVertical: 12,
//     borderRadius: 12,
//     backgroundColor: "#00695c",
//   },

//   homeButtonText: {
//     color: "#ffffff",
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   pressed: {
//     opacity: 0.75,
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
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import API_URL from "../api/api";

type Author = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
};

type BookmarkPost = {
  _id: string;
  title: string;
  body: string;
  category?: string;
  image?: string;
  imageWidth?: number | null;
  imageHeight?: number | null;
  author?: Author;
  createdAt?: string;
  updatedAt?: string;
};

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<BookmarkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // ================================================================
  // GET TOKEN
  // ================================================================
  const getToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    }
    return await SecureStore.getItemAsync("token");
  };

  // ================================================================
  // FETCH BOOKMARKS
  // ================================================================
  const fetchBookmarks = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setBookmarks([]);
        return;
      }

      const response = await fetch(`${API_URL}/api/bookmarks`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch bookmarks");
        return;
      }

      setBookmarks(data.bookmarks || []);
    } catch (error) {
      console.error("Fetch bookmarks error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ================================================================
  // FETCH WHEN SCREEN OPENS
  // ================================================================
  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, []),
  );

  // ================================================================
  // REFRESH
  // ================================================================
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookmarks();
  };

  // ================================================================
  // OPEN POST DETAIL
  // ================================================================
  const handlePostPress = (postId: string) => {
    router.push({
      pathname: "/post-detail",
      params: { id: postId },
    });
  };

  // ================================================================
  // REMOVE BOOKMARK
  // ================================================================
  const handleRemoveBookmark = async (postId: string) => {
    if (removingId === postId) return;

    try {
      const token = await getToken();
      if (!token) return;

      setRemovingId(postId);

      const response = await fetch(`${API_URL}/api/bookmarks/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        if (Platform.OS === "web") {
          window.alert(data.message || "Failed to remove bookmark");
        } else {
          Alert.alert("Error", data.message || "Failed to remove bookmark");
        }
        return;
      }

      setBookmarks((previous) =>
        previous.filter((post) => post._id !== postId),
      );
    } catch (error) {
      console.error("Remove bookmark error:", error);
      if (Platform.OS !== "web") {
        Alert.alert("Error", "Failed to remove bookmark");
      }
    } finally {
      setRemovingId(null);
    }
  };

  // ================================================================
  // CONFIRM REMOVE
  // ================================================================
  const confirmRemove = (postId: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Remove this post from bookmarks?");
      if (confirmed) {
        handleRemoveBookmark(postId);
      }
      return;
    }

    Alert.alert("Remove Bookmark", "Remove this post from your bookmarks?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => handleRemoveBookmark(postId),
      },
    ]);
  };

  // ================================================================
  // HELPERS
  // ================================================================
  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const getAuthorName = (author?: Author) => {
    if (!author) return "Unknown author";
    return author.name || author.email || "Unknown author";
  };

  const getReadingTime = (body: string) => {
    const words = body.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  // ================================================================
  // POST CARD
  // ================================================================
  const renderPost = ({ item }: { item: BookmarkPost }) => {
    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => handlePostPress(item._id)}
          style={({ pressed }) => [
            styles.cardContent,
            pressed && styles.pressed,
          ]}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={[
                styles.postImage,
                item.imageWidth && item.imageHeight
                  ? { aspectRatio: item.imageWidth / item.imageHeight }
                  : null,
              ]}
              resizeMode="cover"
            />
          ) : null}

          <View style={styles.textContainer}>
            {item.category ? (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            ) : null}

            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.body} numberOfLines={3}>
              {item.body}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.author}>{getAuthorName(item.author)}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.meta}>{getReadingTime(item.body)}</Text>
              {item.createdAt ? (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.meta}>{formatDate(item.createdAt)}</Text>
                </>
              ) : null}
            </View>
          </View>
        </Pressable>

        <View style={styles.actionRow}>
          <Pressable
            onPress={() => handlePostPress(item._id)}
            style={({ pressed }) => [
              styles.readButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.readButtonText}>Read Full Post</Text>
          </Pressable>

          <Pressable
            onPress={() => confirmRemove(item._id)}
            disabled={removingId === item._id}
            style={({ pressed }) => [
              styles.removeButton,
              pressed && styles.pressed,
              removingId === item._id && styles.disabledButton,
            ]}
          >
            {removingId === item._id ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <Text style={styles.removeButtonText}>🔖 Remove</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  // ================================================================
  // LOADING
  // ================================================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f172a" />
        <Text style={styles.loadingText}>Loading bookmarks...</Text>
      </View>
    );
  }

  // ================================================================
  // MAIN SCREEN
  // ================================================================
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Bookmarks</Text>
          <Text style={styles.headerSubtitle}>
            {bookmarks.length} saved {bookmarks.length === 1 ? "post" : "posts"}
          </Text>
        </View>
      </View>

      {/* EMPTY STATE */}
      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Text style={styles.emptyIcon}>🔖</Text>
          </View>
          <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
          <Text style={styles.emptyText}>
            Posts you bookmark will appear here for easy access.
          </Text>
          <Pressable
            onPress={() => router.push("/home")}
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.homeButtonText}>Browse Posts</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item._id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0f172a"
            />
          }
        />
      )}
    </View>
  );
}

// ================================================================
// STYLES
// ================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Slate 50
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 32,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  backText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: -2,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },

  // List
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  cardContent: {
    backgroundColor: "#ffffff",
  },
  postImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#f1f5f9",
  },
  textContainer: {
    padding: 22,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#0f172a", // High contrast dark badge
    marginBottom: 14,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  body: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 18,
    gap: 6,
  },
  author: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
  dot: {
    fontSize: 13,
    color: "#cbd5e1",
  },
  meta: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },

  // Actions
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  readButton: {
    // flex: 1,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    width: 200,
  },
  readButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  removeButton: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  removeButtonText: {
    color: "#ef4444", // Red accent for destructive action
    fontSize: 14,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#64748b",
    fontWeight: "600",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
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
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#64748b",
    fontWeight: "500",
  },
  homeButton: {
    marginTop: 28,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#0f172a",
  },
  homeButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  // Interactions
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }], // Tactile press effect
  },
});
