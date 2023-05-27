import MainWrapper from "../cmps/MainWrapper";
import Room from "../cmps/Room";


export default function PicClash() {
  return (
    <MainWrapper>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">PicClash - Work in Progress</h1>
        <Room />
      </div>
    </MainWrapper>
  )
}
