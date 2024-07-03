import { Container, useColorModeValue } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
// import CreatePost from "./components/CreatePost";
import SearchPage from "./pages/SearchPage";

import ChatPage from "./pages/ChatPage";
import LanguageSwitcher from "./components/LanguageSwitcher";
function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container bg={useColorModeValue("white", "#181818")} p={6} maxW="620px" borderRadius={20}>
      <Header />
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />}></Route>
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />}></Route>
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}></Route>
        <Route path="/search" element={<SearchPage />}></Route>
        <Route
          path="/:username"
          element={
            user ? (
              <>
                <UserPage />
              </>
            ) : (
              <UserPage />
            )
          }
        ></Route>
        <Route path="/:username/post/:pid" element={<PostPage />}></Route>
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />}></Route>
      </Routes>
    </Container>
  );
}

export default App;
