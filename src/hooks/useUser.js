import { useState, useEffect, useContext } from "react"
import userContext from "../context/user"

export default function useUser() {
     const [activeUser, setActiveUser] = useState(null)
     const { user } = useContext(userContext)
     useEffect(() => {
          if (user?.uid) {
               (async function getUserObjByUserId() {
               const [response] = await getUserById(user.uid)
               setActiveUser(response)
               })()
          }
     }, [user])
}
