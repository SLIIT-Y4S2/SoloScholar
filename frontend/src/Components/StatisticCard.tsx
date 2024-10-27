interface StatisticCardProps {
    title: string;
    value: number | string;
    icon: JSX.Element;
    color: string;
}

export default function StatisticCard({
    title,
    value,
    icon,
    color,
}: Readonly<StatisticCardProps>) {
    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
            <div className={`text-3xl ${color}`}>{icon}</div>
            <div className="text-2xl font-bold mt-2">{value}</div>
            <div className="text-sm text-gray-500">{title}</div>
        </div>
    )
}