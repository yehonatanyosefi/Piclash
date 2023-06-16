import Skeleton from 'react-loading-skeleton'
import usePosts from '../hooks/usePosts'
import Post from './post/Post'

const SKELETON_COUNT = 4

export default function Timeline() {
	const { posts } = usePosts()

	return (
		<div className="container max-w-xl rounded col-span-4">
			{!posts ? (
				<Skeleton count={SKELETON_COUNT} width={576} height={700} className="mb-5" />
			) : posts?.length > 0 ? (
				posts.map((post) => <Post key={post.docId} post={post} />)
			) : (
				<p className="text-center text-2xl">Follow people to see posts!</p>
			)}
		</div>
	)
}
