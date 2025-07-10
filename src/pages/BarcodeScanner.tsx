import React, { useState, useRef } from 'react';
import { Camera, Search, Package, ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFood } from '../contexts/FoodContext';
import toast from 'react-hot-toast';

// Mock barcode database
const barcodeDatabase: Record<string, any> = {
  '123456789012': {
    name: 'Organic Banana',
    brand: 'Fresh Farms',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.3,
    serving: '1 medium (118g)'
  },
  '987654321098': {
    name: 'Greek Yogurt Plain',
    brand: 'Healthy Choice',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
    serving: '170g container'
  },
  '456789123456': {
    name: 'Whole Wheat Bread',
    brand: 'Nature\'s Best',
    calories: 80,
    protein: 4,
    carbs: 15,
    fat: 1,
    serving: '1 slice (28g)'
  },
  '789123456789': {
    name: 'Almond Butter',
    brand: 'Nut Paradise',
    calories: 190,
    protein: 7,
    carbs: 7,
    fat: 17,
    serving: '2 tbsp (32g)'
  },
  '321654987321': {
    name: 'Protein Bar Chocolate',
    brand: 'FitLife',
    calories: 220,
    protein: 20,
    carbs: 22,
    fat: 8,
    serving: '1 bar (60g)'
  }
};

export default function BarcodeScanner() {
  const navigate = useNavigate();
  const { addFoodEntry } = useFood();
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const simulateBarcodeScan = () => {
    setIsScanning(true);
    
    // Simulate camera scanning delay
    setTimeout(() => {
      const barcodes = Object.keys(barcodeDatabase);
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
      const product = barcodeDatabase[randomBarcode];
      
      setScannedProduct({ ...product, barcode: randomBarcode });
      setIsScanning(false);
      toast.success(`📦 Product found: ${product.name}`);
    }, 2000);
  };

  const handleManualSearch = () => {
    if (!manualBarcode.trim()) {
      toast.error('Please enter a barcode');
      return;
    }

    const product = barcodeDatabase[manualBarcode];
    if (product) {
      setScannedProduct({ ...product, barcode: manualBarcode });
      toast.success(`📦 Product found: ${product.name}`);
    } else {
      toast.error('Product not found in database');
    }
  };

  const handleAddFood = async () => {
    if (!scannedProduct) return;

    setLoading(true);
    try {
      const multiplier = parseFloat(quantity) || 1;
      
      await addFoodEntry({
        food_name: `${scannedProduct.brand} ${scannedProduct.name}`,
        quantity: `${quantity} × ${scannedProduct.serving}`,
        calories: scannedProduct.calories * multiplier,
        protein: scannedProduct.protein * multiplier,
        carbs: scannedProduct.carbs * multiplier,
        fat: scannedProduct.fat * multiplier,
        meal_type: mealType,
        notes: notes || undefined,
        date: new Date().toISOString().split('T')[0],
      });
      
      toast.success('Food added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to add food entry');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-indigo-50/30 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>📱</div>
        <div className="absolute top-40 right-32 text-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}>📦</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-8 animate-float" style={{ animationDelay: '4s' }}>🔍</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-12 animate-float" style={{ animationDelay: '1s' }}>⚡</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/dashboard"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-white/50 backdrop-blur-sm dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Barcode Scanner 📱
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Scan or enter a barcode to instantly add food
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-3xl shadow-xl p-8 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Camera className="h-6 w-6 mr-3 text-blue-600" />
              Camera Scanner
            </h2>

            {/* Simulated Camera View */}
            <div className="relative mb-6">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl overflow-hidden relative">
                {isScanning ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white font-medium">Scanning for barcode...</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Camera Preview</p>
                      <p className="text-sm opacity-75">Point camera at barcode</p>
                    </div>
                  </div>
                )}
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-blue-400 rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400"></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={simulateBarcodeScan}
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {isScanning ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Start Camera Scan</span>
                </div>
              )}
            </button>

            {/* Manual Entry */}
            <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-600/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Manual Entry
              </h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Enter barcode number"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                />
                <button
                  onClick={handleManualSearch}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Search
                </button>
              </div>
              
              {/* Sample Barcodes */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try these sample barcodes:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(barcodeDatabase).slice(0, 3).map((barcode) => (
                    <button
                      key={barcode}
                      onClick={() => setManualBarcode(barcode)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {barcode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-3xl shadow-xl p-8 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Package className="h-6 w-6 mr-3 text-purple-600" />
              Product Details
            </h2>

            {scannedProduct ? (
              <div className="space-y-6">
                {/* Product Info */}
                <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {scannedProduct.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{scannedProduct.brand}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Barcode: {scannedProduct.barcode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50/80 dark:bg-orange-900/20 rounded-xl border border-orange-200/50 dark:border-orange-800/50">
                    <div className="text-2xl font-bold text-orange-600">{scannedProduct.calories}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                    <div className="text-2xl font-bold text-blue-600">{scannedProduct.protein}g</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50">
                    <div className="text-2xl font-bold text-yellow-600">{scannedProduct.carbs}g</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50/80 dark:bg-purple-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                    <div className="text-2xl font-bold text-purple-600">{scannedProduct.fat}g</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
                  </div>
                </div>

                {/* Add to Meal Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Per {scannedProduct.serving}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meal
                      </label>
                      <select
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value as any)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snacks">Snacks</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-700/80 dark:text-white transition-colors"
                      placeholder="Any additional notes..."
                    />
                  </div>

                  <button
                    onClick={handleAddFood}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 rounded-2xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-20">📦</div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No product scanned</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Scan a barcode or enter one manually to see product details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}