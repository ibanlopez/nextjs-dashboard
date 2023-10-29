import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { lusitana } from '@/app/ui/fonts'

export default function AcmeLogo() {
	return (
		<h1
			className={`${lusitana.className} flex flex-row items-end leading-none text-white`}>
			<GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
			<span className="text-[44px]">Acme</span>
		</h1>
	)
}
