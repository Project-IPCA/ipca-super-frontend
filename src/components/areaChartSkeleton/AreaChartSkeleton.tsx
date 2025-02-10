const AreaLineChartSkeleton = () => {
  return (
    <div className="w-full h-64 relative overflow-hidden rounded-lg">
      <div className="absolute inset-0  animate-pulse">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0 80 C20 70, 40 85, 60 65 C80 45, 90 55, 100 35 L100 100 L0 100 Z"
            className="fill-gray-200/50"
          />
          <path
            d="M0 80 C20 70, 40 85, 60 65 C80 45, 90 55, 100 35"
            className="stroke-gray-300 fill-none stroke-2"
          />
        </svg>
      </div>
    </div>
  );
};

export default AreaLineChartSkeleton;
