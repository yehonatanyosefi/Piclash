import { useState } from "react"
import PropTypes from 'prop-types'

export default function AddComment({addComment, commentInput}) {
     const [comment, setComment] = useState('')
       const handleAddComments = (ev) => { //TODO make it add comment
         ev.preventDefault()
         addComment(comment)
         setComment('')
         commentInput.current.focus()
       }
  return (
     <div className="border-t border-gray-primary">
      <form className="flex justify-between pl-4 pr-4" method="POST" onSubmit={(ev) => handleAddComments(ev)}>
         <input
            aria-label="Add a comment"
            autoComplete="off"
            className="text-sm text-gray-base w-full mr-3 py-5 px-4"
            type="text"
            name="add-comment"
            placeholder="Add a comment..."
            value={comment}
            onChange={({target}) => setComment(target.value)}
            ref={commentInput}
         />
         <button
            className={`text-sm font-bold text-blue-medium ${!comment && 'opacity-25'}`}
            type="submit"
            disabled={comment.length < 1}
         >
            Post
         </button>
      </form>
     </div>
  )
}

AddComment.propTypes = {
   addComment: PropTypes.func.isRequired,
   commentInput: PropTypes.object
}