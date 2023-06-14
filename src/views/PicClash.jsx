import MainWrapper from '../cmps/MainWrapper'
import Room from '../cmps/room/Room'

export default function PicClash() {
	return (
		<MainWrapper>
			<div className="flex flex-col items-center justify-center mt-20">
				<h1 className="text-4xl font-bold">PicClash</h1>
				<Room />
			</div>
		</MainWrapper>
	)
}
