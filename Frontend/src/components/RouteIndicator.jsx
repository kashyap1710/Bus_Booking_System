import { busStops } from "../App";

export default function RouteIndicator({ fromIndex, toIndex, size = "small" }) {
  const circleSize = size === "large" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {busStops.map((stop, index) => {
        let stopColor = "bg-gray-700 text-gray-400";

        if (index === fromIndex) {
          stopColor = "bg-green-800 text-white";
        } else if (index === toIndex) {
          stopColor = "bg-red-800 text-white";
        } else if (index > fromIndex && index < toIndex) {
          stopColor = "bg-yellow-600 text-black";
        }

        return (
          <div key={stop.name} className="flex items-center gap-2">
            {/* Stop Circle */}
            <div
              className={`flex items-center justify-center rounded-full font-medium ${circleSize} ${stopColor}`}
            >
              {stop.name.charAt(0)}
            </div>

            {/* Connector Line */}
            {index < busStops.length - 1 && (
              <div
                className={`h-1 w-8 rounded-full ${
                  index < toIndex ? "bg-blue-500" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
