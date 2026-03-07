function Services() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Side: Humanized Info & Trust */}
        <div className="lg:w-5/12 sticky top-24">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Expert Care</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">Let's get you back on the road.</h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Your vehicle is in good hands. Tell us what's going on, pick a time that works for you, and our certified mechanics will take care of the rest.
          </p>
          
          <img 
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80" 
            alt="Friendly mechanic smiling" 
            className="rounded-3xl shadow-md w-full object-cover h-64 mb-8 border-4 border-white"
          />

          {/* Trust Testimonial / Guarantee */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
            <div className="absolute -top-4 -left-4 text-4xl">💬</div>
            <p className="italic text-slate-600 mb-4 pl-4 text-sm leading-relaxed">
              "We treat every car that rolls into our garage like it belongs to our own family. Honest pricing, transparent updates, and quality work."
            </p>
            <div className="flex items-center gap-3 pl-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-xl">👨‍🔧</div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Mike T.</p>
                <p className="text-xs text-slate-500">Lead Mechanic at GearGrid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean, Soft Booking Form */}
        <div className="lg:w-7/12 w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Schedule Your Visit</h2>
          <p className="text-slate-500 text-sm mb-8">Fill out the details below and we'll confirm your slot shortly.</p>
          
          <form className="space-y-6">
            
            {/* Group 1: Personal Info */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-5">
              <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">1. Your Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First & Last Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-shadow" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-shadow" placeholder="(555) 000-0000" />
                </div>
              </div>
            </div>

            {/* Group 2: Vehicle & Service */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-5">
              <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">2. Vehicle Info</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">What do you drive?</label>
                <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-shadow" placeholder="Year, Make, and Model (e.g. 2021 Honda Civic)" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">How can we help today?</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-shadow text-slate-700">
                  <option>Select a primary service...</option>
                  <option>Standard Oil Change</option>
                  <option>Brake Inspection / Replacement</option>
                  <option>Check Engine Light Diagnostic</option>
                  <option>Tire Rotation & Alignment</option>
                  <option>Something else / I'm not sure</option>
                </select>
              </div>
            </div>

            {/* Group 3: Time & Notes */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-5">
              <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">3. Time & Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-shadow text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Time</label>
                  <input type="time" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-shadow text-slate-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Anything else we should know?</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-shadow" placeholder="E.g. I hear a squeaking noise when I brake..."></textarea>
              </div>
            </div>

            <button type="button" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-lg mt-4 flex justify-center items-center gap-2">
              <span>Request Appointment</span>
              <span>→</span>
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">We will call or text you to confirm your exact appointment time.</p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Services;