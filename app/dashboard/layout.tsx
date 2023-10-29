import { lusitana } from '@/app/ui/fonts'
import SideNav from '@/app/ui/dashboard/sidenav'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
			<aside className="w-full flex-none md:w-64">
				<SideNav />
			</aside>
			<div className="flex-grow p-6 md:overflow-y-auto md:p-12">
				<>
					<header>
						<h1 className={`${lusitana.className} mb-4 text-3xl`}>
							Dashboard
						</h1>
					</header>
					{children}
				</>
			</div>
		</div>
	)
}
