import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function Services() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', profilePic: '' });

  const servicesList = [
    { id: 'diag', name: 'Diagnostic Check', desc: 'Full system computer scan and physical inspection.', price: 50.00 },
    { id: 'oil', name: 'Oil Change', desc: 'Includes premium synthetic oil and new filter.', price: 85.00 }
  ];
  
  const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:00 PM', '03:30 PM'];

  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState(servicesList[0]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [isBooking, setIsBooking] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const calendarDays = useMemo(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, currentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true });
    }

    const totalDaysAdded = days.length;
    const remainingCells = (Math.ceil(totalDaysAdded / 7) * 7) - totalDaysAdded;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, currentMonth: false });
    }

    return days;
  }, [currentViewDate]);

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const currentMonthYearText = currentViewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentMonthText = currentViewDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentViewDate.getFullYear();

  const handleConfirmBooking = async () => {
    if (!currentUser || !selectedDay) return;
    setIsBooking(true);

    try {
      const bookingData = {
        customerId: currentUser.uid,
        customerName: userData.name || "Unknown Customer",
        customerEmail: currentUser.email,
        service: selectedService.name,
        price: selectedService.price,
        date: `${currentMonthText} ${selectedDay}, ${currentYear}`,
        time: selectedTime,
        status: 'Pending',
        mechanic: 'Unassigned',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "bookings"), bookingData);
      
      setToastMessage("Booking Confirmed Successfully! 🎉");
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error("Error booking service:", error);
      alert("Failed to book service. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans pb-20 pt-8 relative">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-2 mb-4 transition-colors w-max">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Book a Garage Service</h1>
          <p className="text-slate-400 text-sm">Select your preferred date, time, and service type.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service Type Selection */}
            <div className="bg-[#1a2235] border border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">1</span>
                Select Service Type
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicesList.map((srv) => (
                  <div 
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`rounded-2xl p-4 cursor-pointer transition-all relative overflow-hidden border-2 ${
                      selectedService.id === srv.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 bg-[#0f1522]'
                    }`}
                  >
                    {selectedService.id === srv.id && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">SELECTED</div>
                    )}
                    <h3 className={`font-bold text-lg mb-1 ${selectedService.id === srv.id ? 'text-white' : 'text-slate-300'}`}>{srv.name}</h3>
                    <p className={`text-xs mb-3 ${selectedService.id === srv.id ? 'text-slate-400' : 'text-slate-500'}`}>{srv.desc}</p>
                    <span className={`font-black text-lg ${selectedService.id === srv.id ? 'text-blue-500' : 'text-slate-300'}`}>₱{srv.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar & Time */}
            <div className="bg-[#1a2235] border border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">2</span>
                Date & Time
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="text-slate-400 hover:text-white transition-colors p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <span className="text-white font-bold">{currentMonthYearText}</span>
                    <button onClick={handleNextMonth} className="text-slate-400 hover:text-white transition-colors p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-xs font-bold text-slate-500 py-2">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {calendarDays.map((date, index) => {
                      const isSelected = date.currentMonth && date.day === selectedDay;
                      return (
                        <div 
                          key={index} 
                          onClick={() => date.currentMonth && setSelectedDay(date.day)}
                          className={`py-2 text-sm rounded-lg transition-colors ${
                            !date.currentMonth ? 'text-slate-600 cursor-default' :
                            isSelected ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 cursor-pointer' : 
                            'text-slate-300 hover:bg-slate-700 cursor-pointer'
                          }`}
                        >
                          {date.day}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Available Slots</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time, index) => (
                      <div 
                        key={index} 
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium text-center cursor-pointer transition-all border ${
                          selectedTime === time ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white bg-[#0f1522]'
                        }`}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1a2235] border border-slate-800 rounded-3xl p-6 md:p-8 sticky top-6">
              <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>
              
              {currentUser ? (
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Details</h4>
                  <div className="flex items-center gap-3 bg-[#0f1522] p-3 rounded-xl border border-slate-800">
                    {userData.profilePic ? (
                      <img src={userData.profilePic} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-700 shadow-inner">👤</div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-white font-bold text-sm truncate">{userData.name || "Loading name..."}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-sm text-yellow-500 font-medium">Please <Link to="/login" className="font-bold underline">log in</Link> to secure your booking.</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 text-sm text-slate-300 mb-6 pb-6 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Service</span>
                  <span className="font-bold text-white text-right ml-4">{selectedService.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Date</span>
                  <span className="font-medium">{selectedDay ? `${currentMonthText} ${selectedDay}, ${currentYear}` : 'Select a day'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Time Slot</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-base font-bold text-white">Total Price</span>
                <span className="text-3xl font-black text-blue-500">₱{selectedService.price.toFixed(2)}</span>
              </div>

              <button 
                disabled={!currentUser || !selectedDay || isBooking}
                onClick={handleConfirmBooking}
                className={`w-full font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors mb-4 ${
                  currentUser && selectedDay && !isBooking
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isBooking ? "Confirming..." : currentUser ? "Confirm Booking" : "Log in to Book"}
                {!isBooking && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l7-7m-7 7H3" /></svg>}
              </button>

              <p className="text-center text-[11px] text-slate-500">By booking, you agree to our Terms of Service.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#1a2235] border border-[#232d40] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="bg-blue-500/20 text-blue-500 p-2 rounded-xl flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Success</h4>
            <p className="text-xs text-slate-400">{toastMessage}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Services;