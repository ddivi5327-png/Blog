// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// import API_URL from "../api/api";
// import socket from "../socket/socket";

// const PAGE_SIZE = 6;

// type Author = {
//   _id: string;
//   name: string;
//   email: string;
//   profileImage?: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   image: string;
//   imageWidth?: number;
//   imageHeight?: number;
//   category?: string;
//   tags?: string[];
//   author: Author;
//   createdAt: string;
//   updatedAt: string;
//   commentCount: number;
// };

// type LikeInfo = {
//   likeCount: number;
//   liked: boolean;
// };

// function getReadingTime(body: string) {
//   const words = body.trim().split(/\s+/).filter(Boolean).length;
//   const minutes = Math.max(1, Math.ceil(words / 200));

//   return `${minutes} min read`;
// }

// function formatDate(value: string) {
//   return new Date(value).toLocaleDateString(undefined, {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// function Avatar({
//   name,
//   profileImage,
//   size = 40,
// }: {
//   name?: string;
//   profileImage?: string;
//   size?: number;
// }) {
//   if (profileImage) {
//     return (
//       <Image
//         source={{ uri: profileImage }}
//         style={{
//           width: size,
//           height: size,
//           borderRadius: size / 2,
//           backgroundColor: "#f1f5f9",
//           borderWidth: 1,
//           borderColor: "#e2e8f0",
//         }}
//       />
//     );
//   }

//   return (
//     <View
//       style={[
//         styles.avatar,
//         {
//           width: size,
//           height: size,
//           borderRadius: size / 2,
//         },
//       ]}
//     >
//       <Text
//         style={[
//           styles.avatarInitial,
//           {
//             fontSize: size * 0.42,
//           },
//         ]}
//       >
//         {name?.charAt(0)?.toUpperCase() || "U"}
//       </Text>
//     </View>
//   );
// }

// function TagRow({ tags }: { tags?: string[] }) {
//   if (!tags || tags.length === 0) {
//     return null;
//   }

//   return (
//     <View style={styles.tagRow}>
//       {tags.slice(0, 3).map((tag) => (
//         <View key={tag} style={styles.tagChip}>
//           <Text style={styles.tagChipText}>#{tag}</Text>
//         </View>
//       ))}
//     </View>
//   );
// }

// type ActionsProps = {
//   post: Post;
//   likeInfo: LikeInfo;
//   likeLoading: boolean;
//   onCommentsPress: (id: string) => void;
//   onLikePress: (id: string) => void;
//   onBookmarkPress: (id: string) => void;
//   isBookmarked: boolean;
//   bookmarkLoading: boolean;
// };

// function PostActions({
//   post,
//   likeInfo,
//   likeLoading,
//   onCommentsPress,
//   onLikePress,
//   onBookmarkPress,
//   isBookmarked,
//   bookmarkLoading,
// }: ActionsProps) {
//   return (
//     <View style={styles.actionRow}>
//       {/* Like */}
//       <Pressable
//         style={({ pressed }) => [
//           styles.actionButton,
//           likeInfo.liked && styles.actionButtonLiked,
//           pressed && styles.pressed,
//         ]}
//         onPress={() => onLikePress(post._id)}
//         disabled={likeLoading}
//       >
//         <Text
//           style={[styles.actionIcon, likeInfo.liked && styles.actionIconLiked]}
//         >
//           {likeInfo.liked ? "♥" : "♡"}
//         </Text>

//         <Text
//           style={[styles.actionText, likeInfo.liked && styles.actionTextLiked]}
//         >
//           {likeInfo.likeCount}
//         </Text>
//       </Pressable>

//       {/* Comments */}
//       <Pressable
//         style={({ pressed }) => [
//           styles.actionButton,
//           pressed && styles.pressed,
//         ]}
//         onPress={() => onCommentsPress(post._id)}
//       >
//         <Text style={styles.actionIcon}>💬</Text>
//         <Text style={styles.actionText}>{post.commentCount || 0}</Text>
//       </Pressable>

//       {/* Bookmark */}
//       <Pressable
//         style={({ pressed }) => [
//           styles.actionButton,
//           isBookmarked && styles.actionButtonBookmarked,
//           pressed && styles.pressed,
//         ]}
//         onPress={() => onBookmarkPress(post._id)}
//         disabled={bookmarkLoading}
//       >
//         <Text
//           style={[
//             styles.actionIcon,
//             isBookmarked && styles.actionIconBookmarked,
//           ]}
//         >
//           {isBookmarked ? "🔖" : "📑"}
//         </Text>

//         <Text
//           style={[
//             styles.actionText,
//             isBookmarked && styles.actionTextBookmarked,
//           ]}
//         >
//           {isBookmarked ? "Saved" : "Save"}
//         </Text>
//       </Pressable>

//       <View style={styles.flexSpacer} />

//       <Text style={styles.readingTime}>{getReadingTime(post.body)}</Text>
//     </View>
//   );
// }

// type CardProps = {
//   item: Post;
//   likeInfo: LikeInfo;
//   likeLoading: boolean;
//   onPostPress: (id: string) => void;
//   onCommentsPress: (id: string) => void;
//   onLikePress: (id: string) => void;
//   onBookmarkPress: (id: string) => void;
//   isBookmarked: boolean;
//   bookmarkLoading: boolean;
// };

// function FeaturedCard({
//   item,
//   likeInfo,
//   likeLoading,
//   onPostPress,
//   onCommentsPress,
//   onLikePress,
//   onBookmarkPress,
//   isBookmarked,
//   bookmarkLoading,
// }: CardProps) {
//   const imageRatio =
//     item.imageWidth && item.imageHeight
//       ? item.imageWidth / item.imageHeight
//       : 16 / 9;

//   return (
//     <View style={styles.featuredCard}>
//       {item.image ? (
//         <Pressable
//           onPress={() => onPostPress(item._id)}
//           style={styles.featuredImageWrap}
//         >
//           <Image
//             source={{ uri: item.image }}
//             style={[
//               styles.featuredImage,
//               {
//                 aspectRatio: imageRatio,
//               },
//             ]}
//           />

//           <View style={styles.featuredBadgeWrap}>
//             <View style={styles.featuredBadge}>
//               <Text style={styles.featuredBadgeText}>⭐ LATEST STORY</Text>
//             </View>
//           </View>
//         </Pressable>
//       ) : null}

//       <View style={styles.featuredContent}>
//         <Pressable onPress={() => onPostPress(item._id)}>
//           <Text style={styles.featuredTitle} numberOfLines={3}>
//             {item.title}
//           </Text>

//           <Text style={styles.featuredBody} numberOfLines={3}>
//             {item.body}
//           </Text>
//         </Pressable>

//         <TagRow tags={item.tags} />

//         <View style={styles.metaRow}>
//           <Avatar
//             name={item.author?.name}
//             profileImage={item.author?.profileImage}
//             size={42}
//           />

//           <View style={styles.metaText}>
//             <Text style={styles.authorName}>
//               {item.author?.name || "Unknown"}
//             </Text>

//             <Text style={styles.metaDate}>{formatDate(item.createdAt)}</Text>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         <PostActions
//           post={item}
//           likeInfo={likeInfo}
//           likeLoading={likeLoading}
//           onCommentsPress={onCommentsPress}
//           onLikePress={onLikePress}
//           onBookmarkPress={onBookmarkPress}
//           isBookmarked={isBookmarked}
//           bookmarkLoading={bookmarkLoading}
//         />
//       </View>
//     </View>
//   );
// }

// function PostCard({
//   item,
//   likeInfo,
//   likeLoading,
//   onPostPress,
//   onCommentsPress,
//   onLikePress,
//   onBookmarkPress,
//   isBookmarked,
//   bookmarkLoading,
// }: CardProps) {
//   return (
//     <View style={styles.card}>
//       <Pressable style={styles.cardTop} onPress={() => onPostPress(item._id)}>
//         <View style={styles.cardTextCol}>
//           <View style={styles.metaRowTight}>
//             <Avatar
//               name={item.author?.name}
//               profileImage={item.author?.profileImage}
//               size={28}
//             />

//             <Text style={styles.metaLine} numberOfLines={1}>
//               {item.author?.name || "Unknown"} · {formatDate(item.createdAt)}
//             </Text>
//           </View>

//           <Text style={styles.title} numberOfLines={2}>
//             {item.title}
//           </Text>

//           <Text style={styles.body} numberOfLines={2}>
//             {item.body}
//           </Text>
//         </View>

//         {item.image ? (
//           <Image source={{ uri: item.image }} style={styles.thumbnail} />
//         ) : null}
//       </Pressable>

//       <TagRow tags={item.tags} />

//       <PostActions
//         post={item}
//         likeInfo={likeInfo}
//         likeLoading={likeLoading}
//         onCommentsPress={onCommentsPress}
//         onLikePress={onLikePress}
//         onBookmarkPress={onBookmarkPress}
//         isBookmarked={isBookmarked}
//         bookmarkLoading={bookmarkLoading}
//       />
//     </View>
//   );
// }

// function SkeletonCard() {
//   return (
//     <View style={styles.card}>
//       <View style={styles.cardTop}>
//         <View style={styles.cardTextCol}>
//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "45%",
//                 height: 12,
//                 marginBottom: 16,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "90%",
//                 height: 20,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "70%",
//                 height: 20,
//                 marginBottom: 12,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "100%",
//                 height: 14,
//               },
//             ]}
//           />
//         </View>

//         <View style={styles.skelThumb} />
//       </View>

//       <View
//         style={[
//           styles.skelLine,
//           {
//             width: "30%",
//             height: 14,
//             marginTop: 20,
//           },
//         ]}
//       />
//     </View>
//   );
// }

// export default function HomeScreen() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [likeInfo, setLikeInfo] = useState<Record<string, LikeInfo>>({});

//   const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});

//   const [bookmarkedPosts, setBookmarkedPosts] = useState<
//     Record<string, boolean>
//   >({});

//   const [bookmarkLoading, setBookmarkLoading] = useState<
//     Record<string, boolean>
//   >({});

//   const [search, setSearch] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");

//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

//   const getToken = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("token");
//     }

//     return await SecureStore.getItemAsync("token");
//   };

//   /*
//    * REAL-TIME LIKE UPDATES
//    */

//   useEffect(() => {
//     const handleLikeUpdated = (data: { postId: string; likeCount: number }) => {
//       if (!data?.postId) return;

//       console.log("HOME LIKE UPDATED:", data);

//       setLikeInfo((previous) => ({
//         ...previous,
//         [data.postId]: {
//           ...(previous[data.postId] || {
//             likeCount: 0,
//             liked: false,
//           }),
//           likeCount: Number(data.likeCount || 0),
//         },
//       }));
//     };

//     socket.on("like-updated", handleLikeUpdated);

//     return () => {
//       socket.off("like-updated", handleLikeUpdated);
//     };
//   }, []);

//   /*
//    * REAL-TIME NEW POST
//    */

//   useEffect(() => {
//     const handleNewPost = (newPost: Post) => {
//       if (!newPost?._id) return;

//       console.log("HOME NEW POST:", newPost);

//       setPosts((previousPosts) => {
//         const alreadyExists = previousPosts.some(
//           (post) => post._id === newPost._id,
//         );

//         if (alreadyExists) {
//           return previousPosts;
//         }

//         return [newPost, ...previousPosts];
//       });

//       setLikeInfo((previous) => ({
//         ...previous,
//         [newPost._id]: {
//           likeCount: 0,
//           liked: false,
//         },
//       }));
//     };

//     socket.on("new-post", handleNewPost);

//     return () => {
//       socket.off("new-post", handleNewPost);
//     };
//   }, []);

//   /*
//    * REAL-TIME POST UPDATE
//    *
//    * Backend sends:
//    *
//    * {
//    *   post data,
//    *   commentCount
//    * }
//    *
//    * We replace the old post with
//    * the updated post.
//    */

//   useEffect(() => {
//     const handlePostUpdated = (updatedPost: Post) => {
//       if (!updatedPost?._id) return;

//       console.log("HOME POST UPDATED:", updatedPost);

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           post._id === updatedPost._id ? updatedPost : post,
//         ),
//       );
//     };

//     socket.on("post-updated", handlePostUpdated);

//     return () => {
//       socket.off("post-updated", handlePostUpdated);
//     };
//   }, []);

//   /*
//    * REAL-TIME POST DELETE
//    *
//    * Backend sends:
//    *
//    * {
//    *   postId
//    * }
//    *
//    * Remove that post from Home.
//    */

//   useEffect(() => {
//     const handlePostDeleted = (data: { postId: string }) => {
//       if (!data?.postId) return;

//       console.log("HOME POST DELETED:", data);

//       setPosts((previousPosts) =>
//         previousPosts.filter((post) => post._id !== data.postId),
//       );

//       /*
//        * Remove old like information.
//        */

//       setLikeInfo((previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[data.postId];

//         return updated;
//       });

//       /*
//        * Remove bookmark information.
//        */

//       setBookmarkedPosts((previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[data.postId];

//         return updated;
//       });

//       /*
//        * Remove loading states.
//        */

//       setLikeLoading((previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[data.postId];

//         return updated;
//       });

//       setBookmarkLoading((previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[data.postId];

//         return updated;
//       });
//     };

//     socket.on("post-deleted", handlePostDeleted);

//     return () => {
//       socket.off("post-deleted", handlePostDeleted);
//     };
//   }, []);

//   /*
//    * JOIN POST ROOMS
//    */

//   useEffect(() => {
//     if (!posts.length) return;

//     const joinPostRooms = () => {
//       posts.forEach((post) => {
//         if (post?._id) {
//           socket.emit("join-post", post._id);

//           console.log("HOME JOINED POST ROOM:", post._id);
//         }
//       });
//     };

//     if (!socket.connected) {
//       socket.connect();
//     }

//     if (socket.connected) {
//       joinPostRooms();
//     }

//     socket.on("connect", joinPostRooms);

//     return () => {
//       socket.off("connect", joinPostRooms);

//       posts.forEach((post) => {
//         if (post?._id) {
//           socket.emit("leave-post", post._id);
//         }
//       });
//     };
//   }, [posts]);

//   /*
//    * GET LIKE INFORMATION
//    */

//   const fetchLikeInfo = async (postList: Post[]) => {
//     const token = await getToken();

//     if (!token) {
//       setLikeInfo((previous) => {
//         const updated = {
//           ...previous,
//         };

//         postList.forEach((post) => {
//           if (!updated[post._id]) {
//             updated[post._id] = {
//               likeCount: 0,
//               liked: false,
//             };
//           }
//         });

//         return updated;
//       });

//       return;
//     }

//     const results = await Promise.all(
//       postList.map(async (post) => {
//         try {
//           const response = await fetch(`${API_URL}/api/likes/${post._id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           const data = await response.json();

//           if (response.ok) {
//             return {
//               postId: post._id,
//               likeCount: data.likeCount || 0,
//               liked: data.liked || false,
//             };
//           }

//           return {
//             postId: post._id,
//             likeCount: 0,
//             liked: false,
//           };
//         } catch (error) {
//           return {
//             postId: post._id,
//             likeCount: 0,
//             liked: false,
//           };
//         }
//       }),
//     );

//     const updatedLikeInfo: Record<string, LikeInfo> = {};

//     results.forEach((result) => {
//       updatedLikeInfo[result.postId] = {
//         likeCount: result.likeCount,
//         liked: result.liked,
//       };
//     });

//     setLikeInfo(updatedLikeInfo);
//   };

//   /*
//    * GET BOOKMARKS
//    */

//   const fetchBookmarks = async () => {
//     const token = await getToken();

//     if (!token) {
//       setBookmarkedPosts({});
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/bookmarks`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const bookmarkMap: Record<string, boolean> = {};

//         const bookmarkList = data.bookmarks || [];

//         bookmarkList.forEach((post: Post) => {
//           if (post?._id) {
//             bookmarkMap[post._id] = true;
//           }
//         });

//         setBookmarkedPosts(bookmarkMap);
//       } else {
//         console.error(data.message || "Failed to fetch bookmarks");
//       }
//     } catch (error) {
//       console.error("Fetch bookmarks error:", error);
//     }
//   };

//   /*
//    * GET POSTS
//    */

//   const fetchPosts = async () => {
//     try {
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);

//       const data = await response.json();

//       if (response.ok) {
//         const postList = data.posts || [];

//         setPosts(postList);

//         await fetchLikeInfo(postList);

//         await fetchBookmarks();
//       } else {
//         setError(data.message || "Failed to load posts");
//       }
//     } catch (error) {
//       setError("Unable to connect to server");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchPosts();
//     }, []),
//   );

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchPosts();
//   }, []);

//   const handlePostPress = (id: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id,
//       },
//     });
//   };

//   const handleCommentsPress = (id: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id,
//       },
//     });
//   };

//   /*
//    * LIKE POST
//    */

//   const handleLikePress = async (postId: string) => {
//     if (likeLoading[postId]) {
//       return;
//     }

//     const token = await getToken();

//     if (!token) {
//       if (Platform.OS === "web") {
//         window.alert("Please login to like posts");
//       } else {
//         console.log("Please login to like posts");
//       }

//       return;
//     }

//     setLikeLoading((previous) => ({
//       ...previous,
//       [postId]: true,
//     }));

//     try {
//       const response = await fetch(`${API_URL}/api/likes/${postId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setLikeInfo((previous) => ({
//           ...previous,
//           [postId]: {
//             likeCount: data.likeCount || 0,
//             liked: data.liked || false,
//           },
//         }));
//       } else {
//         if (Platform.OS === "web") {
//           window.alert(data.message || "Failed to update like");
//         } else {
//           console.error(data.message || "Failed to update like");
//         }
//       }
//     } catch (error) {
//       console.error("Like error:", error);
//     } finally {
//       setLikeLoading((previous) => ({
//         ...previous,
//         [postId]: false,
//       }));
//     }
//   };

//   /*
//    * BOOKMARK
//    */

//   const handleBookmarkPress = async (postId: string) => {
//     if (bookmarkLoading[postId]) {
//       return;
//     }

//     const token = await getToken();

//     if (!token) {
//       if (Platform.OS === "web") {
//         window.alert("Please login to bookmark posts");
//       } else {
//         console.log("Please login to bookmark posts");
//       }

//       return;
//     }

//     const isBookmarked = !!bookmarkedPosts[postId];

//     setBookmarkLoading((previous) => ({
//       ...previous,
//       [postId]: true,
//     }));

//     try {
//       const response = await fetch(`${API_URL}/api/bookmarks/${postId}`, {
//         method: isBookmarked ? "DELETE" : "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setBookmarkedPosts((previous) => ({
//           ...previous,
//           [postId]: !isBookmarked,
//         }));
//       } else {
//         if (Platform.OS === "web") {
//           window.alert(data.message || "Failed to update bookmark");
//         } else {
//           console.error(data.message || "Failed to update bookmark");
//         }
//       }
//     } catch (error) {
//       console.error("Bookmark error:", error);
//     } finally {
//       setBookmarkLoading((previous) => ({
//         ...previous,
//         [postId]: false,
//       }));
//     }
//   };

//   /*
//    * CATEGORIES
//    */

//   const categories = useMemo(() => {
//     const categorySet = new Set<string>();

//     posts.forEach((post) => {
//       if (post.category?.trim()) {
//         categorySet.add(post.category.trim());
//       }
//     });

//     return ["All", ...Array.from(categorySet)];
//   }, [posts]);

//   /*
//    * SEARCH + CATEGORY FILTER
//    */

//   const filteredPosts = useMemo(() => {
//     const term = search.trim().toLowerCase();

//     return posts.filter((post) => {
//       const matchesCategory =
//         activeCategory === "All" ||
//         post.category?.toLowerCase() === activeCategory.toLowerCase();

//       if (!matchesCategory) {
//         return false;
//       }

//       if (!term) {
//         return true;
//       }

//       return (
//         post.title.toLowerCase().includes(term) ||
//         post.body.toLowerCase().includes(term) ||
//         (post.author?.name || "").toLowerCase().includes(term) ||
//         (post.category || "").toLowerCase().includes(term)
//       );
//     });
//   }, [posts, search, activeCategory]);

//   const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;

//   const listPosts = useMemo(
//     () => filteredPosts.slice(1, visibleCount + 1),
//     [filteredPosts, visibleCount],
//   );

//   const getLikeInfo = (id: string) =>
//     likeInfo[id] || {
//       likeCount: 0,
//       liked: false,
//     };

//   const handleEndReached = () => {
//     if (visibleCount < filteredPosts.length - 1) {
//       setVisibleCount((previous) => previous + PAGE_SIZE);
//     }
//   };

//   const renderPost = ({ item }: { item: Post }) => (
//     <PostCard
//       item={item}
//       likeInfo={getLikeInfo(item._id)}
//       likeLoading={!!likeLoading[item._id]}
//       onPostPress={handlePostPress}
//       onCommentsPress={handleCommentsPress}
//       onLikePress={handleLikePress}
//       onBookmarkPress={handleBookmarkPress}
//       isBookmarked={!!bookmarkedPosts[item._id]}
//       bookmarkLoading={!!bookmarkLoading[item._id]}
//     />
//   );

//   const header = (
//     <View style={styles.headerWrap}>
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.brand}>Blog Posts</Text>

//           <Text style={styles.tagline}>
//             {posts.length} {posts.length === 1 ? "story" : "stories"} to explore
//           </Text>
//         </View>
//       </View>

//       <View style={styles.searchBox}>
//         <Text style={styles.searchIcon}>🔍</Text>

//         <TextInput
//           value={search}
//           onChangeText={(text) => {
//             setSearch(text);
//             setVisibleCount(PAGE_SIZE);
//           }}
//           placeholder="Search posts, authors..."
//           placeholderTextColor="#94a3b8"
//           style={styles.searchInput}
//           returnKeyType="search"
//         />

//         {search.length > 0 && (
//           <Pressable onPress={() => setSearch("")} hitSlop={10}>
//             <Text style={styles.clearIcon}>✕</Text>
//           </Pressable>
//         )}
//       </View>

//       {categories.length > 1 && (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterRow}
//         >
//           {categories.map((category) => {
//             const active = category === activeCategory;

//             return (
//               <Pressable
//                 key={category}
//                 onPress={() => {
//                   setActiveCategory(category);
//                   setVisibleCount(PAGE_SIZE);
//                 }}
//                 style={[styles.filterChip, active && styles.filterChipActive]}
//               >
//                 <Text
//                   style={[
//                     styles.filterChipText,
//                     active && styles.filterChipTextActive,
//                   ]}
//                 >
//                   {category}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </ScrollView>
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.screen}>
//         <View style={styles.contentWrap}>
//           {header}

//           <SkeletonCard />
//           <SkeletonCard />
//           <SkeletonCard />
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <View style={styles.contentWrap}>
//         {header}

//         {error !== "" && (
//           <View style={styles.errorBox}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}

//         <FlatList
//           data={listPosts}
//           keyExtractor={(item) => item._id}
//           renderItem={renderPost}
//           showsVerticalScrollIndicator={false}
//           onEndReached={handleEndReached}
//           onEndReachedThreshold={0.5}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//               tintColor="#0f172a"
//               colors={["#0f172a"]}
//             />
//           }
//           contentContainerStyle={
//             filteredPosts.length === 0
//               ? styles.emptyContainer
//               : styles.listContainer
//           }
//           ListHeaderComponent={
//             featuredPost ? (
//               <FeaturedCard
//                 item={featuredPost}
//                 likeInfo={getLikeInfo(featuredPost._id)}
//                 likeLoading={!!likeLoading[featuredPost._id]}
//                 onPostPress={handlePostPress}
//                 onCommentsPress={handleCommentsPress}
//                 onLikePress={handleLikePress}
//                 onBookmarkPress={handleBookmarkPress}
//                 isBookmarked={!!bookmarkedPosts[featuredPost._id]}
//                 bookmarkLoading={!!bookmarkLoading[featuredPost._id]}
//               />
//             ) : null
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyEmoji}>📝</Text>

//               <Text style={styles.emptyTitle}>
//                 {search || activeCategory !== "All"
//                   ? "No matching posts"
//                   : "No blog posts yet"}
//               </Text>

//               <Text style={styles.emptySubtitle}>
//                 {search || activeCategory !== "All"
//                   ? "Try a different search or category."
//                   : "Be the first to share your story."}
//               </Text>
//             </View>
//           }
//           ListFooterComponent={
//             visibleCount < filteredPosts.length - 1 ? (
//               <Text style={styles.footerHint}>Loading more...</Text>
//             ) : filteredPosts.length > 1 ? (
//               <Text style={styles.footerHint}>You're all caught up ✨</Text>
//             ) : null
//           }
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//   },

//   contentWrap: {
//     flex: 1,
//     width: "100%",
//     alignSelf: "stretch",
//     paddingHorizontal: 20,
//     paddingTop: 32,
//   },

//   headerWrap: {
//     marginBottom: 24,
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 24,
//   },

//   brand: {
//     fontSize: 34,
//     fontWeight: "900",
//     color: "#0f172a",
//     letterSpacing: -1,
//   },

//   tagline: {
//     fontSize: 14,
//     color: "#64748b",
//     marginTop: 6,
//     fontWeight: "600",
//   },

//   pressed: {
//     opacity: 0.7,
//     transform: [
//       {
//         scale: 0.98,
//       },
//     ],
//   },

//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 16,
//     paddingHorizontal: 18,
//     height: 54,
//     gap: 12,
//     shadowColor: "#94a3b8",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },

//   searchIcon: {
//     fontSize: 16,
//     opacity: 0.6,
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: "#0f172a",
//     fontWeight: "500",
//     ...(Platform.OS === "web"
//       ? {
//           outlineStyle: "none" as any,
//         }
//       : null),
//   },

//   clearIcon: {
//     fontSize: 16,
//     color: "#94a3b8",
//     paddingHorizontal: 4,
//   },

//   filterRow: {
//     gap: 10,
//     paddingVertical: 18,
//     paddingRight: 10,
//   },

//   filterChip: {
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 12,
//     backgroundColor: "#ffffff",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },

//   filterChipActive: {
//     backgroundColor: "#0f172a",
//     borderColor: "#0f172a",
//   },

//   filterChipText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#64748b",
//   },

//   filterChipTextActive: {
//     color: "#ffffff",
//   },

//   listContainer: {
//     paddingBottom: 60,
//   },

//   emptyContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//   },

//   featuredCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     overflow: "hidden",
//     marginBottom: 28,
//     shadowColor: "#0f172a",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 24,
//     elevation: 6,
//   },

//   featuredImageWrap: {
//     position: "relative",
//   },

//   featuredImage: {
//     width: "100%",
//     maxHeight: 380,
//     resizeMode: "cover",
//     backgroundColor: "#f1f5f9",
//   },

//   featuredBadgeWrap: {
//     position: "absolute",
//     top: 16,
//     left: 16,
//   },

//   featuredBadge: {
//     backgroundColor: "rgba(15, 23, 42, 0.85)",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },

//   featuredBadgeText: {
//     fontSize: 11,
//     fontWeight: "900",
//     color: "#ffffff",
//     letterSpacing: 1,
//   },

//   featuredContent: {
//     padding: 24,
//   },

//   featuredTitle: {
//     fontSize: 28,
//     lineHeight: 36,
//     fontWeight: "900",
//     color: "#0f172a",
//     letterSpacing: -0.8,
//     marginBottom: 12,
//   },

//   featuredBody: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: "#64748b",
//     fontWeight: "500",
//   },

//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: "#0f172a",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.04,
//     shadowRadius: 12,
//     elevation: 3,
//   },

//   cardTop: {
//     flexDirection: "row",
//     gap: 16,
//   },

//   cardTextCol: {
//     flex: 1,
//   },

//   thumbnail: {
//     width: 104,
//     height: 104,
//     borderRadius: 16,
//     resizeMode: "cover",
//     backgroundColor: "#f1f5f9",
//   },

//   title: {
//     fontSize: 19,
//     lineHeight: 25,
//     fontWeight: "800",
//     color: "#0f172a",
//     letterSpacing: -0.3,
//     marginBottom: 8,
//   },

//   body: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: "#64748b",
//     fontWeight: "500",
//   },

//   metaRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 20,
//   },

//   metaRowTight: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },

//   metaText: {
//     marginLeft: 12,
//   },

//   metaLine: {
//     flex: 1,
//     fontSize: 13,
//     color: "#94a3b8",
//     fontWeight: "600",
//   },

//   authorName: {
//     fontSize: 15,
//     fontWeight: "800",
//     color: "#1e293b",
//   },

//   metaDate: {
//     fontSize: 13,
//     color: "#94a3b8",
//     marginTop: 2,
//     fontWeight: "500",
//   },

//   avatar: {
//     backgroundColor: "#0f172a",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#334155",
//   },

//   avatarInitial: {
//     color: "#ffffff",
//     fontWeight: "800",
//   },

//   tagRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     marginTop: 16,
//   },

//   tagChip: {
//     backgroundColor: "#f8fafc",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },

//   tagChipText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#475569",
//   },

//   divider: {
//     height: 1,
//     backgroundColor: "#f1f5f9",
//     marginTop: 20,
//   },

//   actionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 16,
//   },

//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     backgroundColor: "#f8fafc",
//   },

//   actionButtonLiked: {
//     backgroundColor: "#fef2f2",
//   },

//   actionButtonBookmarked: {
//     backgroundColor: "#ecfdf5",
//   },

//   actionIcon: {
//     fontSize: 16,
//   },

//   actionIconLiked: {
//     color: "#ef4444",
//   },

//   actionIconBookmarked: {
//     color: "#10b981",
//   },

//   actionText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#475569",
//   },

//   actionTextLiked: {
//     color: "#ef4444",
//   },

//   actionTextBookmarked: {
//     color: "#10b981",
//   },

//   flexSpacer: {
//     flex: 1,
//   },

//   readingTime: {
//     fontSize: 13,
//     color: "#94a3b8",
//     fontWeight: "600",
//   },

//   skelLine: {
//     backgroundColor: "#e2e8f0",
//     borderRadius: 8,
//     marginBottom: 12,
//   },

//   skelThumb: {
//     width: 104,
//     height: 104,
//     borderRadius: 16,
//     backgroundColor: "#e2e8f0",
//   },

//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 80,
//   },

//   emptyEmoji: {
//     fontSize: 52,
//     marginBottom: 20,
//   },

//   emptyTitle: {
//     fontSize: 19,
//     fontWeight: "800",
//     color: "#0f172a",
//   },

//   emptySubtitle: {
//     fontSize: 15,
//     color: "#64748b",
//     marginTop: 8,
//     textAlign: "center",
//   },

//   footerHint: {
//     textAlign: "center",
//     fontSize: 14,
//     color: "#94a3b8",
//     paddingVertical: 28,
//     fontWeight: "600",
//   },

//   errorBox: {
//     backgroundColor: "#fef2f2",
//     borderWidth: 1,
//     borderColor: "#fee2e2",
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 20,
//   },

//   errorText: {
//     color: "#ef4444",
//     textAlign: "center",
//     fontWeight: "700",
//     fontSize: 15,
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import API_URL from "../api/api";
// import socket from "../socket/socket";

// const PAGE_SIZE = 6;

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
//   tags?: string[];
//   author: Author;
//   createdAt: string;
//   updatedAt: string;
//   commentCount: number;
// };

// type LikeInfo = {
//   likeCount: number;
//   liked: boolean;
// };

// type NewComment = {
//   _id: string;
//   post: string | { _id: string };
// };

// /* ------------------------------------------------------------------ */
// /* helpers                                                            */
// /* ------------------------------------------------------------------ */

// function getReadingTime(body: string) {
//   const words = body.trim().split(/\s+/).filter(Boolean).length;

//   const minutes = Math.max(1, Math.ceil(words / 200));

//   return `${minutes} min read`;
// }

// function formatDate(value: string) {
//   return new Date(value).toLocaleDateString(undefined, {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// /* ------------------------------------------------------------------ */
// /* Avatar                                                              */
// /* ------------------------------------------------------------------ */

// function Avatar({ name, size = 38 }: { name?: string; size?: number }) {
//   return (
//     <View
//       style={[
//         styles.avatar,
//         {
//           width: size,
//           height: size,
//           borderRadius: size / 2,
//         },
//       ]}
//     >
//       <Text
//         style={[
//           styles.avatarInitial,
//           {
//             fontSize: size * 0.42,
//           },
//         ]}
//       >
//         {name?.charAt(0)?.toUpperCase() || "U"}
//       </Text>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Tags                                                                */
// /* ------------------------------------------------------------------ */

// function TagRow({ tags }: { tags?: string[] }) {
//   if (!tags || tags.length === 0) {
//     return null;
//   }

//   return (
//     <View style={styles.tagRow}>
//       {tags.slice(0, 3).map((tag) => (
//         <View key={tag} style={styles.tagChip}>
//           <Text style={styles.tagChipText}>{tag}</Text>
//         </View>
//       ))}
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Actions                                                             */
// /* ------------------------------------------------------------------ */

// type ActionsProps = {
//   post: Post;
//   likeInfo: LikeInfo;
//   likeLoading: boolean;
//   onCommentsPress: (id: string) => void;
//   onLikePress: (id: string) => void;
// };

// function PostActions({
//   post,
//   likeInfo,
//   likeLoading,
//   onCommentsPress,
//   onLikePress,
// }: ActionsProps) {
//   return (
//     <View style={styles.actionRow}>
//       <Pressable
//         style={({ pressed }) => [
//           styles.actionPill,
//           likeInfo.liked && styles.actionPillLiked,
//           pressed && styles.pressed,
//         ]}
//         onPress={() => onLikePress(post._id)}
//         disabled={likeLoading}
//       >
//         <Text
//           style={[
//             styles.actionPillText,
//             likeInfo.liked && styles.actionPillTextLiked,
//           ]}
//         >
//           {likeInfo.liked ? "♥" : "♡"} {likeInfo.likeCount}
//         </Text>
//       </Pressable>

//       <Pressable
//         style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}
//         onPress={() => onCommentsPress(post._id)}
//       >
//         <Text style={styles.actionPillText}>💬 {post.commentCount || 0}</Text>
//       </Pressable>

//       <View style={styles.flexSpacer} />

//       <Text style={styles.readingTime}>{getReadingTime(post.body)}</Text>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Featured card                                                       */
// /* ------------------------------------------------------------------ */

// type CardProps = {
//   item: Post;
//   likeInfo: LikeInfo;
//   likeLoading: boolean;
//   onPostPress: (id: string) => void;
//   onCommentsPress: (id: string) => void;
//   onLikePress: (id: string) => void;
// };

// function FeaturedCard({
//   item,
//   likeInfo,
//   likeLoading,
//   onPostPress,
//   onCommentsPress,
//   onLikePress,
// }: CardProps) {
//   const imageRatio =
//     item.imageWidth && item.imageHeight
//       ? item.imageWidth / item.imageHeight
//       : 16 / 9;

//   return (
//     <View style={styles.featuredCard}>
//       {item.image ? (
//         <Pressable onPress={() => onPostPress(item._id)}>
//           <Image
//             source={{ uri: item.image }}
//             style={[
//               styles.featuredImage,
//               {
//                 aspectRatio: imageRatio,
//               },
//             ]}
//           />
//         </Pressable>
//       ) : null}

//       <View style={styles.featuredContent}>
//         <View style={styles.featuredBadge}>
//           <Text style={styles.featuredBadgeText}>LATEST</Text>
//         </View>

//         <Pressable onPress={() => onPostPress(item._id)}>
//           <Text style={styles.featuredTitle} numberOfLines={3}>
//             {item.title}
//           </Text>

//           <Text style={styles.featuredBody} numberOfLines={3}>
//             {item.body}
//           </Text>
//         </Pressable>

//         <TagRow tags={item.tags} />

//         <View style={styles.metaRow}>
//           <Avatar name={item.author?.name} size={38} />

//           <View style={styles.metaText}>
//             <Text style={styles.authorName}>
//               {item.author?.name || "Unknown"}
//             </Text>

//             <Text style={styles.metaDate}>{formatDate(item.createdAt)}</Text>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         <PostActions
//           post={item}
//           likeInfo={likeInfo}
//           likeLoading={likeLoading}
//           onCommentsPress={onCommentsPress}
//           onLikePress={onLikePress}
//         />
//       </View>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* List card                                                           */
// /* ------------------------------------------------------------------ */

// function PostCard({
//   item,
//   likeInfo,
//   likeLoading,
//   onPostPress,
//   onCommentsPress,
//   onLikePress,
// }: CardProps) {
//   return (
//     <View style={styles.card}>
//       <Pressable style={styles.cardTop} onPress={() => onPostPress(item._id)}>
//         <View style={styles.cardTextCol}>
//           <View style={styles.metaRowTight}>
//             <Avatar name={item.author?.name} size={26} />

//             <Text style={styles.metaLine} numberOfLines={1}>
//               {item.author?.name || "Unknown"} · {formatDate(item.createdAt)}
//             </Text>
//           </View>

//           <Text style={styles.title} numberOfLines={2}>
//             {item.title}
//           </Text>

//           <Text style={styles.body} numberOfLines={2}>
//             {item.body}
//           </Text>
//         </View>

//         {item.image ? (
//           <Image source={{ uri: item.image }} style={styles.thumbnail} />
//         ) : null}
//       </Pressable>

//       <TagRow tags={item.tags} />

//       <PostActions
//         post={item}
//         likeInfo={likeInfo}
//         likeLoading={likeLoading}
//         onCommentsPress={onCommentsPress}
//         onLikePress={onLikePress}
//       />
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Skeleton                                                            */
// /* ------------------------------------------------------------------ */

// function SkeletonCard() {
//   return (
//     <View style={styles.card}>
//       <View style={styles.cardTop}>
//         <View style={styles.cardTextCol}>
//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "45%",
//                 height: 12,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "90%",
//                 height: 20,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "70%",
//                 height: 20,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "100%",
//                 height: 12,
//               },
//             ]}
//           />
//         </View>

//         <View style={styles.skelThumb} />
//       </View>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Screen                                                              */
// /* ------------------------------------------------------------------ */

// export default function HomeScreen() {
//   const [posts, setPosts] = useState<Post[]>([]);

//   const [refreshing, setRefreshing] = useState(false);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [likeInfo, setLikeInfo] = useState<Record<string, LikeInfo>>({});

//   const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});

//   const [search, setSearch] = useState("");

//   const [activeTag, setActiveTag] = useState("All");

//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

//   /* ---------------------------------------------------------------- */
//   /* TOKEN                                                             */
//   /* ---------------------------------------------------------------- */

//   const getToken = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("token");
//     }

//     return await SecureStore.getItemAsync("token");
//   };

//   /* ---------------------------------------------------------------- */
//   /* FETCH LIKE INFO                                                   */
//   /* ---------------------------------------------------------------- */

//   const fetchLikeInfo = async (postList: Post[]) => {
//     const token = await getToken();

//     if (!token) {
//       setLikeInfo((previous) => {
//         const updated = {
//           ...previous,
//         };

//         postList.forEach((post) => {
//           if (!updated[post._id]) {
//             updated[post._id] = {
//               likeCount: 0,
//               liked: false,
//             };
//           }
//         });

//         return updated;
//       });

//       return;
//     }

//     const results = await Promise.all(
//       postList.map(async (post) => {
//         try {
//           const response = await fetch(`${API_URL}/api/likes/${post._id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           const data = await response.json();

//           if (response.ok) {
//             return {
//               postId: post._id,
//               likeCount: data.likeCount || 0,
//               liked: data.liked || false,
//             };
//           }

//           return {
//             postId: post._id,
//             likeCount: 0,
//             liked: false,
//           };
//         } catch (error) {
//           return {
//             postId: post._id,
//             likeCount: 0,
//             liked: false,
//           };
//         }
//       }),
//     );

//     const updatedLikeInfo: Record<string, LikeInfo> = {};

//     results.forEach((result) => {
//       updatedLikeInfo[result.postId] = {
//         likeCount: result.likeCount,
//         liked: result.liked,
//       };
//     });

//     setLikeInfo(updatedLikeInfo);
//   };

//   /* ---------------------------------------------------------------- */
//   /* FETCH POSTS                                                       */
//   /* ---------------------------------------------------------------- */

//   const fetchPosts = async () => {
//     try {
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);

//       const data = await response.json();

//       if (response.ok) {
//         const postList = data.posts || [];

//         setPosts(postList);

//         await fetchLikeInfo(postList);
//       } else {
//         setError(data.message || "Failed to load posts");
//       }
//     } catch (error) {
//       setError("Unable to connect to server");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   /* ---------------------------------------------------------------- */
//   /* FETCH WHEN HOME GETS FOCUS                                       */
//   /* ---------------------------------------------------------------- */

//   useFocusEffect(
//     useCallback(() => {
//       fetchPosts();
//     }, []),
//   );

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME LIKE UPDATE                                            */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handleLikeUpdated = (data: { postId: string; likeCount: number }) => {
//       if (!data?.postId) {
//         return;
//       }

//       console.log("HOME LIKE UPDATED:", data);

//       setLikeInfo((previous) => ({
//         ...previous,
//         [data.postId]: {
//           likeCount: data.likeCount || 0,
//           liked: previous[data.postId]?.liked || false,
//         },
//       }));
//     };

//     socket.on("like-updated", handleLikeUpdated);

//     return () => {
//       socket.off("like-updated", handleLikeUpdated);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME NEW POST                                               */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handleNewPost = (newPost: Post) => {
//       if (!newPost?._id) {
//         return;
//       }

//       console.log("HOME NEW POST:", newPost);

//       setPosts((previousPosts) => {
//         const alreadyExists = previousPosts.some(
//           (post) => post._id === newPost._id,
//         );

//         if (alreadyExists) {
//           return previousPosts;
//         }

//         return [newPost, ...previousPosts];
//       });

//       setLikeInfo((previous) => ({
//         ...previous,
//         [newPost._id]: {
//           likeCount: 0,
//           liked: false,
//         },
//       }));
//     };

//     socket.on("new-post", handleNewPost);

//     return () => {
//       socket.off("new-post", handleNewPost);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME POST UPDATE                                            */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handlePostUpdated = (updatedPost: Post) => {
//       if (!updatedPost?._id) {
//         return;
//       }

//       console.log("HOME POST UPDATED:", updatedPost);

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           post._id === updatedPost._id ? updatedPost : post,
//         ),
//       );
//     };

//     socket.on("post-updated", handlePostUpdated);

//     return () => {
//       socket.off("post-updated", handlePostUpdated);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME POST DELETE                                            */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handlePostDeleted = (data: { postId: string }) => {
//       if (!data?.postId) {
//         return;
//       }

//       console.log("HOME POST DELETED:", data.postId);

//       setPosts((previousPosts) =>
//         previousPosts.filter((post) => post._id !== data.postId),
//       );

//       setLikeInfo((previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[data.postId];

//         return updated;
//       });

//       setLikeLoading((previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[data.postId];

//         return updated;
//       });
//     };

//     socket.on("post-deleted", handlePostDeleted);

//     return () => {
//       socket.off("post-deleted", handlePostDeleted);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME NEW COMMENT                                            */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handleNewComment = (newComment: NewComment) => {
//       if (!newComment?._id || !newComment?.post) {
//         return;
//       }

//       const postId =
//         typeof newComment.post === "string"
//           ? newComment.post
//           : newComment.post._id;

//       if (!postId) {
//         return;
//       }

//       console.log("HOME NEW COMMENT:", newComment);

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 commentCount: (post.commentCount || 0) + 1,
//               }
//             : post,
//         ),
//       );
//     };

//     socket.on("new-comment", handleNewComment);

//     return () => {
//       socket.off("new-comment", handleNewComment);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* JOIN POST ROOMS                                                  */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     if (!posts.length) {
//       return;
//     }

//     const joinPostRooms = () => {
//       posts.forEach((post) => {
//         if (post?._id) {
//           socket.emit("join-post", post._id);

//           console.log("HOME JOINED POST ROOM:", post._id);
//         }
//       });
//     };

//     if (!socket.connected) {
//       socket.connect();
//     }

//     if (socket.connected) {
//       joinPostRooms();
//     }

//     socket.on("connect", joinPostRooms);

//     return () => {
//       socket.off("connect", joinPostRooms);

//       posts.forEach((post) => {
//         if (post?._id) {
//           socket.emit("leave-post", post._id);
//         }
//       });
//     };
//   }, [posts]);

//   /* ---------------------------------------------------------------- */
//   /* REFRESH                                                          */
//   /* ---------------------------------------------------------------- */

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchPosts();
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* NAVIGATION                                                        */
//   /* ---------------------------------------------------------------- */

//   const handlePostPress = (id: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id,
//       },
//     });
//   };

//   const handleCommentsPress = (id: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id,
//       },
//     });
//   };

//   /* ---------------------------------------------------------------- */
//   /* LIKE                                                             */
//   /* ---------------------------------------------------------------- */

//   const handleLikePress = async (postId: string) => {
//     if (likeLoading[postId]) {
//       return;
//     }

//     const token = await getToken();

//     if (!token) {
//       if (Platform.OS === "web") {
//         window.alert("Please login to like posts");
//       } else {
//         console.log("Please login to like posts");
//       }

//       return;
//     }

//     setLikeLoading((previous) => ({
//       ...previous,
//       [postId]: true,
//     }));

//     try {
//       const response = await fetch(`${API_URL}/api/likes/${postId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setLikeInfo((previous) => ({
//           ...previous,
//           [postId]: {
//             likeCount: data.likeCount || 0,
//             liked: data.liked || false,
//           },
//         }));
//       } else {
//         if (Platform.OS === "web") {
//           window.alert(data.message || "Failed to update like");
//         } else {
//           console.error(data.message || "Failed to update like");
//         }
//       }
//     } catch (error) {
//       console.error("Like error:", error);
//     } finally {
//       setLikeLoading((previous) => ({
//         ...previous,
//         [postId]: false,
//       }));
//     }
//   };

//   /* ---------------------------------------------------------------- */
//   /* DERIVED DATA                                                     */
//   /* ---------------------------------------------------------------- */

//   const allTags = useMemo(() => {
//     const tagSet = new Set<string>();

//     posts.forEach((post) => {
//       (post.tags || []).forEach((tag) => tagSet.add(tag));
//     });

//     return ["All", ...Array.from(tagSet)];
//   }, [posts]);

//   const filteredPosts = useMemo(() => {
//     const term = search.trim().toLowerCase();

//     return posts.filter((post) => {
//       const matchesTag =
//         activeTag === "All" || (post.tags || []).includes(activeTag);

//       if (!matchesTag) {
//         return false;
//       }

//       if (!term) {
//         return true;
//       }

//       return (
//         post.title.toLowerCase().includes(term) ||
//         post.body.toLowerCase().includes(term) ||
//         (post.author?.name || "").toLowerCase().includes(term)
//       );
//     });
//   }, [posts, search, activeTag]);

//   const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;

//   const listPosts = useMemo(
//     () => filteredPosts.slice(1, visibleCount + 1),
//     [filteredPosts, visibleCount],
//   );

//   const getLikeInfo = (id: string) =>
//     likeInfo[id] || {
//       likeCount: 0,
//       liked: false,
//     };

//   const handleEndReached = () => {
//     if (visibleCount < filteredPosts.length - 1) {
//       setVisibleCount((prev) => prev + PAGE_SIZE);
//     }
//   };

//   const renderPost = ({ item }: { item: Post }) => (
//     <PostCard
//       item={item}
//       likeInfo={getLikeInfo(item._id)}
//       likeLoading={!!likeLoading[item._id]}
//       onPostPress={handlePostPress}
//       onCommentsPress={handleCommentsPress}
//       onLikePress={handleLikePress}
//     />
//   );

//   /* ---------------------------------------------------------------- */
//   /* HOME HEADER                                                      */
//   /* ---------------------------------------------------------------- */

//   const header = (
//     <View style={styles.headerWrap}>
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.brand}>Blog Posts</Text>

//           <Text style={styles.tagline}>
//             {posts.length} {posts.length === 1 ? "story" : "stories"} to explore
//           </Text>
//         </View>
//       </View>

//       <View style={styles.searchBox}>
//         <Text style={styles.searchIcon}>🔍</Text>

//         <TextInput
//           value={search}
//           onChangeText={(text) => {
//             setSearch(text);
//             setVisibleCount(PAGE_SIZE);
//           }}
//           placeholder="Search posts, authors..."
//           placeholderTextColor="#9a9a9a"
//           style={styles.searchInput}
//           returnKeyType="search"
//         />

//         {search.length > 0 && (
//           <Pressable onPress={() => setSearch("")} hitSlop={10}>
//             <Text style={styles.clearIcon}>✕</Text>
//           </Pressable>
//         )}
//       </View>

//       {allTags.length > 1 && (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterRow}
//         >
//           {allTags.map((tag) => {
//             const active = tag === activeTag;

//             return (
//               <Pressable
//                 key={tag}
//                 onPress={() => {
//                   setActiveTag(tag);
//                   setVisibleCount(PAGE_SIZE);
//                 }}
//                 style={[styles.filterChip, active && styles.filterChipActive]}
//               >
//                 <Text
//                   style={[
//                     styles.filterChipText,
//                     active && styles.filterChipTextActive,
//                   ]}
//                 >
//                   {tag}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </ScrollView>
//       )}
//     </View>
//   );

//   /* ---------------------------------------------------------------- */
//   /* LOADING                                                          */
//   /* ---------------------------------------------------------------- */

//   if (loading) {
//     return (
//       <View style={styles.screen}>
//         <View style={styles.contentWrap}>
//           {header}

//           <SkeletonCard />
//           <SkeletonCard />
//           <SkeletonCard />
//         </View>
//       </View>
//     );
//   }

//   /* ---------------------------------------------------------------- */
//   /* RENDER                                                           */
//   /* ---------------------------------------------------------------- */

//   return (
//     <View style={styles.screen}>
//       <View style={styles.contentWrap}>
//         {header}

//         {error !== "" && (
//           <View style={styles.errorBox}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}

//         <FlatList
//           data={listPosts}
//           keyExtractor={(item) => item._id}
//           renderItem={renderPost}
//           showsVerticalScrollIndicator={false}
//           onEndReached={handleEndReached}
//           onEndReachedThreshold={0.5}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//               tintColor="#00695c"
//             />
//           }
//           contentContainerStyle={
//             filteredPosts.length === 0
//               ? styles.emptyContainer
//               : styles.listContainer
//           }
//           ListHeaderComponent={
//             featuredPost ? (
//               <FeaturedCard
//                 item={featuredPost}
//                 likeInfo={getLikeInfo(featuredPost._id)}
//                 likeLoading={!!likeLoading[featuredPost._id]}
//                 onPostPress={handlePostPress}
//                 onCommentsPress={handleCommentsPress}
//                 onLikePress={handleLikePress}
//               />
//             ) : null
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyEmoji}>📝</Text>

//               <Text style={styles.emptyTitle}>
//                 {search || activeTag !== "All"
//                   ? "No matching posts"
//                   : "No blog posts yet"}
//               </Text>

//               <Text style={styles.emptySubtitle}>
//                 {search || activeTag !== "All"
//                   ? "Try a different search or category."
//                   : "Be the first to share your story."}
//               </Text>
//             </View>
//           }
//           ListFooterComponent={
//             visibleCount < filteredPosts.length - 1 ? (
//               <Text style={styles.footerHint}>Loading more...</Text>
//             ) : filteredPosts.length > 1 ? (
//               <Text style={styles.footerHint}>You're all caught up</Text>
//             ) : null
//           }
//         />
//       </View>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Styles                                                              */
// /* ------------------------------------------------------------------ */

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   contentWrap: {
//     flex: 1,
//     width: "100%",
//     alignSelf: "stretch",
//     paddingHorizontal: 20,
//     paddingTop: 24,
//   },

//   headerWrap: {
//     marginBottom: 18,
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 18,
//   },

//   brand: {
//     fontSize: 30,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.6,
//   },

//   tagline: {
//     fontSize: 13.5,
//     color: "#8d9995",
//     marginTop: 3,
//     fontWeight: "500",
//   },

//   pressed: {
//     opacity: 0.6,
//   },

//   /* Search */

//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#e6e8e7",
//     borderRadius: 26,
//     paddingHorizontal: 16,
//     height: 46,
//     gap: 10,
//   },

//   searchIcon: {
//     fontSize: 14,
//     opacity: 0.55,
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     color: "#20302c",
//     ...(Platform.OS === "web"
//       ? {
//           outlineStyle: "none" as any,
//         }
//       : null),
//   },

//   clearIcon: {
//     fontSize: 14,
//     color: "#9a9a9a",
//     paddingHorizontal: 2,
//   },

//   /* Tags */

//   filterRow: {
//     gap: 8,
//     paddingVertical: 14,
//     paddingRight: 8,
//   },

//   filterChip: {
//     paddingVertical: 7,
//     paddingHorizontal: 15,
//     borderRadius: 18,
//     backgroundColor: "#eef1f0",
//   },

//   filterChipActive: {
//     backgroundColor: "#00695c",
//   },

//   filterChipText: {
//     fontSize: 13.5,
//     fontWeight: "600",
//     color: "#55635f",
//   },

//   filterChipTextActive: {
//     color: "#fff",
//   },

//   /* List */

//   listContainer: {
//     paddingBottom: 48,
//   },

//   emptyContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//   },

//   /* Featured */

//   featuredCard: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//     overflow: "hidden",
//     marginBottom: 26,

//     shadowColor: "#0d2b25",
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//     shadowOpacity: 0.07,
//     shadowRadius: 14,
//     elevation: 3,
//   },

//   featuredImage: {
//     width: "100%",
//     maxHeight: 400,
//     resizeMode: "contain",
//     backgroundColor: "#eef1f0",
//   },

//   featuredContent: {
//     padding: 22,
//   },

//   featuredBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: "#e0f2ef",
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     marginBottom: 12,
//   },

//   featuredBadgeText: {
//     fontSize: 10.5,
//     fontWeight: "800",
//     color: "#00695c",
//     letterSpacing: 1.1,
//   },

//   featuredTitle: {
//     fontSize: 26,
//     lineHeight: 32,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//     marginBottom: 10,
//   },

//   featuredBody: {
//     fontSize: 15.5,
//     lineHeight: 23,
//     color: "#5d6b67",
//   },

//   /* Cards */

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//     padding: 18,
//     marginBottom: 14,

//     shadowColor: "#0d2b25",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 1,
//   },

//   cardTop: {
//     flexDirection: "row",
//     gap: 16,
//   },

//   cardTextCol: {
//     flex: 1,
//   },

//   thumbnail: {
//     width: 96,
//     height: 96,
//     borderRadius: 12,
//     resizeMode: "cover",
//     backgroundColor: "#eef1f0",
//   },

//   title: {
//     fontSize: 18,
//     lineHeight: 24,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.2,
//     marginBottom: 6,
//   },

//   body: {
//     fontSize: 14.5,
//     lineHeight: 21,
//     color: "#6b7874",
//   },

//   /* Meta */

//   metaRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 16,
//   },

//   metaRowTight: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 8,
//   },

//   metaText: {
//     marginLeft: 10,
//   },

//   metaLine: {
//     flex: 1,
//     fontSize: 12.5,
//     color: "#8d9995",
//     fontWeight: "500",
//   },

//   authorName: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#2b3a36",
//   },

//   metaDate: {
//     fontSize: 12,
//     color: "#95a09c",
//     marginTop: 1,
//   },

//   avatar: {
//     backgroundColor: "#00695c",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   avatarInitial: {
//     color: "#fff",
//     fontWeight: "700",
//   },

//   /* Tags */

//   tagRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 6,
//     marginTop: 12,
//   },

//   tagChip: {
//     backgroundColor: "#f1f4f3",
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//   },

//   tagChipText: {
//     fontSize: 11.5,
//     fontWeight: "600",
//     color: "#55635f",
//   },

//   /* Actions */

//   divider: {
//     height: 1,
//     backgroundColor: "#f0f2f1",
//     marginTop: 16,
//   },

//   actionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 14,
//   },

//   actionPill: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 18,
//     backgroundColor: "#f4f6f5",
//   },

//   actionPillLiked: {
//     backgroundColor: "#fdeaea",
//   },

//   actionPillText: {
//     fontSize: 13.5,
//     fontWeight: "700",
//     color: "#5d6b67",
//   },

//   actionPillTextLiked: {
//     color: "#d32f2f",
//   },

//   flexSpacer: {
//     flex: 1,
//   },

//   readingTime: {
//     fontSize: 12.5,
//     color: "#95a09c",
//     fontWeight: "500",
//   },

//   /* Skeleton */

//   skelLine: {
//     backgroundColor: "#eceeed",
//     borderRadius: 6,
//     marginBottom: 10,
//   },

//   skelThumb: {
//     width: 96,
//     height: 96,
//     borderRadius: 12,
//     backgroundColor: "#eceeed",
//   },

//   /* Empty */

//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 70,
//   },

//   emptyEmoji: {
//     fontSize: 44,
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#2b3a36",
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: "#95a09c",
//     marginTop: 5,
//   },

//   footerHint: {
//     textAlign: "center",
//     fontSize: 13,
//     color: "#a5aead",
//     paddingVertical: 24,
//   },

//   /* Error */

//   errorBox: {
//     backgroundColor: "#ffebee",
//     borderWidth: 1,
//     borderColor: "#ffcdd2",
//     padding: 13,
//     borderRadius: 12,
//     marginBottom: 16,
//   },

//   errorText: {
//     color: "#c62828",
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });
// import { router, useFocusEffect } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import API_URL from "../api/api";
// import socket from "../socket/socket";

// const PAGE_SIZE = 6;

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
//   tags?: string[];
//   author: Author;
//   createdAt: string;
//   updatedAt: string;
//   commentCount: number;
// };

// type LikeInfo = {
//   likeCount: number;
//   liked: boolean;
// };

// type NewComment = {
//   _id: string;
//   post: string | { _id: string };
// };

// type CommentDeleted = {
//   commentId: string;
//   postId: string;
//   parentCommentId: string | null;
//   deletedReplyCount?: number;
// };

// /* ------------------------------------------------------------------ */
// /* helpers                                                            */
// /* ------------------------------------------------------------------ */

// function getReadingTime(body: string) {
//   const words = body.trim().split(/\s+/).filter(Boolean).length;

//   const minutes = Math.max(1, Math.ceil(words / 200));

//   return `${minutes} min read`;
// }

// function formatDate(value: string) {
//   return new Date(value).toLocaleDateString(undefined, {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// /* ------------------------------------------------------------------ */
// /* Avatar                                                              */
// /* ------------------------------------------------------------------ */

// function Avatar({ name, size = 38 }: { name?: string; size?: number }) {
//   return (
//     <View
//       style={[
//         styles.avatar,
//         {
//           width: size,
//           height: size,
//           borderRadius: size / 2,
//         },
//       ]}
//     >
//       <Text
//         style={[
//           styles.avatarInitial,
//           {
//             fontSize: size * 0.42,
//           },
//         ]}
//       >
//         {name?.charAt(0)?.toUpperCase() || "U"}
//       </Text>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Tags                                                                */
// /* ------------------------------------------------------------------ */

// function TagRow({ tags }: { tags?: string[] }) {
//   if (!tags || tags.length === 0) {
//     return null;
//   }

//   return (
//     <View style={styles.tagRow}>
//       {tags.slice(0, 3).map((tag) => (
//         <View key={tag} style={styles.tagChip}>
//           <Text style={styles.tagChipText}>{tag}</Text>
//         </View>
//       ))}
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Actions                                                             */
// /* ------------------------------------------------------------------ */

// type ActionsProps = {
//   post: Post;
//   likeInfo: LikeInfo;
//   likeLoading: boolean;
//   onCommentsPress: (id: string) => void;
//   onLikePress: (id: string) => void;
// };

// function PostActions({
//   post,
//   likeInfo,
//   likeLoading,
//   onCommentsPress,
//   onLikePress,
// }: ActionsProps) {
//   return (
//     <View style={styles.actionRow}>
//       <Pressable
//         style={({ pressed }) => [
//           styles.actionPill,
//           likeInfo.liked && styles.actionPillLiked,
//           pressed && styles.pressed,
//         ]}
//         onPress={() => onLikePress(post._id)}
//         disabled={likeLoading}
//       >
//         <Text
//           style={[
//             styles.actionPillText,
//             likeInfo.liked && styles.actionPillTextLiked,
//           ]}
//         >
//           {likeInfo.liked ? "♥" : "♡"} {likeInfo.likeCount}
//         </Text>
//       </Pressable>

//       <Pressable
//         style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}
//         onPress={() => onCommentsPress(post._id)}
//       >
//         <Text style={styles.actionPillText}>💬 {post.commentCount || 0}</Text>
//       </Pressable>

//       <View style={styles.flexSpacer} />

//       <Text style={styles.readingTime}>{getReadingTime(post.body)}</Text>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Featured card                                                       */
// /* ------------------------------------------------------------------ */

// type CardProps = {
//   item: Post;
//   likeInfo: LikeInfo;
//   likeLoading: boolean;
//   onPostPress: (id: string) => void;
//   onCommentsPress: (id: string) => void;
//   onLikePress: (id: string) => void;
// };

// function FeaturedCard({
//   item,
//   likeInfo,
//   likeLoading,
//   onPostPress,
//   onCommentsPress,
//   onLikePress,
// }: CardProps) {
//   const imageRatio =
//     item.imageWidth && item.imageHeight
//       ? item.imageWidth / item.imageHeight
//       : 16 / 9;

//   return (
//     <View style={styles.featuredCard}>
//       {item.image ? (
//         <Pressable onPress={() => onPostPress(item._id)}>
//           <Image
//             source={{ uri: item.image }}
//             style={[
//               styles.featuredImage,
//               {
//                 aspectRatio: imageRatio,
//               },
//             ]}
//           />
//         </Pressable>
//       ) : null}

//       <View style={styles.featuredContent}>
//         <View style={styles.featuredBadge}>
//           <Text style={styles.featuredBadgeText}>LATEST</Text>
//         </View>

//         <Pressable onPress={() => onPostPress(item._id)}>
//           <Text style={styles.featuredTitle} numberOfLines={3}>
//             {item.title}
//           </Text>

//           <Text style={styles.featuredBody} numberOfLines={3}>
//             {item.body}
//           </Text>
//         </Pressable>

//         <TagRow tags={item.tags} />

//         <View style={styles.metaRow}>
//           <Avatar name={item.author?.name} size={38} />

//           <View style={styles.metaText}>
//             <Text style={styles.authorName}>
//               {item.author?.name || "Unknown"}
//             </Text>

//             <Text style={styles.metaDate}>{formatDate(item.createdAt)}</Text>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         <PostActions
//           post={item}
//           likeInfo={likeInfo}
//           likeLoading={likeLoading}
//           onCommentsPress={onCommentsPress}
//           onLikePress={onLikePress}
//         />
//       </View>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* List card                                                           */
// /* ------------------------------------------------------------------ */

// function PostCard({
//   item,
//   likeInfo,
//   likeLoading,
//   onPostPress,
//   onCommentsPress,
//   onLikePress,
// }: CardProps) {
//   return (
//     <View style={styles.card}>
//       <Pressable style={styles.cardTop} onPress={() => onPostPress(item._id)}>
//         <View style={styles.cardTextCol}>
//           <View style={styles.metaRowTight}>
//             <Avatar name={item.author?.name} size={26} />

//             <Text style={styles.metaLine} numberOfLines={1}>
//               {item.author?.name || "Unknown"} · {formatDate(item.createdAt)}
//             </Text>
//           </View>

//           <Text style={styles.title} numberOfLines={2}>
//             {item.title}
//           </Text>

//           <Text style={styles.body} numberOfLines={2}>
//             {item.body}
//           </Text>
//         </View>

//         {item.image ? (
//           <Image source={{ uri: item.image }} style={styles.thumbnail} />
//         ) : null}
//       </Pressable>

//       <TagRow tags={item.tags} />

//       <PostActions
//         post={item}
//         likeInfo={likeInfo}
//         likeLoading={likeLoading}
//         onCommentsPress={onCommentsPress}
//         onLikePress={onLikePress}
//       />
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Skeleton                                                            */
// /* ------------------------------------------------------------------ */

// function SkeletonCard() {
//   return (
//     <View style={styles.card}>
//       <View style={styles.cardTop}>
//         <View style={styles.cardTextCol}>
//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "45%",
//                 height: 12,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "90%",
//                 height: 20,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "70%",
//                 height: 20,
//               },
//             ]}
//           />

//           <View
//             style={[
//               styles.skelLine,
//               {
//                 width: "100%",
//                 height: 12,
//               },
//             ]}
//           />
//         </View>

//         <View style={styles.skelThumb} />
//       </View>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Screen                                                              */
// /* ------------------------------------------------------------------ */

// export default function HomeScreen() {
//   const [posts, setPosts] = useState<Post[]>([]);

//   const [refreshing, setRefreshing] = useState(false);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [likeInfo, setLikeInfo] = useState<Record<string, LikeInfo>>({});

//   const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});

//   const [search, setSearch] = useState("");

//   const [activeTag, setActiveTag] = useState("All");

//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

//   /* ---------------------------------------------------------------- */
//   /* TOKEN                                                             */
//   /* ---------------------------------------------------------------- */

//   const getToken = async () => {
//     if (Platform.OS === "web") {
//       return localStorage.getItem("token");
//     }

//     return await SecureStore.getItemAsync("token");
//   };

//   /* ---------------------------------------------------------------- */
//   /* FETCH LIKE INFO                                                   */
//   /* ---------------------------------------------------------------- */

//   const fetchLikeInfo = async (postList: Post[]) => {
//     const token = await getToken();

//     if (!token) {
//       setLikeInfo((previous) => {
//         const updated = {
//           ...previous,
//         };

//         postList.forEach((post) => {
//           if (!updated[post._id]) {
//             updated[post._id] = {
//               likeCount: 0,
//               liked: false,
//             };
//           }
//         });

//         return updated;
//       });

//       return;
//     }

//     const results = await Promise.all(
//       postList.map(async (post) => {
//         try {
//           const response = await fetch(`${API_URL}/api/likes/${post._id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           const data = await response.json();

//           if (response.ok) {
//             return {
//               postId: post._id,
//               likeCount: data.likeCount || 0,
//               liked: data.liked || false,
//             };
//           }

//           return {
//             postId: post._id,
//             likeCount: 0,
//             liked: false,
//           };
//         } catch (error) {
//           return {
//             postId: post._id,
//             likeCount: 0,
//             liked: false,
//           };
//         }
//       }),
//     );

//     const updatedLikeInfo: Record<string, LikeInfo> = {};

//     results.forEach((result) => {
//       updatedLikeInfo[result.postId] = {
//         likeCount: result.likeCount,
//         liked: result.liked,
//       };
//     });

//     setLikeInfo(updatedLikeInfo);
//   };

//   /* ---------------------------------------------------------------- */
//   /* FETCH POSTS                                                       */
//   /* ---------------------------------------------------------------- */

//   const fetchPosts = async () => {
//     try {
//       setError("");

//       const response = await fetch(`${API_URL}/api/posts`);

//       const data = await response.json();

//       if (response.ok) {
//         const postList = data.posts || [];

//         setPosts(postList);

//         await fetchLikeInfo(postList);
//       } else {
//         setError(data.message || "Failed to load posts");
//       }
//     } catch (error) {
//       setError("Unable to connect to server");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   /* ---------------------------------------------------------------- */
//   /* FETCH WHEN HOME GETS FOCUS                                       */
//   /* ---------------------------------------------------------------- */

//   useFocusEffect(
//     useCallback(() => {
//       fetchPosts();
//     }, []),
//   );

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME LIKE UPDATE                                            */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handleLikeUpdated = (data: { postId: string; likeCount: number }) => {
//       if (!data?.postId) {
//         return;
//       }

//       console.log("HOME LIKE UPDATED:", data);

//       setLikeInfo((previous) => ({
//         ...previous,
//         [data.postId]: {
//           likeCount: data.likeCount || 0,
//           liked: previous[data.postId]?.liked || false,
//         },
//       }));
//     };

//     socket.on("like-updated", handleLikeUpdated);

//     return () => {
//       socket.off("like-updated", handleLikeUpdated);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME NEW POST                                               */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handleNewPost = (newPost: Post) => {
//       if (!newPost?._id) {
//         return;
//       }

//       console.log("HOME NEW POST:", newPost);

//       setPosts((previousPosts) => {
//         const alreadyExists = previousPosts.some(
//           (post) => post._id === newPost._id,
//         );

//         if (alreadyExists) {
//           return previousPosts;
//         }

//         return [newPost, ...previousPosts];
//       });

//       setLikeInfo((previous) => ({
//         ...previous,
//         [newPost._id]: {
//           likeCount: 0,
//           liked: false,
//         },
//       }));
//     };

//     socket.on("new-post", handleNewPost);

//     return () => {
//       socket.off("new-post", handleNewPost);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME POST UPDATE                                            */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handlePostUpdated = (updatedPost: Post) => {
//       if (!updatedPost?._id) {
//         return;
//       }

//       console.log("HOME POST UPDATED:", updatedPost);

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           post._id === updatedPost._id ? updatedPost : post,
//         ),
//       );
//     };

//     socket.on("post-updated", handlePostUpdated);

//     return () => {
//       socket.off("post-updated", handlePostUpdated);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME POST DELETE                                            */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handlePostDeleted = (data: { postId: string }) => {
//       if (!data?.postId) {
//         return;
//       }

//       console.log("HOME POST DELETED:", data.postId);

//       setPosts((previousPosts) =>
//         previousPosts.filter(
//           (post) => String(post._id) !== String(data.postId),
//         ),
//       );

//       setLikeInfo((previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[data.postId];

//         return updated;
//       });

//       setLikeLoading((previous) => {
//         const updated = {
//           ...previous,
//         };

//         delete updated[data.postId];

//         return updated;
//       });
//     };

//     socket.on("post-deleted", handlePostDeleted);

//     return () => {
//       socket.off("post-deleted", handlePostDeleted);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME NEW COMMENT                                            */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handleNewComment = (newComment: NewComment) => {
//       if (!newComment?._id || !newComment?.post) {
//         return;
//       }

//       const postId =
//         typeof newComment.post === "string"
//           ? newComment.post
//           : newComment.post?._id;

//       if (!postId) {
//         return;
//       }

//       console.log("HOME NEW COMMENT:", newComment);

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           String(post._id) === String(postId)
//             ? {
//                 ...post,
//                 commentCount: (post.commentCount || 0) + 1,
//               }
//             : post,
//         ),
//       );
//     };

//     socket.on("new-comment", handleNewComment);

//     return () => {
//       socket.off("new-comment", handleNewComment);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* REAL-TIME COMMENT DELETE                                         */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     const handleCommentDeleted = (data: CommentDeleted) => {
//       if (!data?.commentId || !data?.postId) {
//         return;
//       }

//       const deletedReplyCount = data.deletedReplyCount || 0;

//       // Main comment = 1
//       // Plus all replies deleted with it
//       const totalDeleted = 1 + deletedReplyCount;

//       console.log("HOME COMMENT DELETED:", {
//         commentId: data.commentId,
//         postId: data.postId,
//         deletedReplyCount,
//         totalDeleted,
//       });

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           String(post._id) === String(data.postId)
//             ? {
//                 ...post,
//                 commentCount: Math.max(
//                   0,
//                   (post.commentCount || 0) - totalDeleted,
//                 ),
//               }
//             : post,
//         ),
//       );
//     };

//     socket.on("comment-deleted", handleCommentDeleted);

//     return () => {
//       socket.off("comment-deleted", handleCommentDeleted);
//     };
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* JOIN POST ROOMS                                                  */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     if (!posts.length) {
//       return;
//     }

//     const joinPostRooms = () => {
//       posts.forEach((post) => {
//         if (post?._id) {
//           socket.emit("join-post", post._id);

//           console.log("HOME JOINED POST ROOM:", post._id);
//         }
//       });
//     };

//     if (!socket.connected) {
//       socket.connect();
//     }

//     if (socket.connected) {
//       joinPostRooms();
//     }

//     socket.on("connect", joinPostRooms);

//     return () => {
//       socket.off("connect", joinPostRooms);

//       posts.forEach((post) => {
//         if (post?._id) {
//           socket.emit("leave-post", post._id);
//         }
//       });
//     };
//   }, [posts]);

//   /* ---------------------------------------------------------------- */
//   /* REFRESH                                                          */
//   /* ---------------------------------------------------------------- */

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchPosts();
//   }, []);

//   /* ---------------------------------------------------------------- */
//   /* NAVIGATION                                                        */
//   /* ---------------------------------------------------------------- */

//   const handlePostPress = (id: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id,
//       },
//     });
//   };

//   const handleCommentsPress = (id: string) => {
//     router.push({
//       pathname: "/post-detail",
//       params: {
//         id,
//       },
//     });
//   };

//   /* ---------------------------------------------------------------- */
//   /* LIKE                                                             */
//   /* ---------------------------------------------------------------- */

//   const handleLikePress = async (postId: string) => {
//     if (likeLoading[postId]) {
//       return;
//     }

//     const token = await getToken();

//     if (!token) {
//       if (Platform.OS === "web") {
//         window.alert("Please login to like posts");
//       } else {
//         console.log("Please login to like posts");
//       }

//       return;
//     }

//     setLikeLoading((previous) => ({
//       ...previous,
//       [postId]: true,
//     }));

//     try {
//       const response = await fetch(`${API_URL}/api/likes/${postId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setLikeInfo((previous) => ({
//           ...previous,
//           [postId]: {
//             likeCount: data.likeCount || 0,
//             liked: data.liked || false,
//           },
//         }));
//       } else {
//         if (Platform.OS === "web") {
//           window.alert(data.message || "Failed to update like");
//         } else {
//           console.error(data.message || "Failed to update like");
//         }
//       }
//     } catch (error) {
//       console.error("Like error:", error);
//     } finally {
//       setLikeLoading((previous) => ({
//         ...previous,
//         [postId]: false,
//       }));
//     }
//   };

//   /* ---------------------------------------------------------------- */
//   /* DERIVED DATA                                                     */
//   /* ---------------------------------------------------------------- */

//   const allTags = useMemo(() => {
//     const tagSet = new Set<string>();

//     posts.forEach((post) => {
//       (post.tags || []).forEach((tag) => tagSet.add(tag));
//     });

//     return ["All", ...Array.from(tagSet)];
//   }, [posts]);

//   const filteredPosts = useMemo(() => {
//     const term = search.trim().toLowerCase();

//     return posts.filter((post) => {
//       const matchesTag =
//         activeTag === "All" || (post.tags || []).includes(activeTag);

//       if (!matchesTag) {
//         return false;
//       }

//       if (!term) {
//         return true;
//       }

//       return (
//         post.title.toLowerCase().includes(term) ||
//         post.body.toLowerCase().includes(term) ||
//         (post.author?.name || "").toLowerCase().includes(term)
//       );
//     });
//   }, [posts, search, activeTag]);

//   const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;

//   const listPosts = useMemo(
//     () => filteredPosts.slice(1, visibleCount + 1),
//     [filteredPosts, visibleCount],
//   );

//   const getLikeInfo = (id: string) =>
//     likeInfo[id] || {
//       likeCount: 0,
//       liked: false,
//     };

//   const handleEndReached = () => {
//     if (visibleCount < filteredPosts.length - 1) {
//       setVisibleCount((prev) => prev + PAGE_SIZE);
//     }
//   };

//   const renderPost = ({ item }: { item: Post }) => (
//     <PostCard
//       item={item}
//       likeInfo={getLikeInfo(item._id)}
//       likeLoading={!!likeLoading[item._id]}
//       onPostPress={handlePostPress}
//       onCommentsPress={handleCommentsPress}
//       onLikePress={handleLikePress}
//     />
//   );

//   /* ---------------------------------------------------------------- */
//   /* HOME HEADER                                                      */
//   /* ---------------------------------------------------------------- */

//   const header = (
//     <View style={styles.headerWrap}>
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.brand}>Blog Posts</Text>

//           <Text style={styles.tagline}>
//             {posts.length} {posts.length === 1 ? "story" : "stories"} to explore
//           </Text>
//         </View>
//       </View>

//       <View style={styles.searchBox}>
//         <Text style={styles.searchIcon}>🔍</Text>

//         <TextInput
//           value={search}
//           onChangeText={(text) => {
//             setSearch(text);
//             setVisibleCount(PAGE_SIZE);
//           }}
//           placeholder="Search posts, authors..."
//           placeholderTextColor="#9a9a9a"
//           style={styles.searchInput}
//           returnKeyType="search"
//         />

//         {search.length > 0 && (
//           <Pressable onPress={() => setSearch("")} hitSlop={10}>
//             <Text style={styles.clearIcon}>✕</Text>
//           </Pressable>
//         )}
//       </View>

//       {allTags.length > 1 && (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterRow}
//         >
//           {allTags.map((tag) => {
//             const active = tag === activeTag;

//             return (
//               <Pressable
//                 key={tag}
//                 onPress={() => {
//                   setActiveTag(tag);
//                   setVisibleCount(PAGE_SIZE);
//                 }}
//                 style={[styles.filterChip, active && styles.filterChipActive]}
//               >
//                 <Text
//                   style={[
//                     styles.filterChipText,
//                     active && styles.filterChipTextActive,
//                   ]}
//                 >
//                   {tag}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </ScrollView>
//       )}
//     </View>
//   );

//   /* ---------------------------------------------------------------- */
//   /* LOADING                                                          */
//   /* ---------------------------------------------------------------- */

//   if (loading) {
//     return (
//       <View style={styles.screen}>
//         <View style={styles.contentWrap}>
//           {header}

//           <SkeletonCard />
//           <SkeletonCard />
//           <SkeletonCard />
//         </View>
//       </View>
//     );
//   }

//   /* ---------------------------------------------------------------- */
//   /* RENDER                                                           */
//   /* ---------------------------------------------------------------- */

//   return (
//     <View style={styles.screen}>
//       <View style={styles.contentWrap}>
//         {header}

//         {error !== "" && (
//           <View style={styles.errorBox}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}

//         <FlatList
//           data={listPosts}
//           keyExtractor={(item) => item._id}
//           renderItem={renderPost}
//           showsVerticalScrollIndicator={false}
//           onEndReached={handleEndReached}
//           onEndReachedThreshold={0.5}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//               tintColor="#00695c"
//             />
//           }
//           contentContainerStyle={
//             filteredPosts.length === 0
//               ? styles.emptyContainer
//               : styles.listContainer
//           }
//           ListHeaderComponent={
//             featuredPost ? (
//               <FeaturedCard
//                 item={featuredPost}
//                 likeInfo={getLikeInfo(featuredPost._id)}
//                 likeLoading={!!likeLoading[featuredPost._id]}
//                 onPostPress={handlePostPress}
//                 onCommentsPress={handleCommentsPress}
//                 onLikePress={handleLikePress}
//               />
//             ) : null
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyEmoji}>📝</Text>

//               <Text style={styles.emptyTitle}>
//                 {search || activeTag !== "All"
//                   ? "No matching posts"
//                   : "No blog posts yet"}
//               </Text>

//               <Text style={styles.emptySubtitle}>
//                 {search || activeTag !== "All"
//                   ? "Try a different search or category."
//                   : "Be the first to share your story."}
//               </Text>
//             </View>
//           }
//           ListFooterComponent={
//             visibleCount < filteredPosts.length - 1 ? (
//               <Text style={styles.footerHint}>Loading more...</Text>
//             ) : filteredPosts.length > 1 ? (
//               <Text style={styles.footerHint}>You're all caught up</Text>
//             ) : null
//           }
//         />
//       </View>
//     </View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Styles                                                              */
// /* ------------------------------------------------------------------ */

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#fbfbfa",
//   },

//   contentWrap: {
//     flex: 1,
//     width: "100%",
//     alignSelf: "stretch",
//     paddingHorizontal: 20,
//     paddingTop: 24,
//   },

//   headerWrap: {
//     marginBottom: 18,
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 18,
//   },

//   brand: {
//     fontSize: 30,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.6,
//   },

//   tagline: {
//     fontSize: 13.5,
//     color: "#8d9995",
//     marginTop: 3,
//     fontWeight: "500",
//   },

//   pressed: {
//     opacity: 0.6,
//   },

//   /* Search */

//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#e6e8e7",
//     borderRadius: 26,
//     paddingHorizontal: 16,
//     height: 46,
//     gap: 10,
//   },

//   searchIcon: {
//     fontSize: 14,
//     opacity: 0.55,
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     color: "#20302c",
//     ...(Platform.OS === "web"
//       ? {
//           outlineStyle: "none" as any,
//         }
//       : null),
//   },

//   clearIcon: {
//     fontSize: 14,
//     color: "#9a9a9a",
//     paddingHorizontal: 2,
//   },

//   /* Tags */

//   filterRow: {
//     gap: 8,
//     paddingVertical: 14,
//     paddingRight: 8,
//   },

//   filterChip: {
//     paddingVertical: 7,
//     paddingHorizontal: 15,
//     borderRadius: 18,
//     backgroundColor: "#eef1f0",
//   },

//   filterChipActive: {
//     backgroundColor: "#00695c",
//   },

//   filterChipText: {
//     fontSize: 13.5,
//     fontWeight: "600",
//     color: "#55635f",
//   },

//   filterChipTextActive: {
//     color: "#fff",
//   },

//   /* List */

//   listContainer: {
//     paddingBottom: 48,
//   },

//   emptyContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//   },

//   /* Featured */

//   featuredCard: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//     overflow: "hidden",
//     marginBottom: 26,

//     shadowColor: "#0d2b25",
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//     shadowOpacity: 0.07,
//     shadowRadius: 14,
//     elevation: 3,
//   },

//   featuredImage: {
//     width: "100%",
//     maxHeight: 400,
//     resizeMode: "contain",
//     backgroundColor: "#eef1f0",
//   },

//   featuredContent: {
//     padding: 22,
//   },

//   featuredBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: "#e0f2ef",
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     marginBottom: 12,
//   },

//   featuredBadgeText: {
//     fontSize: 10.5,
//     fontWeight: "800",
//     color: "#00695c",
//     letterSpacing: 1.1,
//   },

//   featuredTitle: {
//     fontSize: 26,
//     lineHeight: 32,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.5,
//     marginBottom: 10,
//   },

//   featuredBody: {
//     fontSize: 15.5,
//     lineHeight: 23,
//     color: "#5d6b67",
//   },

//   /* Cards */

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#eceeed",
//     padding: 18,
//     marginBottom: 14,

//     shadowColor: "#0d2b25",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 1,
//   },

//   cardTop: {
//     flexDirection: "row",
//     gap: 16,
//   },

//   cardTextCol: {
//     flex: 1,
//   },

//   thumbnail: {
//     width: 96,
//     height: 96,
//     borderRadius: 12,
//     resizeMode: "cover",
//     backgroundColor: "#eef1f0",
//   },

//   title: {
//     fontSize: 18,
//     lineHeight: 24,
//     fontWeight: "800",
//     color: "#14231f",
//     letterSpacing: -0.2,
//     marginBottom: 6,
//   },

//   body: {
//     fontSize: 14.5,
//     lineHeight: 21,
//     color: "#6b7874",
//   },

//   /* Meta */

//   metaRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 16,
//   },

//   metaRowTight: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 8,
//   },

//   metaText: {
//     marginLeft: 10,
//   },

//   metaLine: {
//     flex: 1,
//     fontSize: 12.5,
//     color: "#8d9995",
//     fontWeight: "500",
//   },

//   authorName: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#2b3a36",
//   },

//   metaDate: {
//     fontSize: 12,
//     color: "#95a09c",
//     marginTop: 1,
//   },

//   avatar: {
//     backgroundColor: "#00695c",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   avatarInitial: {
//     color: "#fff",
//     fontWeight: "700",
//   },

//   /* Tags */

//   tagRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 6,
//     marginTop: 12,
//   },

//   tagChip: {
//     backgroundColor: "#f1f4f3",
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//   },

//   tagChipText: {
//     fontSize: 11.5,
//     fontWeight: "600",
//     color: "#55635f",
//   },

//   /* Actions */

//   divider: {
//     height: 1,
//     backgroundColor: "#f0f2f1",
//     marginTop: 16,
//   },

//   actionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 14,
//   },

//   actionPill: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 18,
//     backgroundColor: "#f4f6f5",
//   },

//   actionPillLiked: {
//     backgroundColor: "#fdeaea",
//   },

//   actionPillText: {
//     fontSize: 13.5,
//     fontWeight: "700",
//     color: "#5d6b67",
//   },

//   actionPillTextLiked: {
//     color: "#d32f2f",
//   },

//   flexSpacer: {
//     flex: 1,
//   },

//   readingTime: {
//     fontSize: 12.5,
//     color: "#95a09c",
//     fontWeight: "500",
//   },

//   /* Skeleton */

//   skelLine: {
//     backgroundColor: "#eceeed",
//     borderRadius: 6,
//     marginBottom: 10,
//   },

//   skelThumb: {
//     width: 96,
//     height: 96,
//     borderRadius: 12,
//     backgroundColor: "#eceeed",
//   },

//   /* Empty */

//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 70,
//   },

//   emptyEmoji: {
//     fontSize: 44,
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#2b3a36",
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: "#95a09c",
//     marginTop: 5,
//   },

//   footerHint: {
//     textAlign: "center",
//     fontSize: 13,
//     color: "#a5aead",
//     paddingVertical: 24,
//   },

//   /* Error */

//   errorBox: {
//     backgroundColor: "#ffebee",
//     borderWidth: 1,
//     borderColor: "#ffcdd2",
//     padding: 13,
//     borderRadius: 12,
//     marginBottom: 16,
//   },

//   errorText: {
//     color: "#c62828",
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import API_URL from "../api/api";
import socket from "../socket/socket";

const PAGE_SIZE = 6;

type Author = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
};

type Post = {
  _id: string;
  title: string;
  body: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  category?: string;
  tags?: string[];
  author: Author;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
};

type LikeInfo = {
  likeCount: number;
  liked: boolean;
};

function getReadingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Avatar({
  name,
  profileImage,
  size = 40,
}: {
  name?: string;
  profileImage?: string;
  size?: number;
}) {
  if (profileImage) {
    return (
      <Image
        source={{ uri: profileImage }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#f1f5f9",
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.avatarInitial,
          {
            fontSize: size * 0.42,
          },
        ]}
      >
        {name?.charAt(0)?.toUpperCase() || "U"}
      </Text>
    </View>
  );
}

function TagRow({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <View style={styles.tagRow}>
      {tags.slice(0, 3).map((tag) => (
        <View key={tag} style={styles.tagChip}>
          <Text style={styles.tagChipText}>#{tag}</Text>
        </View>
      ))}
    </View>
  );
}

type ActionsProps = {
  post: Post;
  likeInfo: LikeInfo;
  likeLoading: boolean;
  onCommentsPress: (id: string) => void;
  onLikePress: (id: string) => void;
  onBookmarkPress: (id: string) => void;
  isBookmarked: boolean;
  bookmarkLoading: boolean;
};

function PostActions({
  post,
  likeInfo,
  likeLoading,
  onCommentsPress,
  onLikePress,
  onBookmarkPress,
  isBookmarked,
  bookmarkLoading,
}: ActionsProps) {
  return (
    <View style={styles.actionRow}>
      {/* Like */}
      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          likeInfo.liked && styles.actionButtonLiked,
          pressed && styles.pressed,
        ]}
        onPress={() => onLikePress(post._id)}
        disabled={likeLoading}
      >
        <Text
          style={[styles.actionIcon, likeInfo.liked && styles.actionIconLiked]}
        >
          {likeInfo.liked ? "♥" : "♡"}
        </Text>

        <Text
          style={[styles.actionText, likeInfo.liked && styles.actionTextLiked]}
        >
          {likeInfo.likeCount}
        </Text>
      </Pressable>

      {/* Comments */}
      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.pressed,
        ]}
        onPress={() => onCommentsPress(post._id)}
      >
        <Text style={styles.actionIcon}>💬</Text>
        <Text style={styles.actionText}>{post.commentCount || 0}</Text>
      </Pressable>

      {/* Bookmark */}
      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          isBookmarked && styles.actionButtonBookmarked,
          pressed && styles.pressed,
        ]}
        onPress={() => onBookmarkPress(post._id)}
        disabled={bookmarkLoading}
      >
        <Text
          style={[
            styles.actionIcon,
            isBookmarked && styles.actionIconBookmarked,
          ]}
        >
          {isBookmarked ? "🔖" : "📑"}
        </Text>

        <Text
          style={[
            styles.actionText,
            isBookmarked && styles.actionTextBookmarked,
          ]}
        >
          {isBookmarked ? "Saved" : "Save"}
        </Text>
      </Pressable>

      <View style={styles.flexSpacer} />

      <Text style={styles.readingTime}>{getReadingTime(post.body)}</Text>
    </View>
  );
}

type CardProps = {
  item: Post;
  likeInfo: LikeInfo;
  likeLoading: boolean;
  onPostPress: (id: string) => void;
  onCommentsPress: (id: string) => void;
  onLikePress: (id: string) => void;
  onBookmarkPress: (id: string) => void;
  isBookmarked: boolean;
  bookmarkLoading: boolean;
};

function FeaturedCard({
  item,
  likeInfo,
  likeLoading,
  onPostPress,
  onCommentsPress,
  onLikePress,
  onBookmarkPress,
  isBookmarked,
  bookmarkLoading,
}: CardProps) {
  const imageRatio =
    item.imageWidth && item.imageHeight
      ? item.imageWidth / item.imageHeight
      : 16 / 9;

  return (
    <View style={styles.featuredCard}>
      {item.image ? (
        <Pressable
          onPress={() => onPostPress(item._id)}
          style={styles.featuredImageWrap}
        >
          <Image
            source={{ uri: item.image }}
            style={[
              styles.featuredImage,
              {
                aspectRatio: imageRatio,
              },
            ]}
          />

          <View style={styles.featuredBadgeWrap}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>⭐ LATEST STORY</Text>
            </View>
          </View>
        </Pressable>
      ) : null}

      <View style={styles.featuredContent}>
        <Pressable onPress={() => onPostPress(item._id)}>
          <Text style={styles.featuredTitle} numberOfLines={3}>
            {item.title}
          </Text>

          <Text style={styles.featuredBody} numberOfLines={3}>
            {item.body}
          </Text>
        </Pressable>

        <TagRow tags={item.tags} />

        <View style={styles.metaRow}>
          <Avatar
            name={item.author?.name}
            profileImage={item.author?.profileImage}
            size={42}
          />

          <View style={styles.metaText}>
            <Text style={styles.authorName}>
              {item.author?.name || "Unknown"}
            </Text>

            <Text style={styles.metaDate}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <PostActions
          post={item}
          likeInfo={likeInfo}
          likeLoading={likeLoading}
          onCommentsPress={onCommentsPress}
          onLikePress={onLikePress}
          onBookmarkPress={onBookmarkPress}
          isBookmarked={isBookmarked}
          bookmarkLoading={bookmarkLoading}
        />
      </View>
    </View>
  );
}

function PostCard({
  item,
  likeInfo,
  likeLoading,
  onPostPress,
  onCommentsPress,
  onLikePress,
  onBookmarkPress,
  isBookmarked,
  bookmarkLoading,
}: CardProps) {
  return (
    <View style={styles.card}>
      <Pressable style={styles.cardTop} onPress={() => onPostPress(item._id)}>
        <View style={styles.cardTextCol}>
          <View style={styles.metaRowTight}>
            <Avatar
              name={item.author?.name}
              profileImage={item.author?.profileImage}
              size={28}
            />

            <Text style={styles.metaLine} numberOfLines={1}>
              {item.author?.name || "Unknown"} · {formatDate(item.createdAt)}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
        </View>

        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.thumbnail} />
        ) : null}
      </Pressable>

      <TagRow tags={item.tags} />

      <PostActions
        post={item}
        likeInfo={likeInfo}
        likeLoading={likeLoading}
        onCommentsPress={onCommentsPress}
        onLikePress={onLikePress}
        onBookmarkPress={onBookmarkPress}
        isBookmarked={isBookmarked}
        bookmarkLoading={bookmarkLoading}
      />
    </View>
  );
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardTextCol}>
          <View
            style={[
              styles.skelLine,
              {
                width: "45%",
                height: 12,
                marginBottom: 16,
              },
            ]}
          />

          <View
            style={[
              styles.skelLine,
              {
                width: "90%",
                height: 20,
              },
            ]}
          />

          <View
            style={[
              styles.skelLine,
              {
                width: "70%",
                height: 20,
                marginBottom: 12,
              },
            ]}
          />

          <View
            style={[
              styles.skelLine,
              {
                width: "100%",
                height: 14,
              },
            ]}
          />
        </View>

        <View style={styles.skelThumb} />
      </View>

      <View
        style={[
          styles.skelLine,
          {
            width: "30%",
            height: 14,
            marginTop: 20,
          },
        ]}
      />
    </View>
  );
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [likeInfo, setLikeInfo] = useState<Record<string, LikeInfo>>({});

  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});

  const [bookmarkedPosts, setBookmarkedPosts] = useState<
    Record<string, boolean>
  >({});

  const [bookmarkLoading, setBookmarkLoading] = useState<
    Record<string, boolean>
  >({});

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const getToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    }

    return await SecureStore.getItemAsync("token");
  };

  /*
   * REAL-TIME LIKE UPDATES
   */

  useEffect(() => {
    const handleLikeUpdated = (data: { postId: string; likeCount: number }) => {
      if (!data?.postId) return;

      console.log("HOME LIKE UPDATED:", data);

      setLikeInfo((previous) => ({
        ...previous,
        [data.postId]: {
          ...(previous[data.postId] || {
            likeCount: 0,
            liked: false,
          }),
          likeCount: Number(data.likeCount || 0),
        },
      }));
    };

    socket.on("like-updated", handleLikeUpdated);

    return () => {
      socket.off("like-updated", handleLikeUpdated);
    };
  }, []);

  /*
   * REAL-TIME NEW POST
   */

  useEffect(() => {
    const handleNewPost = (newPost: Post) => {
      if (!newPost?._id) return;

      console.log("HOME NEW POST:", newPost);

      setPosts((previousPosts) => {
        const alreadyExists = previousPosts.some(
          (post) => post._id === newPost._id,
        );

        if (alreadyExists) {
          return previousPosts;
        }

        return [newPost, ...previousPosts];
      });

      setLikeInfo((previous) => ({
        ...previous,
        [newPost._id]: {
          likeCount: 0,
          liked: false,
        },
      }));
    };

    socket.on("new-post", handleNewPost);

    return () => {
      socket.off("new-post", handleNewPost);
    };
  }, []);

  /*
   * REAL-TIME POST UPDATE
   *
   * Backend sends:
   *
   * {
   *   post data,
   *   commentCount
   * }
   *
   * We replace the old post with
   * the updated post.
   */

  useEffect(() => {
    const handlePostUpdated = (updatedPost: Post) => {
      if (!updatedPost?._id) return;

      console.log("HOME POST UPDATED:", updatedPost);

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post,
        ),
      );
    };

    socket.on("post-updated", handlePostUpdated);

    return () => {
      socket.off("post-updated", handlePostUpdated);
    };
  }, []);

  /*
   * REAL-TIME POST DELETE
   *
   * Backend sends:
   *
   * {
   *   postId
   * }
   *
   * Remove that post from Home.
   */

  useEffect(() => {
    const handlePostDeleted = (data: { postId: string }) => {
      if (!data?.postId) return;

      console.log("HOME POST DELETED:", data);

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== data.postId),
      );

      /*
       * Remove old like information.
       */

      setLikeInfo((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[data.postId];

        return updated;
      });

      /*
       * Remove bookmark information.
       */

      setBookmarkedPosts((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[data.postId];

        return updated;
      });

      /*
       * Remove loading states.
       */

      setLikeLoading((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[data.postId];

        return updated;
      });

      setBookmarkLoading((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[data.postId];

        return updated;
      });
    };

    socket.on("post-deleted", handlePostDeleted);

    return () => {
      socket.off("post-deleted", handlePostDeleted);
    };
  }, []);

  /*
   * JOIN POST ROOMS
   */

  useEffect(() => {
    if (!posts.length) return;

    const joinPostRooms = () => {
      posts.forEach((post) => {
        if (post?._id) {
          socket.emit("join-post", post._id);

          console.log("HOME JOINED POST ROOM:", post._id);
        }
      });
    };

    if (!socket.connected) {
      socket.connect();
    }

    if (socket.connected) {
      joinPostRooms();
    }

    socket.on("connect", joinPostRooms);

    return () => {
      socket.off("connect", joinPostRooms);

      posts.forEach((post) => {
        if (post?._id) {
          socket.emit("leave-post", post._id);
        }
      });
    };
  }, [posts]);

  /*
   * GET LIKE INFORMATION
   */

  const fetchLikeInfo = async (postList: Post[]) => {
    const token = await getToken();

    if (!token) {
      setLikeInfo((previous) => {
        const updated = {
          ...previous,
        };

        postList.forEach((post) => {
          if (!updated[post._id]) {
            updated[post._id] = {
              likeCount: 0,
              liked: false,
            };
          }
        });

        return updated;
      });

      return;
    }

    const results = await Promise.all(
      postList.map(async (post) => {
        try {
          const response = await fetch(`${API_URL}/api/likes/${post._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            return {
              postId: post._id,
              likeCount: data.likeCount || 0,
              liked: data.liked || false,
            };
          }

          return {
            postId: post._id,
            likeCount: 0,
            liked: false,
          };
        } catch (error) {
          return {
            postId: post._id,
            likeCount: 0,
            liked: false,
          };
        }
      }),
    );

    const updatedLikeInfo: Record<string, LikeInfo> = {};

    results.forEach((result) => {
      updatedLikeInfo[result.postId] = {
        likeCount: result.likeCount,
        liked: result.liked,
      };
    });

    setLikeInfo(updatedLikeInfo);
  };

  /*
   * GET BOOKMARKS
   */

  const fetchBookmarks = async () => {
    const token = await getToken();

    if (!token) {
      setBookmarkedPosts({});
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const bookmarkMap: Record<string, boolean> = {};

        const bookmarkList = data.bookmarks || [];

        bookmarkList.forEach((post: Post) => {
          if (post?._id) {
            bookmarkMap[post._id] = true;
          }
        });

        setBookmarkedPosts(bookmarkMap);
      } else {
        console.error(data.message || "Failed to fetch bookmarks");
      }
    } catch (error) {
      console.error("Fetch bookmarks error:", error);
    }
  };

  /*
   * GET POSTS
   */

  const fetchPosts = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/posts`);

      const data = await response.json();

      if (response.ok) {
        const postList = data.posts || [];

        setPosts(postList);

        await fetchLikeInfo(postList);

        await fetchBookmarks();
      } else {
        setError(data.message || "Failed to load posts");
      }
    } catch (error) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, []),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const handlePostPress = (id: string) => {
    router.push({
      pathname: "/post-detail",
      params: {
        id,
      },
    });
  };

  const handleCommentsPress = (id: string) => {
    router.push({
      pathname: "/post-detail",
      params: {
        id,
      },
    });
  };

  /*
   * LIKE POST
   */

  const handleLikePress = async (postId: string) => {
    if (likeLoading[postId]) {
      return;
    }

    const token = await getToken();

    if (!token) {
      if (Platform.OS === "web") {
        window.alert("Please login to like posts");
      } else {
        console.log("Please login to like posts");
      }

      return;
    }

    setLikeLoading((previous) => ({
      ...previous,
      [postId]: true,
    }));

    try {
      const response = await fetch(`${API_URL}/api/likes/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLikeInfo((previous) => ({
          ...previous,
          [postId]: {
            likeCount: data.likeCount || 0,
            liked: data.liked || false,
          },
        }));
      } else {
        if (Platform.OS === "web") {
          window.alert(data.message || "Failed to update like");
        } else {
          console.error(data.message || "Failed to update like");
        }
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLikeLoading((previous) => ({
        ...previous,
        [postId]: false,
      }));
    }
  };

  /*
   * BOOKMARK
   */

  const handleBookmarkPress = async (postId: string) => {
    if (bookmarkLoading[postId]) {
      return;
    }

    const token = await getToken();

    if (!token) {
      if (Platform.OS === "web") {
        window.alert("Please login to bookmark posts");
      } else {
        console.log("Please login to bookmark posts");
      }

      return;
    }

    const isBookmarked = !!bookmarkedPosts[postId];

    setBookmarkLoading((previous) => ({
      ...previous,
      [postId]: true,
    }));

    try {
      const response = await fetch(`${API_URL}/api/bookmarks/${postId}`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBookmarkedPosts((previous) => ({
          ...previous,
          [postId]: !isBookmarked,
        }));
      } else {
        if (Platform.OS === "web") {
          window.alert(data.message || "Failed to update bookmark");
        } else {
          console.error(data.message || "Failed to update bookmark");
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setBookmarkLoading((previous) => ({
        ...previous,
        [postId]: false,
      }));
    }
  };

  /*
   * CATEGORIES
   */

  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    posts.forEach((post) => {
      if (post.category?.trim()) {
        categorySet.add(post.category.trim());
      }
    });

    return ["All", ...Array.from(categorySet)];
  }, [posts]);

  /*
   * SEARCH + CATEGORY FILTER
   */

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" ||
        post.category?.toLowerCase() === activeCategory.toLowerCase();

      if (!matchesCategory) {
        return false;
      }

      if (!term) {
        return true;
      }

      return (
        post.title.toLowerCase().includes(term) ||
        post.body.toLowerCase().includes(term) ||
        (post.author?.name || "").toLowerCase().includes(term) ||
        (post.category || "").toLowerCase().includes(term)
      );
    });
  }, [posts, search, activeCategory]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;

  const listPosts = useMemo(
    () => filteredPosts.slice(1, visibleCount + 1),
    [filteredPosts, visibleCount],
  );

  const getLikeInfo = (id: string) =>
    likeInfo[id] || {
      likeCount: 0,
      liked: false,
    };

  const handleEndReached = () => {
    if (visibleCount < filteredPosts.length - 1) {
      setVisibleCount((previous) => previous + PAGE_SIZE);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      item={item}
      likeInfo={getLikeInfo(item._id)}
      likeLoading={!!likeLoading[item._id]}
      onPostPress={handlePostPress}
      onCommentsPress={handleCommentsPress}
      onLikePress={handleLikePress}
      onBookmarkPress={handleBookmarkPress}
      isBookmarked={!!bookmarkedPosts[item._id]}
      bookmarkLoading={!!bookmarkLoading[item._id]}
    />
  );

  const header = (
    <View style={styles.headerWrap}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Blog Posts</Text>

          <Text style={styles.tagline}>
            {posts.length} {posts.length === 1 ? "story" : "stories"} to explore
          </Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="Search posts, authors..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} hitSlop={10}>
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        )}
      </View>

      {categories.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {categories.map((category) => {
            const active = category === activeCategory;

            return (
              <Pressable
                key={category}
                onPress={() => {
                  setActiveCategory(category);
                  setVisibleCount(PAGE_SIZE);
                }}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.contentWrap}>
          {header}

          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.contentWrap}>
        {header}

        {error !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <FlatList
          data={listPosts}
          keyExtractor={(item) => item._id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0f172a"
              colors={["#0f172a"]}
            />
          }
          contentContainerStyle={
            filteredPosts.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
          ListHeaderComponent={
            featuredPost ? (
              <FeaturedCard
                item={featuredPost}
                likeInfo={getLikeInfo(featuredPost._id)}
                likeLoading={!!likeLoading[featuredPost._id]}
                onPostPress={handlePostPress}
                onCommentsPress={handleCommentsPress}
                onLikePress={handleLikePress}
                onBookmarkPress={handleBookmarkPress}
                isBookmarked={!!bookmarkedPosts[featuredPost._id]}
                bookmarkLoading={!!bookmarkLoading[featuredPost._id]}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>

              <Text style={styles.emptyTitle}>
                {search || activeCategory !== "All"
                  ? "No matching posts"
                  : "No blog posts yet"}
              </Text>

              <Text style={styles.emptySubtitle}>
                {search || activeCategory !== "All"
                  ? "Try a different search or category."
                  : "Be the first to share your story."}
              </Text>
            </View>
          }
          ListFooterComponent={
            visibleCount < filteredPosts.length - 1 ? (
              <Text style={styles.footerHint}>Loading more...</Text>
            ) : filteredPosts.length > 1 ? (
              <Text style={styles.footerHint}>You're all caught up ✨</Text>
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  contentWrap: {
    flex: 1,
    width: "100%",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingTop: 32,
  },

  headerWrap: {
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  brand: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
  },

  tagline: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 6,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 54,
    gap: 12,
    shadowColor: "#94a3b8",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  searchIcon: {
    fontSize: 16,
    opacity: 0.6,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
    ...(Platform.OS === "web"
      ? {
        outlineStyle: "none" as any,
      }
      : null),
  },

  clearIcon: {
    fontSize: 16,
    color: "#94a3b8",
    paddingHorizontal: 4,
  },

  filterRow: {
    gap: 10,
    paddingVertical: 18,
    paddingRight: 10,
  },

  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  filterChipActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },

  filterChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },

  filterChipTextActive: {
    color: "#ffffff",
  },

  listContainer: {
    paddingBottom: 60,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  featuredCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
    marginBottom: 28,
    shadowColor: "#0f172a",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },

  featuredImageWrap: {
    position: "relative",
  },

  featuredImage: {
    width: "100%",
    maxHeight: 380,
    resizeMode: "cover",
    backgroundColor: "#f1f5f9",
  },

  featuredBadgeWrap: {
    position: "absolute",
    top: 16,
    left: 16,
  },

  featuredBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  featuredBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
  },

  featuredContent: {
    padding: 24,
  },

  featuredTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.8,
    marginBottom: 12,
  },

  featuredBody: {
    fontSize: 16,
    lineHeight: 24,
    color: "#64748b",
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    padding: 20,
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  cardTop: {
    flexDirection: "row",
    gap: 16,
  },

  cardTextCol: {
    flex: 1,
  },

  thumbnail: {
    width: 104,
    height: 104,
    borderRadius: 16,
    resizeMode: "cover",
    backgroundColor: "#f1f5f9",
  },

  title: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
    marginBottom: 8,
  },

  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
    fontWeight: "500",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  metaRowTight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  metaText: {
    marginLeft: 12,
  },

  metaLine: {
    flex: 1,
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },

  authorName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
  },

  metaDate: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: "500",
  },

  avatar: {
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },

  avatarInitial: {
    color: "#ffffff",
    fontWeight: "800",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },

  tagChip: {
    backgroundColor: "#f8fafc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  tagChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginTop: 20,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },

  actionButtonLiked: {
    backgroundColor: "#fef2f2",
  },

  actionButtonBookmarked: {
    backgroundColor: "#ecfdf5",
  },

  actionIcon: {
    fontSize: 16,
  },

  actionIconLiked: {
    color: "#ef4444",
  },

  actionIconBookmarked: {
    color: "#10b981",
  },

  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  actionTextLiked: {
    color: "#ef4444",
  },

  actionTextBookmarked: {
    color: "#10b981",
  },

  flexSpacer: {
    flex: 1,
  },

  readingTime: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },

  skelLine: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    marginBottom: 12,
  },

  skelThumb: {
    width: 104,
    height: 104,
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
  },

  emptyEmoji: {
    fontSize: 52,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0f172a",
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },

  footerHint: {
    textAlign: "center",
    fontSize: 14,
    color: "#94a3b8",
    paddingVertical: 28,
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  errorText: {
    color: "#ef4444",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },
});
