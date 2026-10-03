// import { Stack } from "expo-router";

// export default function WebLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//       }}
//     />
//   );
// }
import { Stack } from "expo-router";
import WebLayout from "../components/web-layout";

export default function WebRootLayout() {
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
