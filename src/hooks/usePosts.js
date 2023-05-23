import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getUserById, getPosts } from "../services/user.service"

export default function usePosts() {
     const [posts, setPosts] = useState(null)
     const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
     
     useEffect(() => {
          async function getTimelinePosts() {
               if (!loggedInUser) return null
               const { following, userId } = loggedInUser
               let followedUserPosts = []
               if (following.length > 0) {
                    followedUserPosts = await getPosts(userId, following)
               }
               setPosts(followedUserPosts)
          }
          getTimelinePosts()
     },[loggedInUser])

     return { posts }
}