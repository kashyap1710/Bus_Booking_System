import { Minus, Plus, Utensils, ArrowLeft } from "lucide-react";
import RouteIndicator from "./RouteIndicator";

export default function MealSelectionScreen({
  bookingData,
  updateBookingData,
  onNext,
  onBack,
}) {
  const handleQuantityChange = (type, change) => {
    const current = bookingData.meals[type];
    const other = bookingData.meals[type === "veg" ? "nonVeg" : "veg"];
    const next = current + change;

    if (next >= 0 && next + other <= bookingData.passengers) {
      updateBookingData({
        meals: { ...bookingData.meals, [type]: next },
      });
    }
  };

  const totalMeals = bookingData.meals.veg + bookingData.meals.nonVeg;

  const getMealPrice = () =>
    bookingData.meals.veg * 120 + bookingData.meals.nonVeg * 150;


  const canOrderMeals = bookingData.fromStopIndex <= 2 && bookingData.toStopIndex >= 2;

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <ArrowLeft className="text-gray-400" />
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-3xl font-semibold mb-2 text-white">Choose Your Meal</h1>
            <p className="text-gray-400 mb-5">
              {bookingData.from} → {bookingData.to} | Seats:{" "}
              {bookingData.selectedSeats.join(", ")}
            </p>
            <RouteIndicator
              fromIndex={bookingData.fromStopIndex}
              toIndex={bookingData.toStopIndex}
            />
          </div>

          <div className="w-10" />
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg shadow-black/30 p-10">
          
          {!canOrderMeals ? (
            <div className="text-center py-10">
               <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Utensils className="text-gray-500" size={32} />
               </div>
               <h3 className="text-xl font-medium text-white mb-2">Meals Not Available</h3>
               <p className="text-gray-400 max-w-md mx-auto mb-8">
                 Sorry, meal service is only available for journeys that pass through or stop at 
                 <span className="font-semibold text-blue-400"> Bharuch (Dinner Stop)</span>.
               </p>
               <button
                onClick={onNext}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700"
              >
                Continue without Meals
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Veg */}
                <MealCard
                  title="Veg Meal"
                  price={120}
                  count={bookingData.meals.veg}
                  color="green"
                  onMinus={() => handleQuantityChange("veg", -1)}
                  onPlus={() => handleQuantityChange("veg", 1)}
                  disabledPlus={totalMeals >= bookingData.passengers}
                />

                {/* Non-Veg */}
                <MealCard
                  title="Non-Veg Meal"
                  price={150}
                  count={bookingData.meals.nonVeg}
                  color="red"
                  onMinus={() => handleQuantityChange("nonVeg", -1)}
                  onPlus={() => handleQuantityChange("nonVeg", 1)}
                  disabledPlus={totalMeals >= bookingData.passengers}
                />
              </div>

              <p className="text-center text-gray-400 mb-8">
                Selected {totalMeals} of {bookingData.passengers} meals
              </p>

              {totalMeals > 0 && (
                <div className="mb-8 bg-blue-900/20 rounded-xl p-6 flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Total Meal Cost</span>
                  <span className="text-2xl font-semibold text-blue-400">
                    ₹{getMealPrice()}
                  </span>
                </div>
              )}

              <button
                onClick={onNext}
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function MealCard({
  title,
  price,
  count,
  onMinus,
  onPlus,
  disabledPlus,
  color,
}) {
  const isVeg = color === "green";

  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        isVeg ? "bg-green-900/20 border-green-800/50" : "bg-red-900/20 border-red-800/50"
      }`}
    >
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow">
          <Utensils
            className={isVeg ? "text-green-400" : "text-gray-400"}
            size={28}
          />
        </div>
      </div>

      <h3 className="text-xl font-medium mb-1 text-gray-200">{title}</h3>
      <p className="text-2xl font-semibold text-blue-400 mb-6">₹{price}</p>

      <div className="flex justify-center items-center gap-5">
        <CounterButton onClick={onMinus} color={color}>
          <Minus size={18} />
        </CounterButton>

        <span className="text-2xl font-medium w-10 text-center text-gray-200">{count}</span>

        <CounterButton onClick={onPlus} disabled={disabledPlus} color={color}>
          <Plus size={18} />
        </CounterButton>
      </div>
    </div>
  );
}

function CounterButton({ children, onClick, disabled, color }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-lg border flex items-center justify-center transition
        ${
          color === "green"
            ? "border-green-800 text-green-400 hover:bg-green-900/30"
            : "border-gray-500 text-gray-300 hover:bg-gray-600"
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
