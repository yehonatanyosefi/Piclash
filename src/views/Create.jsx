import MainWrapper from "../cmps/MainWrapper";
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { createPost } from "../services/user.service";
import { useNavigate } from "react-router";
import { HOME } from "../routes";

export default function Create() {
  const navigate = useNavigate()
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [caption, setCaption] = useState('')
  const [imgUrl, setimgUrl] = useState('')
  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!loggedInUser) return
    await createPost(loggedInUser, caption, imgUrl)
    navigate(HOME)
  }
  return (
    <MainWrapper>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Create</h1>
        <form onSubmit={handleSubmit} method="POST">
          <input type="text" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
          <input type="text" placeholder="Image URL" value={imgUrl} onChange={(e) => setimgUrl(e.target.value)} />
          <button type="submit">Create</button>
        </form>
      </div>
    </MainWrapper>
  )
}
