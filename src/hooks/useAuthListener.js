import { useState, useEffect, useContext } from "react"

const AUTH_KEY = 'authUser'
export default function useAuthListener() {
     const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')))
     const { firebase } = useContext(FirebaseContext)
     useEffect(() => {
          const listener = firebase.auth().onAuthStateChanged((authUser) => {
               if (authUser) {
                    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser))
                    setUser(authUser)
               } else {
                    localStorage.removeItem(AUTH_KEY)
                    setUser(null)
               }
          })
          return () => listener()
     }, [firebase])
     return { user }
}
