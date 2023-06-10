import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getUserById,  } from "../services/user.service"
import { postService } from "../services/post.service"

export default function usePosts() {
     const [posts, setPosts] = useState(null)
     const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
     
     useEffect(() => {
          async function getTimelinePosts() {
               if (!loggedInUser) return null
               const { following, userId } = loggedInUser
               let followedUserPosts = []
               if (following.length > 0) {
                    followedUserPosts = await postService.getPosts(userId, following)
               }
               setPosts(followedUserPosts)
          }
          getTimelinePosts()
     },[loggedInUser])

     return { posts }
}