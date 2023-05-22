import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getUserById, getPhotos } from "../services/user.service"

export default function usePhotos() {
     const [photos, setPhotos] = useState(null)
     const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
     
     useEffect(() => {
          async function getTimelinePhotos() {
               if (!loggedInUser) return null
               const { following, userId } = loggedInUser
               let followedUserPhotos = []
               if (following.length > 0) {
                    followedUserPhotos = await getPhotos(userId, following)
               }
               setPhotos(followedUserPhotos)
          }
          getTimelinePhotos()
     },[loggedInUser])

     return { photos }
}