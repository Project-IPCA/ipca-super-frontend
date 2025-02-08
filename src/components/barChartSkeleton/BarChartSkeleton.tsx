const BarChartSkeleton = () => {
  const data = [
    25, 40, 30, 50, 60, 45, 35, 55, 70, 65, 30, 50, 40, 60, 45, 55, 35,
  ];
  return (
    <div className="w-full h-[300px] flex items-end justify-between gap-4 p-4">
      {data.map((val, i) => (
        <div
          key={i}
          className="w-full bg-gray-200 rounded animate-pulse"
          style={{ height: `${val}%` }}
        />
      ))}
    </div>
  );
};

export default BarChartSkeleton;
