import Sidebar from './Sidebar'
export default function MainWrapper({ children }) {
	return (
		<div className="grid md:grid-cols-[244px_minmax(500px,_1fr)] grid-cols-1 mx-auto overflow-hidden">
			<Sidebar />
			<div className="h-screen overflow-auto min-w-full md:ml-10">{children}</div>
		</div>
	)
}
