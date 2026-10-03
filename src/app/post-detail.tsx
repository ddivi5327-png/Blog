// import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { jwtDecode } from "jwt-decode";
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
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

// type User = {
//   _id?: string;
//   id?: string;
//   userId?: string;
//   name?: string;
//   email?: string;
//   profileImage?: string;
// };

// type Comment = {
//   _id: string;
//   text: string;
//   author: User;
//   post: string | { _id?: string };
//   parentComment?: string | null;
//   createdAt: string;
// };

// type Post = {
//   _id: string;
//   title: string;
//   body: string;
//   category: string;
//   image?: string;
//   imageWidth?: number;
//   imageHeight?: number;
//   author: User;
//   createdAt: string;
//   updatedAt: string;
// };

// type TokenPayload = {
//   id?: string;
//   userId?: string;
//   _id?: string;
//   exp?: number;
// };

// export default function PostDetail() {
//   const { id } = useLocalSearchParams<{ id: string }>();

//   const [post, setPost] = useState<Post | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const [commentText, setCommentText] = useState("");
//   const [replyTo, setReplyTo] = useState<Comment | null>(null);
//   const [submittingComment, setSubmittingComment] = useState(false);

//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [liking, setLiking] = useState(false);

//   const [expandedReplies, setExpandedReplies] = useState<
//     Record<string, boolean>
//   >({});
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

//   // ============================================================
//   // GET TOKEN
//   // ============================================================
//   const getToken = async () => {
//     try {
//       if (Platform.OS === "web") {
//         return localStorage.getItem("token");
//       }
//       return await SecureStore.getItemAsync("token");
//     } catch (error) {
//       console.log("Get token error:", error);
//       return null;
//     }
//   };

//   // ============================================================
//   // GET CURRENT USER
//   // ============================================================
//   const getCurrentUser = async () => {
//     try {
//       let userJson: string | null = null;
//       if (Platform.OS === "web") {
//         userJson = localStorage.getItem("user");
//       } else {
//         userJson = await SecureStore.getItemAsync("user");
//       }

//       if (userJson) {
//         try {
//           const user = JSON.parse(userJson);
//           const userId =
//             user?._id ||
//             user?.id ||
//             user?.userId ||
//             user?.user?._id ||
//             user?.user?.id;
//           if (userId) {
//             setCurrentUserId(String(userId));
//             return;
//           }
//         } catch (error) {
//           console.log("User JSON parse error:", error);
//         }
//       }

//       const token = await getToken();
//       if (token) {
//         try {
//           const decoded = jwtDecode<TokenPayload>(token);
//           const userId = decoded.id || decoded.userId || decoded._id || null;
//           if (userId) {
//             setCurrentUserId(String(userId));
//             return;
//           }
//         } catch (error) {
//           console.log("JWT decode error:", error);
//         }
//       }
//       setCurrentUserId(null);
//     } catch (error) {
//       console.log("Failed to get current user:", error);
//       setCurrentUserId(null);
//     }
//   };

//   // ============================================================
//   // FETCH POST
//   // ============================================================
//   const fetchPost = async () => {
//     if (!id) return;
//     try {
//       const response = await fetch(`${API_URL}/api/posts/${id}`);
//       if (!response.ok) throw new Error("Failed to fetch post");
//       const data = await response.json();
//       const postData = data?.post || data;
//       setPost(postData);
//     } catch (error) {
//       console.error("Fetch post error:", error);
//       Alert.alert("Error", "Unable to load post.");
//     }
//   };

//   // ============================================================
//   // FETCH COMMENTS
//   // ============================================================
//   const fetchComments = async () => {
//     if (!id) return;
//     try {
//       const response = await fetch(`${API_URL}/api/comments/post/${id}`);
//       if (!response.ok) throw new Error("Failed to fetch comments");
//       const data = await response.json();
//       const commentList = Array.isArray(data)
//         ? data
//         : Array.isArray(data.comments)
//           ? data.comments
//           : [];
//       const validComments = commentList.filter(
//         (comment: Comment) =>
//           comment && typeof comment === "object" && comment._id && comment.text,
//       );
//       setComments(validComments);
//     } catch (error) {
//       console.error("Fetch comments error:", error);
//     }
//   };

//   // ============================================================
//   // FETCH LIKE INFO
//   // ============================================================
//   const fetchLikeInfo = async () => {
//     if (!id) return;
//     try {
//       const token = await getToken();
//       const response = await fetch(`${API_URL}/api/likes/${id}`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!response.ok) return;
//       const data = await response.json();
//       setLiked(Boolean(data.liked));
//       setLikeCount(Number(data.likeCount || 0));
//     } catch (error) {
//       console.error("Fetch like info error:", error);
//     }
//   };

//   // ============================================================
//   // LOAD PAGE
//   // ============================================================
//   const loadPage = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([
//         getCurrentUser(),
//         fetchPost(),
//         fetchComments(),
//         fetchLikeInfo(),
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPage();
//   }, [id]);

//   // ============================================================
//   // SOCKET - NEW COMMENT
//   // ============================================================
//   useEffect(() => {
//     if (!id) return;
//     if (!socket.connected) {
//       socket.connect();
//     }
//     socket.emit("join-post", id);

//     const handleNewComment = (newComment: Comment) => {
//       if (!newComment || !newComment._id) return;
//       const commentPostId =
//         typeof newComment.post === "object"
//           ? newComment.post?._id
//           : newComment.post;
//       if (String(commentPostId) !== String(id)) return;

//       setComments((previous) => {
//         const exists = previous.some(
//           (comment) => comment._id === newComment._id,
//         );
//         if (exists) return previous;
//         return [newComment, ...previous];
//       });
//     };

//     socket.on("new-comment", handleNewComment);

//     return () => {
//       socket.off("new-comment", handleNewComment);
//     };
//   }, [id]);

//   // ============================================================
//   // REFRESH WHEN SCREEN GETS FOCUS
//   // ============================================================
//   useFocusEffect(
//     useCallback(() => {
//       if (!id) return;
//       getCurrentUser();
//       fetchPost();
//       fetchComments();
//       fetchLikeInfo();
//     }, [id]),
//   );

//   // ============================================================
//   // REFRESH
//   // ============================================================
//   const handleRefresh = async () => {
//     try {
//       setRefreshing(true);
//       await Promise.all([
//         getCurrentUser(),
//         fetchPost(),
//         fetchComments(),
//         fetchLikeInfo(),
//       ]);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // ============================================================
//   // LIKE POST
//   // ============================================================
//   const handleLike = async () => {
//     if (!id || liking) return;
//     try {
//       setLiking(true);
//       const token = await getToken();
//       if (!token) {
//         Alert.alert("Login Required", "Please login to like this post.");
//         return;
//       }
//       const response = await fetch(`${API_URL}/api/likes/${id}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         Alert.alert("Error", data.message || "Unable to update like.");
//         return;
//       }
//       setLiked(Boolean(data.liked));
//       setLikeCount(Number(data.likeCount || 0));
//     } catch (error) {
//       console.error("Like error:", error);
//       Alert.alert("Error", "Something went wrong while updating like.");
//     } finally {
//       setLiking(false);
//     }
//   };

//   // ============================================================
//   // ADD COMMENT
//   // ============================================================
//   const handleAddComment = async () => {
//     if (!id) return;
//     const text = commentText.trim();
//     if (!text) {
//       Alert.alert("Error", "Please enter a comment.");
//       return;
//     }
//     try {
//       setSubmittingComment(true);
//       const token = await getToken();
//       if (!token) {
//         Alert.alert("Login Required", "Please login to comment.");
//         return;
//       }
//       const response = await fetch(`${API_URL}/api/comments/post/${id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text, parentComment: replyTo?._id || null }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         Alert.alert("Error", data.message || "Unable to add comment.");
//         return;
//       }
//       const newComment = data?.comment;
//       if (!newComment || !newComment._id) {
//         console.error("Invalid comment response:", data);
//         Alert.alert("Error", "Invalid comment response from server.");
//         return;
//       }
//       setComments((previous) => {
//         const exists = previous.some(
//           (comment) => comment._id === newComment._id,
//         );
//         if (exists) return previous;
//         return [newComment, ...previous];
//       });
//       setCommentText("");
//       setReplyTo(null);
//     } catch (error) {
//       console.error("Add comment error:", error);
//       Alert.alert("Error", "Something went wrong while adding comment.");
//     } finally {
//       setSubmittingComment(false);
//     }
//   };

//   // ============================================================
//   // ACTUAL DELETE COMMENT REQUEST
//   // ============================================================
//   const deleteCommentRequest = async (commentId: string) => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         Alert.alert("Login Required", "Please login again.");
//         return;
//       }
//       const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         Alert.alert("Error", data.message || "Unable to delete comment.");
//         return;
//       }
//       setComments((previous) =>
//         previous.filter(
//           (comment) =>
//             comment._id !== commentId &&
//             String(comment.parentComment) !== String(commentId),
//         ),
//       );
//       setCommentToDelete(null);
//     } catch (error) {
//       console.error("Delete comment error:", error);
//       Alert.alert("Error", "Something went wrong while deleting comment.");
//     }
//   };

//   // ============================================================
//   // DELETE COMMENT
//   // ============================================================
//   const handleDeleteComment = (commentId: string) => {
//     if (!commentId) return;
//     if (Platform.OS === "web") {
//       setCommentToDelete(commentId);
//       return;
//     }
//     Alert.alert(
//       "Delete Comment",
//       "Are you sure you want to delete this comment?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => deleteCommentRequest(commentId),
//         },
//       ],
//     );
//   };

//   // ============================================================
//   // EDIT POST
//   // ============================================================
//   const handleEditPost = () => {
//     if (!post?._id) return;
//     router.push({ pathname: "/edit-post", params: { id: String(post._id) } });
//   };

//   // ============================================================
//   // ACTUAL DELETE POST REQUEST
//   // ============================================================
//   const deletePostRequest = async () => {
//     if (!post?._id) return;
//     try {
//       const token = await getToken();
//       if (!token) {
//         Alert.alert("Login Required", "Please login again.");
//         return;
//       }
//       const response = await fetch(`${API_URL}/api/posts/${post._id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         Alert.alert("Error", data.message || "Unable to delete post.");
//         return;
//       }
//       setShowDeleteConfirm(false);
//       if (Platform.OS === "web") {
//         window.alert("Post deleted successfully.");
//         router.replace("/home");
//       } else {
//         Alert.alert("Success", "Post deleted successfully.", [
//           { text: "OK", onPress: () => router.replace("/home") },
//         ]);
//       }
//     } catch (error) {
//       console.error("DELETE FRONTEND ERROR:", error);
//       Alert.alert("Error", "Something went wrong while deleting the post.");
//     }
//   };

//   // ============================================================
//   // DELETE POST BUTTON
//   // ============================================================
//   const handleDeletePost = async () => {
//     if (!post?._id) return;
//     if (Platform.OS === "web") {
//       setShowDeleteConfirm(true);
//       return;
//     }
//     Alert.alert(
//       "Delete Post",
//       "Are you sure you want to delete this post? This action cannot be undone.",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Delete", style: "destructive", onPress: deletePostRequest },
//       ],
//     );
//   };

//   // ============================================================
//   // COMMENTS
//   // ============================================================
//   const getReplies = (commentId: string) => {
//     return comments.filter(
//       (comment) => String(comment.parentComment) === String(commentId),
//     );
//   };

//   const toggleReplies = (commentId: string) => {
//     setExpandedReplies((previous) => ({
//       ...previous,
//       [commentId]: !previous[commentId],
//     }));
//   };

//   // ============================================================
//   // RENDER COMMENT
//   // ============================================================
//   const renderCommentItem = (comment: Comment, isReply = false) => {
//     if (!comment || !comment._id) return null;

//     const replies = getReplies(comment._id);
//     const showReplies = expandedReplies[comment._id];
//     const commentAuthorId =
//       comment.author?._id ||
//       comment.author?.id ||
//       comment.author?.userId ||
//       null;
//     const isCommentOwner =
//       Boolean(commentAuthorId) &&
//       Boolean(currentUserId) &&
//       String(commentAuthorId) === String(currentUserId);

//     return (
//       <View
//         key={String(comment._id)}
//         style={[styles.commentContainer, isReply && styles.replyContainer]}
//       >
//         <View style={styles.commentHeader}>
//           {comment.author?.profileImage ? (
//             <Image
//               source={{ uri: comment.author.profileImage }}
//               style={styles.commentAvatar}
//             />
//           ) : (
//             <View style={styles.commentAvatarFallback}>
//               <Text style={styles.commentAvatarText}>
//                 {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
//               </Text>
//             </View>
//           )}
//           <View style={styles.commentAuthorArea}>
//             <Text style={styles.commentAuthor}>
//               {comment.author?.name || "Unknown User"}
//             </Text>
//             <Text style={styles.commentDate}>
//               {comment.createdAt
//                 ? new Date(comment.createdAt).toLocaleDateString()
//                 : ""}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.commentText}>{comment.text}</Text>

//         <View style={styles.commentActions}>
//           {!isReply && (
//             <Pressable
//               onPress={() => setReplyTo(comment)}
//               style={styles.actionPill}
//             >
//               <Text style={styles.replyButton}>Reply</Text>
//             </Pressable>
//           )}

//           {replies.length > 0 && (
//             <Pressable
//               onPress={() => toggleReplies(comment._id)}
//               style={styles.actionPill}
//             >
//               <Text style={styles.replyButton}>
//                 {showReplies
//                   ? "Hide Replies"
//                   : `View Replies (${replies.length})`}
//               </Text>
//             </Pressable>
//           )}

//           {isCommentOwner && (
//             <Pressable
//               onPress={() => handleDeleteComment(comment._id)}
//               style={styles.actionPillDanger}
//             >
//               <Text style={styles.deleteCommentButton}>Delete</Text>
//             </Pressable>
//           )}
//         </View>

//         {showReplies && replies.length > 0 && (
//           <View style={styles.replies}>
//             {replies.map((reply) => renderCommentItem(reply, true))}
//           </View>
//         )}
//       </View>
//     );
//   };

//   // ============================================================
//   // LOADING
//   // ============================================================
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0f172a" />
//         <Text style={styles.loadingText}>Loading post...</Text>
//       </View>
//     );
//   }

//   // ============================================================
//   // POST NOT FOUND
//   // ============================================================
//   if (!post) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorTitle}>Post not found</Text>
//         <Pressable
//           style={styles.backButton}
//           onPress={() => router.replace("/home")}
//         >
//           <Text style={styles.backButtonText}>Back to Home</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   // ============================================================
//   // OWNER CHECK
//   // ============================================================
//   const postAuthorId =
//     post.author?._id || post.author?.id || post.author?.userId || null;
//   const isPostOwner =
//     Boolean(currentUserId) &&
//     Boolean(postAuthorId) &&
//     String(postAuthorId) === String(currentUserId);
//   const topLevelComments = comments.filter(
//     (comment) => comment && comment._id && !comment.parentComment,
//   );

//   // ============================================================
//   // UI
//   // ============================================================
//   return (
//     <View style={styles.screen}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.contentContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             tintColor="#0f172a"
//           />
//         }
//       >
//         {/* BACK */}
//         {/* <Pressable onPress={() => router.back()} style={styles.backLink}>
//           <Text style={styles.backLinkText}>← Back to Feed</Text> */}
//         {/* </Pressable> */}

//         {/* POST */}
//         <View style={styles.postCard}>
//           {/* AUTHOR */}
//           <View style={styles.postHeader}>
//             {post.author?.profileImage ? (
//               <Image
//                 source={{ uri: post.author.profileImage }}
//                 style={styles.authorAvatar}
//               />
//             ) : (
//               <View style={styles.authorAvatarFallback}>
//                 <Text style={styles.authorAvatarText}>
//                   {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
//                 </Text>
//               </View>
//             )}
//             <View style={styles.authorInfo}>
//               <Text style={styles.authorName}>
//                 {post.author?.name || "Unknown User"}
//               </Text>
//               <Text style={styles.postDate}>
//                 {post.createdAt
//                   ? new Date(post.createdAt).toLocaleDateString()
//                   : ""}
//               </Text>
//             </View>

//             {/* EDIT / DELETE */}
//             {isPostOwner && (
//               <View style={styles.postManagementActions}>
//                 <Pressable onPress={handleEditPost} style={styles.editButton}>
//                   <Text style={styles.editButtonText}>Edit</Text>
//                 </Pressable>
//                 <Pressable
//                   onPress={handleDeletePost}
//                   style={styles.deletePostButton}
//                 >
//                   <Text style={styles.deletePostButtonText}>Delete</Text>
//                 </Pressable>
//               </View>
//             )}
//           </View>

//           {/* WEB POST DELETE CONFIRMATION */}
//           {showDeleteConfirm && Platform.OS === "web" && (
//             <View style={styles.deleteConfirmBox}>
//               <Text style={styles.deleteConfirmTitle}>Delete Post?</Text>
//               <Text style={styles.deleteConfirmMessage}>
//                 Are you sure you want to delete this post? This action cannot be
//                 undone.
//               </Text>
//               <View style={styles.deleteConfirmActions}>
//                 <Pressable
//                   onPress={() => setShowDeleteConfirm(false)}
//                   style={styles.cancelDeleteButton}
//                 >
//                   <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
//                 </Pressable>
//                 <Pressable
//                   onPress={deletePostRequest}
//                   style={styles.confirmDeleteButton}
//                 >
//                   <Text style={styles.confirmDeleteButtonText}>Delete</Text>
//                 </Pressable>
//               </View>
//             </View>
//           )}

//           {/* CATEGORY */}
//           {post.category ? (
//             <View style={styles.categoryBadge}>
//               <Text style={styles.categoryText}>{post.category}</Text>
//             </View>
//           ) : null}

//           {/* TITLE */}
//           <Text style={styles.postTitle}>{post.title}</Text>
//         </View>

//         {/* FULL WIDTH IMAGE */}
//         {post.image ? (
//           <Image
//             source={{ uri: post.image }}
//             style={styles.postImage}
//             resizeMode="cover"
//           />
//         ) : null}

//         {/* POST CONTENT */}
//         <View style={styles.postContentCard}>
//           <Text style={styles.postBody}>{post.body}</Text>

//           {/* LIKE */}
//           <View style={styles.postActions}>
//             <Pressable
//               onPress={handleLike}
//               disabled={liking}
//               style={({ pressed }) => [
//                 styles.likeButton,
//                 liked && styles.likedButton,
//                 pressed && styles.pressed,
//               ]}
//             >
//               <Text
//                 style={[styles.likeButtonText, liked && styles.likedButtonText]}
//               >
//                 {liked ? "♥ Liked" : "♡ Like"} {likeCount}
//               </Text>
//             </Pressable>
//           </View>
//         </View>

//         {/* COMMENTS */}
//         <View style={styles.commentsSection}>
//           <Text style={styles.commentsTitle}>
//             Comments ({topLevelComments.length})
//           </Text>

//           {/* REPLYING */}
//           {replyTo && (
//             <View style={styles.replyingBox}>
//               <Text style={styles.replyingText}>
//                 Replying to {replyTo.author?.name || "Unknown User"}
//               </Text>
//               <Pressable onPress={() => setReplyTo(null)}>
//                 <Text style={styles.cancelReplyText}>Cancel</Text>
//               </Pressable>
//             </View>
//           )}

//           {/* COMMENT INPUT */}
//           <View style={styles.commentInputContainer}>
//             <TextInput
//               value={commentText}
//               onChangeText={setCommentText}
//               placeholder={
//                 replyTo ? "Write a reply..." : "Share your thoughts..."
//               }
//               placeholderTextColor="#94a3b8"
//               multiline
//               style={styles.commentInput}
//             />
//             <Pressable
//               onPress={handleAddComment}
//               disabled={submittingComment}
//               style={({ pressed }) => [
//                 styles.commentSubmitButton,
//                 pressed && styles.pressed,
//               ]}
//             >
//               {submittingComment ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.commentSubmitText}>
//                   {replyTo ? "Reply" : "Comment"}
//                 </Text>
//               )}
//             </Pressable>
//           </View>

//           {/* COMMENTS LIST */}
//           {topLevelComments.length === 0 ? (
//             <Text style={styles.noCommentsText}>
//               No comments yet. Be the first to comment.
//             </Text>
//           ) : (
//             <View style={styles.commentsList}>
//               {topLevelComments.map((comment) => renderCommentItem(comment))}
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* WEB COMMENT DELETE CONFIRMATION */}
//       {commentToDelete && Platform.OS === "web" && (
//         <View style={styles.commentDeleteOverlay}>
//           <View style={styles.commentDeleteBox}>
//             <Text style={styles.commentDeleteTitle}>Delete Comment?</Text>
//             <Text style={styles.commentDeleteMessage}>
//               Are you sure you want to delete this comment?
//             </Text>
//             <View style={styles.commentDeleteActions}>
//               <Pressable
//                 onPress={() => setCommentToDelete(null)}
//                 style={styles.cancelDeleteButton}
//               >
//                 <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
//               </Pressable>
//               <Pressable
//                 onPress={() => {
//                   const commentId = commentToDelete;
//                   setCommentToDelete(null);
//                   deleteCommentRequest(commentId);
//                 }}
//                 style={styles.confirmDeleteButton}
//               >
//                 <Text style={styles.confirmDeleteButtonText}>Delete</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#f8fafc", // Slate-50
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     padding: 24,
//     maxWidth: 800,
//     width: "100%",
//     alignSelf: "center",
//     paddingBottom: 60,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8fafc",
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 15,
//     color: "#64748b",
//     fontWeight: "600",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f8fafc",
//   },
//   errorTitle: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#0f172a",
//     marginBottom: 20,
//   },
//   backButton: {
//     backgroundColor: "#0f172a",
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   backButtonText: {
//     color: "#fff",
//     fontWeight: "700",
//   },
//   backLink: {
//     marginBottom: 20,
//     alignSelf: "flex-start",
//   },
//   backLinkText: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#64748b",
//   },

//   // POST CARD
//   postCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 24,
//     padding: 28,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     shadowColor: "#0f172a",
//     shadowOpacity: 0.08,
//     shadowRadius: 24,
//     shadowOffset: { width: 0, height: 10 },
//     elevation: 6,
//   },
//   postHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexWrap: "wrap",
//     gap: 12,
//   },
//   authorAvatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   authorAvatarFallback: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#0f172a",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   authorAvatarText: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#ffffff",
//   },
//   authorInfo: {
//     flex: 1,
//   },
//   authorName: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#0f172a",
//   },
//   postDate: {
//     marginTop: 2,
//     fontSize: 13,
//     color: "#94a3b8",
//     fontWeight: "500",
//   },
//   postManagementActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   editButton: {
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: "#f8fafc",
//   },
//   editButtonText: {
//     color: "#475569",
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   deletePostButton: {
//     borderWidth: 1,
//     borderColor: "#fee2e2",
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: "#fef2f2",
//   },
//   deletePostButtonText: {
//     color: "#ef4444",
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   // CONFIRM BOX
//   deleteConfirmBox: {
//     marginTop: 20,
//     padding: 20,
//     borderRadius: 16,
//     backgroundColor: "#fef2f2",
//     borderWidth: 1,
//     borderColor: "#fee2e2",
//   },
//   deleteConfirmTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#0f172a",
//   },
//   deleteConfirmMessage: {
//     marginTop: 8,
//     fontSize: 14,
//     lineHeight: 21,
//     color: "#64748b",
//   },
//   deleteConfirmActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 10,
//     marginTop: 16,
//   },
//   cancelDeleteButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     backgroundColor: "#fff",
//   },
//   cancelDeleteButtonText: {
//     color: "#475569",
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   confirmDeleteButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: "#ef4444",
//   },
//   confirmDeleteButtonText: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: 14,
//   },

//   // CATEGORY & TITLE
//   categoryBadge: {
//     alignSelf: "flex-start",
//     marginTop: 24,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     backgroundColor: "#0f172a",
//   },
//   categoryText: {
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: "800",
//     letterSpacing: 1,
//     textTransform: "uppercase",
//   },
//   postTitle: {
//     marginTop: 16,
//     fontSize: 32,
//     lineHeight: 42,
//     fontWeight: "900",
//     color: "#0f172a",
//     letterSpacing: -1,
//   },

//   // IMAGE & BODY
//   postImage: {
//     width: "100%",
//     height: 400,
//     borderRadius: 24,
//     marginBottom: 16,
//   },
//   postContentCard: {
//     backgroundColor: "#ffffff",
//     padding: 28,
//     marginBottom: 32,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     shadowColor: "#0f172a",
//     shadowOpacity: 0.06,
//     shadowRadius: 16,
//     shadowOffset: { width: 0, height: 6 },
//     elevation: 4,
//   },
//   postBody: {
//     fontSize: 17,
//     lineHeight: 28,
//     color: "#334155", // Slate-700 for high readability
//     fontWeight: "500",
//   },
//   postActions: {
//     marginTop: 32,
//     paddingTop: 24,
//     borderTopWidth: 1,
//     borderTopColor: "#f1f5f9",
//   },
//   likeButton: {
//     alignSelf: "flex-start",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 12,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     backgroundColor: "#f8fafc",
//   },
//   likedButton: {
//     borderColor: "#fecaca",
//     backgroundColor: "#fef2f2",
//   },
//   likeButtonText: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#475569",
//   },
//   likedButtonText: {
//     color: "#ef4444",
//   },

//   // COMMENTS SECTION
//   commentsSection: {
//     backgroundColor: "#ffffff",
//     borderRadius: 24,
//     padding: 28,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     shadowColor: "#0f172a",
//     shadowOpacity: 0.06,
//     shadowRadius: 16,
//     shadowOffset: { width: 0, height: 6 },
//     elevation: 4,
//   },
//   commentsTitle: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#0f172a",
//     marginBottom: 24,
//     letterSpacing: -0.5,
//   },
//   replyingBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#f1f5f9",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   replyingText: {
//     color: "#475569",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   cancelReplyText: {
//     color: "#ef4444",
//     fontSize: 13,
//     fontWeight: "800",
//   },
//   commentInputContainer: {
//     marginBottom: 28,
//   },
//   commentInput: {
//     minHeight: 100,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 16,
//     padding: 16,
//     textAlignVertical: "top",
//     fontSize: 15,
//     backgroundColor: "#f8fafc",
//     color: "#0f172a",
//     fontWeight: "500",
//   },
//   commentSubmitButton: {
//     alignSelf: "flex-end",
//     marginTop: 12,
//     backgroundColor: "#0f172a",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//     minWidth: 100,
//     alignItems: "center",
//   },
//   commentSubmitText: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: 14,
//   },
//   noCommentsText: {
//     textAlign: "center",
//     color: "#94a3b8",
//     paddingVertical: 30,
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   commentsList: {
//     gap: 16,
//   },
//   commentContainer: {
//     backgroundColor: "#f8fafc",
//     borderRadius: 16,
//     padding: 18,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   replyContainer: {
//     marginTop: 12,
//     marginLeft: 20,
//     backgroundColor: "#ffffff",
//     borderLeftWidth: 3,
//     borderLeftColor: "#0f172a",
//   },
//   commentHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   commentAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   commentAvatarFallback: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#e2e8f0",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   commentAvatarText: {
//     color: "#0f172a",
//     fontSize: 14,
//     fontWeight: "800",
//   },
//   commentAuthorArea: {
//     marginLeft: 12,
//   },
//   commentAuthor: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#0f172a",
//   },
//   commentDate: {
//     marginTop: 2,
//     fontSize: 11,
//     color: "#94a3b8",
//     fontWeight: "500",
//   },
//   commentText: {
//     marginTop: 12,
//     fontSize: 15,
//     lineHeight: 22,
//     color: "#334155",
//   },
//   commentActions: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     marginTop: 14,
//   },
//   actionPill: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: "#ffffff",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   actionPillDanger: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: "#fef2f2",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#fee2e2",
//   },
//   replyButton: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#475569",
//   },
//   deleteCommentButton: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#ef4444",
//   },
//   replies: {
//     marginTop: 12,
//   },

//   // WEB COMMENT DELETE MODAL
//   commentDeleteOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(15, 23, 42, 0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     zIndex: 1000,
//   },
//   commentDeleteBox: {
//     width: "100%",
//     maxWidth: 440,
//     backgroundColor: "#fff",
//     borderRadius: 24,
//     padding: 28,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 24,
//     shadowOffset: { width: 0, height: 10 },
//     elevation: 10,
//   },
//   commentDeleteTitle: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: "#0f172a",
//     letterSpacing: -0.5,
//   },
//   commentDeleteMessage: {
//     marginTop: 10,
//     fontSize: 15,
//     lineHeight: 22,
//     color: "#64748b",
//   },
//   commentDeleteActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 10,
//     marginTop: 24,
//   },
//   pressed: {
//     opacity: 0.7,
//     transform: [{ scale: 0.98 }],
//   },
// });
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

type User = {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  profileImage?: string;
};

type Comment = {
  _id: string;
  text: string;
  author: User;
  post: string | { _id?: string };
  parentComment?: string | null;
  createdAt: string;
};

type Post = {
  _id: string;
  title: string;
  body: string;
  category: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  author: User;
  createdAt: string;
  updatedAt: string;
};

type TokenPayload = {
  id?: string;
  userId?: string;
  _id?: string;
  exp?: number;
};

type LikeUpdate = {
  postId: string;
  likeCount: number;
  liked: boolean;
};

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // ============================================================
  // GET TOKEN
  // ============================================================
  const getToken = async () => {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem("token");
      }

      return await SecureStore.getItemAsync("token");
    } catch (error) {
      console.log("Get token error:", error);
      return null;
    }
  };

  // ============================================================
  // GET CURRENT USER
  // ============================================================
  const getCurrentUser = async () => {
    try {
      let userJson: string | null = null;

      if (Platform.OS === "web") {
        userJson = localStorage.getItem("user");
      } else {
        userJson = await SecureStore.getItemAsync("user");
      }

      if (userJson) {
        try {
          const user = JSON.parse(userJson);

          const userId =
            user?._id ||
            user?.id ||
            user?.userId ||
            user?.user?._id ||
            user?.user?.id;

          if (userId) {
            setCurrentUserId(String(userId));
            return;
          }
        } catch (error) {
          console.log("User JSON parse error:", error);
        }
      }

      const token = await getToken();

      if (token) {
        try {
          const decoded = jwtDecode<TokenPayload>(token);

          const userId = decoded.id || decoded.userId || decoded._id || null;

          if (userId) {
            setCurrentUserId(String(userId));
            return;
          }
        } catch (error) {
          console.log("JWT decode error:", error);
        }
      }

      setCurrentUserId(null);
    } catch (error) {
      console.log("Failed to get current user:", error);
      setCurrentUserId(null);
    }
  };

  // ============================================================
  // FETCH POST
  // ============================================================
  const fetchPost = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();

      const postData = data?.post || data;

      setPost(postData);
    } catch (error) {
      console.error("Fetch post error:", error);

      Alert.alert("Error", "Unable to load post.");
    }
  };

  // ============================================================
  // FETCH COMMENTS
  // ============================================================
  const fetchComments = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/api/comments/post/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();

      const commentList = Array.isArray(data)
        ? data
        : Array.isArray(data.comments)
          ? data.comments
          : [];

      const validComments = commentList.filter(
        (comment: Comment) =>
          comment && typeof comment === "object" && comment._id && comment.text,
      );

      setComments(validComments);
    } catch (error) {
      console.error("Fetch comments error:", error);
    }
  };

  // ============================================================
  // FETCH LIKE INFO
  // ============================================================
  const fetchLikeInfo = async () => {
    if (!id) return;

    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/likes/${id}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (!response.ok) return;

      const data = await response.json();

      setLiked(Boolean(data.liked));
      setLikeCount(Number(data.likeCount || 0));
    } catch (error) {
      console.error("Fetch like info error:", error);
    }
  };

  // ============================================================
  // LOAD PAGE
  // ============================================================
  const loadPage = async () => {
    try {
      setLoading(true);

      await Promise.all([
        getCurrentUser(),
        fetchPost(),
        fetchComments(),
        fetchLikeInfo(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [id]);

  // ============================================================
  // SOCKET - NEW COMMENT + LIKE UPDATE
  // ============================================================
  useEffect(() => {
    if (!id) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Join this post's Socket.IO room
    socket.emit("join-post", id);

    console.log("JOINED POST ROOM:", `post:${id}`);

    // ==========================================================
    // NEW COMMENT
    // ==========================================================
    const handleNewComment = (newComment: Comment) => {
      if (!newComment || !newComment._id) return;

      const commentPostId =
        typeof newComment.post === "object"
          ? newComment.post?._id
          : newComment.post;

      if (String(commentPostId) !== String(id)) return;

      setComments((previous) => {
        const exists = previous.some(
          (comment) => comment._id === newComment._id,
        );

        if (exists) return previous;

        return [newComment, ...previous];
      });
    };

    // ==========================================================
    // REAL-TIME LIKE UPDATE
    // ==========================================================
    const handlePostLiked = (likeUpdate: LikeUpdate) => {
      if (!likeUpdate) return;

      if (String(likeUpdate.postId) !== String(id)) {
        return;
      }

      console.log("REAL-TIME LIKE UPDATE:", likeUpdate);

      // Update only the count here.
      //
      // We do NOT change `liked` because this event may have
      // been triggered by another user.
      //
      // The user who clicked Like already receives their own
      // `liked` value from the POST response.
      setLikeCount(Number(likeUpdate.likeCount || 0));
    };

    socket.on("new-comment", handleNewComment);

    socket.on("post-liked", handlePostLiked);

    return () => {
      socket.off("new-comment", handleNewComment);

      socket.off("post-liked", handlePostLiked);
    };
  }, [id]);

  // ============================================================
  // REFRESH WHEN SCREEN GETS FOCUS
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      if (!id) return;

      getCurrentUser();
      fetchPost();
      fetchComments();
      fetchLikeInfo();
    }, [id]),
  );

  // ============================================================
  // REFRESH
  // ============================================================
  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        getCurrentUser(),
        fetchPost(),
        fetchComments(),
        fetchLikeInfo(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // ============================================================
  // LIKE POST
  // ============================================================
  const handleLike = async () => {
    if (!id || liking) return;

    try {
      setLiking(true);

      const token = await getToken();

      if (!token) {
        Alert.alert("Login Required", "Please login to like this post.");
        return;
      }

      const response = await fetch(`${API_URL}/api/likes/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Unable to update like.");
        return;
      }

      setLiked(Boolean(data.liked));

      setLikeCount(Number(data.likeCount || 0));
    } catch (error) {
      console.error("Like error:", error);

      Alert.alert("Error", "Something went wrong while updating like.");
    } finally {
      setLiking(false);
    }
  };

  // ============================================================
  // ADD COMMENT
  // ============================================================
  const handleAddComment = async () => {
    if (!id) return;

    const text = commentText.trim();

    if (!text) {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }

    try {
      setSubmittingComment(true);

      const token = await getToken();

      if (!token) {
        Alert.alert("Login Required", "Please login to comment.");
        return;
      }

      const response = await fetch(`${API_URL}/api/comments/post/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          parentComment: replyTo?._id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Unable to add comment.");
        return;
      }

      const newComment = data?.comment;

      if (!newComment || !newComment._id) {
        console.error("Invalid comment response:", data);

        Alert.alert("Error", "Invalid comment response from server.");

        return;
      }

      setComments((previous) => {
        const exists = previous.some(
          (comment) => comment._id === newComment._id,
        );

        if (exists) return previous;

        return [newComment, ...previous];
      });

      setCommentText("");
      setReplyTo(null);
    } catch (error) {
      console.error("Add comment error:", error);

      Alert.alert("Error", "Something went wrong while adding comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // ============================================================
  // ACTUAL DELETE COMMENT REQUEST
  // ============================================================
  const deleteCommentRequest = async (commentId: string) => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Login Required", "Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Unable to delete comment.");
        return;
      }

      setComments((previous) =>
        previous.filter(
          (comment) =>
            comment._id !== commentId &&
            String(comment.parentComment) !== String(commentId),
        ),
      );

      setCommentToDelete(null);
    } catch (error) {
      console.error("Delete comment error:", error);

      Alert.alert("Error", "Something went wrong while deleting comment.");
    }
  };

  // ============================================================
  // DELETE COMMENT
  // ============================================================
  const handleDeleteComment = (commentId: string) => {
    if (!commentId) return;

    if (Platform.OS === "web") {
      setCommentToDelete(commentId);
      return;
    }

    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCommentRequest(commentId),
        },
      ],
    );
  };

  // ============================================================
  // EDIT POST
  // ============================================================
  const handleEditPost = () => {
    if (!post?._id) return;

    router.push({
      pathname: "/edit-post",
      params: {
        id: String(post._id),
      },
    });
  };

  // ============================================================
  // ACTUAL DELETE POST REQUEST
  // ============================================================
  const deletePostRequest = async () => {
    if (!post?._id) return;

    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Login Required", "Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Unable to delete post.");
        return;
      }

      setShowDeleteConfirm(false);

      if (Platform.OS === "web") {
        window.alert("Post deleted successfully.");

        router.replace("/home");
      } else {
        Alert.alert("Success", "Post deleted successfully.", [
          {
            text: "OK",
            onPress: () => router.replace("/home"),
          },
        ]);
      }
    } catch (error) {
      console.error("DELETE FRONTEND ERROR:", error);

      Alert.alert("Error", "Something went wrong while deleting the post.");
    }
  };

  // ============================================================
  // DELETE POST BUTTON
  // ============================================================
  const handleDeletePost = async () => {
    if (!post?._id) return;

    if (Platform.OS === "web") {
      setShowDeleteConfirm(true);
      return;
    }

    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deletePostRequest,
        },
      ],
    );
  };

  // ============================================================
  // COMMENTS
  // ============================================================
  const getReplies = (commentId: string) => {
    return comments.filter(
      (comment) => String(comment.parentComment) === String(commentId),
    );
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((previous) => ({
      ...previous,
      [commentId]: !previous[commentId],
    }));
  };

  // ============================================================
  // RENDER COMMENT
  // ============================================================
  const renderCommentItem = (comment: Comment, isReply = false) => {
    if (!comment || !comment._id) {
      return null;
    }

    const replies = getReplies(comment._id);

    const showReplies = expandedReplies[comment._id];

    const commentAuthorId =
      comment.author?._id ||
      comment.author?.id ||
      comment.author?.userId ||
      null;

    const isCommentOwner =
      Boolean(commentAuthorId) &&
      Boolean(currentUserId) &&
      String(commentAuthorId) === String(currentUserId);

    return (
      <View
        key={String(comment._id)}
        style={[styles.commentContainer, isReply && styles.replyContainer]}
      >
        <View style={styles.commentHeader}>
          {comment.author?.profileImage ? (
            <Image
              source={{
                uri: comment.author.profileImage,
              }}
              style={styles.commentAvatar}
            />
          ) : (
            <View style={styles.commentAvatarFallback}>
              <Text style={styles.commentAvatarText}>
                {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}

          <View style={styles.commentAuthorArea}>
            <Text style={styles.commentAuthor}>
              {comment.author?.name || "Unknown User"}
            </Text>

            <Text style={styles.commentDate}>
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString()
                : ""}
            </Text>
          </View>
        </View>

        <Text style={styles.commentText}>{comment.text}</Text>

        <View style={styles.commentActions}>
          {!isReply && (
            <Pressable
              onPress={() => setReplyTo(comment)}
              style={styles.actionPill}
            >
              <Text style={styles.replyButton}>Reply</Text>
            </Pressable>
          )}

          {replies.length > 0 && (
            <Pressable
              onPress={() => toggleReplies(comment._id)}
              style={styles.actionPill}
            >
              <Text style={styles.replyButton}>
                {showReplies
                  ? "Hide Replies"
                  : `View Replies (${replies.length})`}
              </Text>
            </Pressable>
          )}

          {isCommentOwner && (
            <Pressable
              onPress={() => handleDeleteComment(comment._id)}
              style={styles.actionPillDanger}
            >
              <Text style={styles.deleteCommentButton}>Delete</Text>
            </Pressable>
          )}
        </View>

        {showReplies && replies.length > 0 && (
          <View style={styles.replies}>
            {replies.map((reply) => renderCommentItem(reply, true))}
          </View>
        )}
      </View>
    );
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f172a" />

        <Text style={styles.loadingText}>Loading post...</Text>
      </View>
    );
  }

  // ============================================================
  // POST NOT FOUND
  // ============================================================
  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Post not found</Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    );
  }

  // ============================================================
  // OWNER CHECK
  // ============================================================
  const postAuthorId =
    post.author?._id || post.author?.id || post.author?.userId || null;

  const isPostOwner =
    Boolean(currentUserId) &&
    Boolean(postAuthorId) &&
    String(postAuthorId) === String(currentUserId);

  const topLevelComments = comments.filter(
    (comment) => comment && comment._id && !comment.parentComment,
  );

  // ============================================================
  // UI
  // ============================================================
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#0f172a"
          />
        }
      >
        {/* POST */}
        <View style={styles.postCard}>
          {/* AUTHOR */}
          <View style={styles.postHeader}>
            {post.author?.profileImage ? (
              <Image
                source={{
                  uri: post.author.profileImage,
                }}
                style={styles.authorAvatar}
              />
            ) : (
              <View style={styles.authorAvatarFallback}>
                <Text style={styles.authorAvatarText}>
                  {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
            )}

            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>
                {post.author?.name || "Unknown User"}
              </Text>

              <Text style={styles.postDate}>
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : ""}
              </Text>
            </View>

            {/* EDIT / DELETE */}
            {isPostOwner && (
              <View style={styles.postManagementActions}>
                <Pressable onPress={handleEditPost} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>

                <Pressable
                  onPress={handleDeletePost}
                  style={styles.deletePostButton}
                >
                  <Text style={styles.deletePostButtonText}>Delete</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* WEB POST DELETE CONFIRMATION */}
          {showDeleteConfirm && Platform.OS === "web" && (
            <View style={styles.deleteConfirmBox}>
              <Text style={styles.deleteConfirmTitle}>Delete Post?</Text>

              <Text style={styles.deleteConfirmMessage}>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </Text>

              <View style={styles.deleteConfirmActions}>
                <Pressable
                  onPress={() => setShowDeleteConfirm(false)}
                  style={styles.cancelDeleteButton}
                >
                  <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={deletePostRequest}
                  style={styles.confirmDeleteButton}
                >
                  <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* CATEGORY */}
          {post.category ? (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{post.category}</Text>
            </View>
          ) : null}

          {/* TITLE */}
          <Text style={styles.postTitle}>{post.title}</Text>
        </View>

        {/* FULL WIDTH IMAGE */}
        {post.image ? (
          <Image
            source={{
              uri: post.image,
            }}
            style={styles.postImage}
            resizeMode="cover"
          />
        ) : null}

        {/* POST CONTENT */}
        <View style={styles.postContentCard}>
          <Text style={styles.postBody}>{post.body}</Text>

          {/* LIKE */}
          <View style={styles.postActions}>
            <Pressable
              onPress={handleLike}
              disabled={liking}
              style={({ pressed }) => [
                styles.likeButton,
                liked && styles.likedButton,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.likeButtonText, liked && styles.likedButtonText]}
              >
                {liked ? "♥ Liked" : "♡ Like"} {likeCount}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* COMMENTS */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            Comments ({topLevelComments.length})
          </Text>

          {/* REPLYING */}
          {replyTo && (
            <View style={styles.replyingBox}>
              <Text style={styles.replyingText}>
                Replying to {replyTo.author?.name || "Unknown User"}
              </Text>

              <Pressable onPress={() => setReplyTo(null)}>
                <Text style={styles.cancelReplyText}>Cancel</Text>
              </Pressable>
            </View>
          )}

          {/* COMMENT INPUT */}
          <View style={styles.commentInputContainer}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder={
                replyTo ? "Write a reply..." : "Share your thoughts..."
              }
              placeholderTextColor="#94a3b8"
              multiline
              style={styles.commentInput}
            />

            <Pressable
              onPress={handleAddComment}
              disabled={submittingComment}
              style={({ pressed }) => [
                styles.commentSubmitButton,
                pressed && styles.pressed,
              ]}
            >
              {submittingComment ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.commentSubmitText}>
                  {replyTo ? "Reply" : "Comment"}
                </Text>
              )}
            </Pressable>
          </View>

          {/* COMMENTS LIST */}
          {topLevelComments.length === 0 ? (
            <Text style={styles.noCommentsText}>
              No comments yet. Be the first to comment.
            </Text>
          ) : (
            <View style={styles.commentsList}>
              {topLevelComments.map((comment) => renderCommentItem(comment))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* WEB COMMENT DELETE CONFIRMATION */}
      {commentToDelete && Platform.OS === "web" && (
        <View style={styles.commentDeleteOverlay}>
          <View style={styles.commentDeleteBox}>
            <Text style={styles.commentDeleteTitle}>Delete Comment?</Text>

            <Text style={styles.commentDeleteMessage}>
              Are you sure you want to delete this comment?
            </Text>

            <View style={styles.commentDeleteActions}>
              <Pressable
                onPress={() => setCommentToDelete(null)}
                style={styles.cancelDeleteButton}
              >
                <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  const commentId = commentToDelete;

                  setCommentToDelete(null);

                  deleteCommentRequest(commentId);
                }}
                style={styles.confirmDeleteButton}
              >
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    padding: 24,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    paddingBottom: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },

  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#64748b",
    fontWeight: "600",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  backLink: {
    marginBottom: 20,
    alignSelf: "flex-start",
  },

  backLinkText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748b",
  },

  postCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 6,
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },

  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  authorAvatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },

  authorAvatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },

  authorInfo: {
    flex: 1,
  },

  authorName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },

  postDate: {
    marginTop: 2,
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },

  postManagementActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  editButton: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f8fafc",
  },

  editButtonText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
  },

  deletePostButton: {
    borderWidth: 1,
    borderColor: "#fee2e2",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fef2f2",
  },

  deletePostButtonText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "700",
  },

  deleteConfirmBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
  },

  deleteConfirmTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },

  deleteConfirmMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#64748b",
  },

  deleteConfirmActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },

  cancelDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },

  cancelDeleteButtonText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 14,
  },

  confirmDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ef4444",
  },

  confirmDeleteButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#0f172a",
  },

  categoryText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  postTitle: {
    marginTop: 16,
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
  },

  postImage: {
    width: "100%",
    height: 400,
    borderRadius: 24,
    marginBottom: 16,
  },

  postContentCard: {
    backgroundColor: "#ffffff",
    padding: 28,
    marginBottom: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  postBody: {
    fontSize: 17,
    lineHeight: 28,
    color: "#334155",
    fontWeight: "500",
  },

  postActions: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  likeButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
  },

  likedButton: {
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
  },

  likeButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#475569",
  },

  likedButtonText: {
    color: "#ef4444",
  },

  commentsSection: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  commentsTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 24,
    letterSpacing: -0.5,
  },

  replyingBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  replyingText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },

  cancelReplyText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "800",
  },

  commentInputContainer: {
    marginBottom: 28,
  },

  commentInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 16,
    textAlignVertical: "top",
    fontSize: 15,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    fontWeight: "500",
  },

  commentSubmitButton: {
    alignSelf: "flex-end",
    marginTop: 12,
    backgroundColor: "#0f172a",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
  },

  commentSubmitText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  noCommentsText: {
    textAlign: "center",
    color: "#94a3b8",
    paddingVertical: 30,
    fontSize: 14,
    fontWeight: "600",
  },

  commentsList: {
    gap: 16,
  },

  commentContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  replyContainer: {
    marginTop: 12,
    marginLeft: 20,
    backgroundColor: "#ffffff",
    borderLeftWidth: 3,
    borderLeftColor: "#0f172a",
  },

  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  commentAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },

  commentAvatarText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800",
  },

  commentAuthorArea: {
    marginLeft: 12,
  },

  commentAuthor: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },

  commentDate: {
    marginTop: 2,
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },

  commentText: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: "#334155",
  },

  commentActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },

  actionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  actionPillDanger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },

  replyButton: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
  },

  deleteCommentButton: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ef4444",
  },

  replies: {
    marginTop: 12,
  },

  commentDeleteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000,
  },

  commentDeleteBox: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },

  commentDeleteTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },

  commentDeleteMessage: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
  },

  commentDeleteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 24,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
