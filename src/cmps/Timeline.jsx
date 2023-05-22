import Skeleton from 'react-loading-skeleton'
import usePhotos from '../hooks/usePhotos'
import Post from './post/Post'

const SKELETON_COUNT = 4

export default function Timeline() {
	const { photos } = usePhotos()

	return (
		<div className="container">
			{!photos ? (
				<Skeleton count={SKELETON_COUNT} width={450} height={600} className="mb-5" />
			) : photos?.length > 0 ? (
				photos.map((content) => <Post key={content.docId} content={content} />)
			) : (
				<p className="text-center text-2xl">Follow people to see photos!</p>
			)}
		</div>
	)
}
