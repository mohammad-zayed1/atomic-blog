import { createContext, useContext, useMemo, useState } from "react";

import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1- create new context
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  const value = useMemo(()=>{
    return{
      posts: searchedPosts,
      onClearPosts: handleClearPosts,
      onAddPost: handleAddPost,
      searchQuery,
      setSearchQuery,
    }
  },[searchedPosts , searchQuery])

  return (
    // 2- provide value to child component's
    <PostContext.Provider
      value={value}
    >
      {children}
    </PostContext.Provider>
  );
}

// custom hook
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("Posts Context was used outside of the PostProvider");
  return context;
}

export { PostProvider, usePosts };
