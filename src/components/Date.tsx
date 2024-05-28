export function LocaleDate({ date }: { date: Date }) {
	return <span>{date.toDateString()}</span>
}