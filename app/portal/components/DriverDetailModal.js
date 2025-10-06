'use client';

export default function DriverDetailModal({ driver, onClose }) {
  if (!driver) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{driver.name}</h2>
              <p className="text-blue-100">Driver ID: {driver.id}</p>
              <p className="text-blue-100">Zone: {driver.zone}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-blue-100 mb-1">Status</p>
              <p className="font-semibold">{driver.status}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-blue-100 mb-1">Remaining</p>
              <p className="font-semibold">{driver.packages} packages</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-blue-100 mb-1">Stops Left</p>
              <p className="font-semibold">{driver.route?.filter(r => r.status !== 'completed').length || 0}</p>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Delivery Route
          </h3>

          <div className="space-y-3">
            {driver.route && driver.route.length > 0 ? (
              driver.route.map((stop, index) => (
                <div key={index} className={`relative p-4 rounded-lg border-2 ${
                  stop.isSpoofed ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' :
                  stop.status === 'completed' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' :
                  stop.status === 'in-progress' ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' :
                  'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                }`}>
                  {/* Stop Number Badge */}
                  <div className="absolute -left-3 -top-3 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1 ml-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-semibold ${stop.isSpoofed ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
                          {stop.address}
                        </h4>
                        {stop.isSpoofed ? (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
                            ⚠️ SPOOFED
                          </span>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(stop.status)}`}>
                            {stop.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Packages</p>
                          <p className="font-medium text-slate-800 dark:text-white">{stop.packages}</p>
                        </div>
                        {stop.eta && stop.status !== 'completed' && (
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">ETA</p>
                            <p className="font-medium text-slate-800 dark:text-white">{stop.eta}</p>
                          </div>
                        )}
                        {stop.completedAt && (
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Completed</p>
                            <p className="font-medium text-green-600 dark:text-green-400">{stop.completedAt}</p>
                          </div>
                        )}
                        {stop.notes && (
                          <div className="col-span-2">
                            <p className="text-xs text-slate-600 dark:text-slate-400">Notes</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{stop.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {stop.status === 'completed' && (
                      <div className="ml-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">No route data available</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
