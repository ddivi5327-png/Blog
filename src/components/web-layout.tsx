import { Link, router, usePathname } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import API_URL from "../api/api";
import socket from "../socket/socket";

type WebLayoutProps = {
  children: React.ReactNode;
};

type StoredUser = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  profileImageWidth?: number | null;
  profileImageHeight?: number | null;
};

type NotificationItem = {
  _id: string;
  type: "comment" | "like";
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function WebLayout({ children }: WebLayoutProps) {
  const pathname = usePathname();

  const isPublicPage =
    pathname === "/" || pathname === "/login" || pathname === "/register";

  const [user, setUser] = useState<StoredUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  /* ========================================================== */
  /* LOAD USER                                                   */
  /* ========================================================== */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();

        if (!token) {
          setUser(null);
          return;
        }

        if (!isTokenValid(token)) {
          if (Platform.OS === "web") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } else {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("user");
          }

          setUser(null);

          if (pathname !== "/") {
            router.replace("/");
          }

          return;
        }

        let userJson: string | null = null;

        if (Platform.OS === "web") {
          userJson = localStorage.getItem("user");
        } else {
          userJson = await SecureStore.getItemAsync("user");
        }

        if (!userJson) {
          setUser(null);

          if (pathname !== "/") {
            router.replace("/");
          }

          return;
        }

        const storedUser: StoredUser = JSON.parse(userJson);

        setUser(storedUser);

        if (pathname === "/") {
          router.replace("/home");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      }
    };

    loadUser();
  }, [pathname]);

  /* ========================================================== */
  /* TOKEN                                                       */
  /* ========================================================== */

  const getToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    }

    return await SecureStore.getItemAsync("token");
  };

  const isTokenValid = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload.exp) {
        return false;
      }

      return payload.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  /* ========================================================== */
  /* PAGE TITLE                                                  */
  /* ========================================================== */

  const getPageTitle = () => {
    switch (pathname) {
      case "/home":
        return "Home";

      case "/profile":
        return "Profile";

      case "/bookmarks":
        return "Bookmarks";

      case "/edit-profile":
        return "Edit Profile";

      case "/create-post":
        return "Create Blog";

      case "/edit-post":
        return "Edit Post";

      case "/post-detail":
        return "Post Details";

      case "/notifications":
        return "Notifications";

      case "/login":
        return "Login";

      case "/register":
        return "Register";

      default:
        return "Blog Posts";
    }
  };

  /* ========================================================== */
  /* ACTIVE NAV                                                  */
  /* ========================================================== */

  const isActive = (path: string) => pathname === path;

  /* ========================================================== */
  /* LOAD NOTIFICATIONS                                          */
  /* ========================================================== */

  const loadNotifications = async () => {
    try {
      const token = await getToken();

      if (!token) {
        setNotifications([]);
        return;
      }

      setLoadingNotifications(true);

      const response = await fetch(`${API_URL}/api/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Notification API error:", data.message);

        setNotifications([]);
        return;
      }

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Load notifications error:", error);

      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  /* ========================================================== */
  /* LOAD NOTIFICATIONS FROM API                                */
  /* ========================================================== */

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    loadNotifications();
  }, [user, pathname]);

  /* ========================================================== */
  /* REAL-TIME NOTIFICATIONS                                    */
  /* ========================================================== */

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    /* -------------------------------------------------------- */
    /* RECEIVE NEW NOTIFICATION                                  */
    /* -------------------------------------------------------- */

    // const handleNewNotification = (notification: NotificationItem) => {
    //   console.log("WEB NEW NOTIFICATION:", notification);

    //   setNotifications((previousNotifications) => {
    //     const alreadyExists = previousNotifications.some(
    //       (item) => String(item._id) === String(notification._id),
    //     );

    //     if (alreadyExists) {
    //       return previousNotifications;
    //     }

    //     return [notification, ...previousNotifications];
    //   });
    // };
    const handleNewNotification = (notification: NotificationItem) => {
      console.log("WEB NEW NOTIFICATION:", notification);

      setNotifications((previousNotifications) => {
        return [
          {
            ...notification,
            isRead: false,
          },
          ...previousNotifications,
        ];
      });
    };
    /* -------------------------------------------------------- */
    /* SOCKET CONNECT                                             */
    /* -------------------------------------------------------- */

    const handleConnect = () => {
      console.log("WEB SOCKET CONNECTED:", socket.id);

      socket.emit("join-user", user.id);

      console.log("WEB JOINED USER ROOM:", user.id);
    };

    /* -------------------------------------------------------- */
    /* LISTENERS                                                  */
    /* -------------------------------------------------------- */

    socket.on("connect", handleConnect);

    socket.on("new-notification", handleNewNotification);

    /* -------------------------------------------------------- */
    /* CONNECT SOCKET                                             */
    /* -------------------------------------------------------- */

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    /* -------------------------------------------------------- */
    /* CLEANUP                                                   */
    /* -------------------------------------------------------- */

    return () => {
      socket.off("connect", handleConnect);

      socket.off("new-notification", handleNewNotification);
    };
  }, [user]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  /* ========================================================== */
  /* LOGOUT                                                      */
  /* ========================================================== */

  const handleLogout = async () => {
    if (Platform.OS !== "web") {
      return;
    }

    const confirmed = window.confirm("Do you want to logout?");

    if (!confirmed) {
      return;
    }

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      socket.disconnect();

      setUser(null);
      setNotifications([]);

      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /* ========================================================== */
  /* PROFILE DATA                                                */
  /* ========================================================== */

  const profileImage = user?.profileImage || "";

  const profileLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  if (loadingNotifications && user && notifications.length === 0) {
    // Keep page visible
  }

  /* ========================================================== */
  /* PUBLIC PAGES                                                */
  /* ========================================================== */

  if (isPublicPage) {
    return <>{children}</>;
  }

  /* ========================================================== */
  /* UI                                                           */
  /* ========================================================== */

  return (
    <View style={styles.screen}>
      {/* ====================================================== */}
      {/* LEFT SIDEBAR                                            */}
      {/* ====================================================== */}

      <View style={styles.sidebar}>
        <Text style={styles.logo}>Blog Posts</Text>

        <View style={styles.menuSection}>
          <Link
            href="/home"
            style={[styles.navLink, isActive("/home") && styles.activeNavLink]}
          >
            <Text style={styles.navIcon}>🏠</Text>

            <Text
              style={[
                styles.navText,
                isActive("/home") && styles.activeNavText,
              ]}
            >
              Home
            </Text>
          </Link>

          <Link
            href="/profile"
            style={[
              styles.navLink,
              isActive("/profile") && styles.activeNavLink,
            ]}
          >
            <Text style={styles.navIcon}>👤</Text>

            <Text
              style={[
                styles.navText,
                isActive("/profile") && styles.activeNavText,
              ]}
            >
              Profile
            </Text>
          </Link>

          <Link
            href="/bookmarks"
            style={[
              styles.navLink,
              isActive("/bookmarks") && styles.activeNavLink,
            ]}
          >
            <Text style={styles.navIcon}>🔖</Text>

            <Text
              style={[
                styles.navText,
                isActive("/bookmarks") && styles.activeNavText,
              ]}
            >
              Bookmarks
            </Text>
          </Link>

          <Pressable
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/create-post")}
          >
            <Text style={styles.createIcon}>+</Text>

            <Text style={styles.createText}>Create Blog</Text>
          </Pressable>
        </View>

        <View style={styles.spacer} />

        <View style={styles.menuSection}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutSidebarButton,
              pressed && styles.pressed,
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutSidebarIcon}>🚪</Text>

            <Text style={styles.logoutSidebarText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      {/* ====================================================== */}
      {/* RIGHT SIDE                                              */}
      {/* ====================================================== */}

      <View style={styles.mainArea}>
        {/* ==================================================== */}
        {/* TOP BAR                                                */}
        {/* ==================================================== */}

        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>{getPageTitle()}</Text>

          <View style={styles.topBarRight}>
            {/* ================================================ */}
            {/* NOTIFICATION BUTTON                               */}
            {/* ================================================ */}

            <Pressable
              style={({ pressed }) => [
                styles.notificationButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/notifications")}
            >
              <Text style={styles.notificationIcon}>🔔</Text>

              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* ================================================ */}
            {/* PROFILE BUTTON                                    */}
            {/* ================================================ */}

            <Pressable
              style={({ pressed }) => [
                styles.profileButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/profile")}
            >
              <View style={styles.profileAvatar}>
                {profileImage ? (
                  <Image
                    source={{
                      uri: profileImage,
                    }}
                    style={styles.profileAvatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.profileAvatarText}>{profileLetter}</Text>
                )}
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.name || "User"}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ==================================================== */}
        {/* PAGE CONTENT                                           */}
        {/* ==================================================== */}

        <View style={styles.pageContent}>{children}</View>
      </View>
    </View>
  );
}

/* ============================================================ */
/* STYLES                                                        */
/* ============================================================ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    minHeight: "100vh" as any,
  },

  /* ======================================================== */
  /* SIDEBAR                                                    */
  /* ======================================================== */

  sidebar: {
    position: "fixed" as any,
    left: 0,
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#ffffff",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    zIndex: 100,
  },

  logo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
    marginBottom: 40,
    marginLeft: 4,
  },

  menuSection: {
    width: "100%",
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 12,
  },

  navLink: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
    textDecorationLine: "none" as any,
  },

  activeNavLink: {
    backgroundColor: "#f1f5f9",
  },

  navIcon: {
    width: 24,
    fontSize: 16,
    textAlign: "center",
  },

  navText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  activeNavText: {
    color: "#0f172a",
    fontWeight: "800",
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    gap: 6,
    shadowColor: "#0f172a",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  createIcon: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "800",
  },

  createText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  spacer: {
    flex: 1,
  },

  logoutSidebarButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  logoutSidebarIcon: {
    width: 24,
    fontSize: 16,
    textAlign: "center",
  },

  logoutSidebarText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 12,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
    marginTop: 16,
  },

  footerText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: "600",
  },

  /* ======================================================== */
  /* MAIN AREA                                                  */
  /* ======================================================== */

  mainArea: {
    flex: 1,
    marginLeft: 260,
    minHeight: "100vh" as any,
    backgroundColor: "#f8fafc",
  },

  /* ======================================================== */
  /* TOP BAR                                                    */
  /* ======================================================== */

  topBar: {
    position: "sticky" as any,
    top: 0,
    zIndex: 50,
    height: 72,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },

  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  /* ======================================================== */
  /* NOTIFICATION                                               */
  /* ======================================================== */

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  notificationIcon: {
    fontSize: 18,
  },

  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  notificationBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "900",
  },

  /* ======================================================== */
  /* PROFILE                                                     */
  /* ======================================================== */

  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  profileAvatarImage: {
    width: "100%",
    height: "100%",
  },

  profileAvatarText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  profileInfo: {
    marginLeft: 12,
    maxWidth: 140,
  },

  profileName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },

  profileRole: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },

  /* ======================================================== */
  /* PAGE CONTENT                                               */
  /* ======================================================== */

  pageContent: {
    flex: 1,
    minHeight: "calc(100vh - 72px)" as any,
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});
