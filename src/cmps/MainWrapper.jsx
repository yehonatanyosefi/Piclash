import Sidebar from "./Sidebar"
export default function MainWrapper({children}) { //TODO fix progress bar
  return (
		<div className="grid grid-cols-[244px_minmax(500px,_1fr)] mx-auto overflow-y-hidden">
			<Sidebar />
			<div className="h-screen overflow-auto min-w-full ml-10">{children}</div>
		</div>
	)
}
