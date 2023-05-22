import PropTypes from 'prop-types'
import { useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'

export default function Suggestions({userId}) {
  const [suggestedProfiles, setSuggestedProfiles] = useState(null)
  
  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(userId)
      setSuggestedProfiles(response)
    }
    if (userId) {
      suggestedProfiles()
    }
  }, [userId])

  if (!suggestedProfiles) {
    return (
      <Skeleton count={1} height={150} className="mt-5" />
    )
  } else if (suggestedProfiles.length > 0) {
    return (
      <div className="rounded flex flex-col">
        <div className="text-sm flex items-center align-items justify-between mb-2">
          <p className="font-bold text-gray-base">Suggestions for you</p>
        </div>
      </div>
    )
  } else return null
}

Suggestions.propTypes = {
  userId: PropTypes.string.isRequired
}
