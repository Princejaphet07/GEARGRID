import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* 1. Modern Hero Section (Split Layout) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col-reverse lg:flex-row">
          
          {/* Hero Text */}
          <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="inline-block bg-blue-50 text-blue-600 font-bold px-4 py-1.5 rounded-full text-sm mb-6 w-max">
              ⚙️ Top-Rated Auto Shop
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-6 leading-tight tracking-tight">
              Keep your drive <br className="hidden md:block"/>
              <span className="text-blue-600">running smooth.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
              Whether you need a quick oil change, complex engine repairs, or premium aftermarket parts, GearGrid has you covered. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/services" className="bg-slate-800 hover:bg-slate-700 text-white text-center font-bold py-4 px-8 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1">
                Book an Appointment
              </Link>
              <Link to="/parts" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-center font-bold py-4 px-8 rounded-2xl shadow-sm transition-transform transform hover:-translate-y-1">
                Shop Parts Catalog
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full">
            <img 
              src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&q=80" 
              alt="Mechanic working on car" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Trust Stats Banner */}
      <section className="max-w-7xl mx-auto w-full px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-200">
          <div className="px-4">
            <p className="text-3xl md:text-4xl font-black text-slate-800 mb-1">4.9/5</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Average Rating</p>
          </div>
          <div className="px-4">
            <p className="text-3xl md:text-4xl font-black text-slate-800 mb-1">5k+</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Happy Drivers</p>
          </div>
          <div className="px-4">
            <p className="text-3xl md:text-4xl font-black text-slate-800 mb-1">10k+</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Parts Sold</p>
          </div>
          <div className="px-4">
            <p className="text-3xl md:text-4xl font-black text-slate-800 mb-1">100%</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Certified Pros</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Services (Quick Peek) */}
      <section className="max-w-7xl mx-auto w-full px-6 mb-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Our Core Services</h2>
            <p className="text-slate-500">Expert care for every make and model.</p>
          </div>
          <Link to="/services" className="text-blue-600 font-bold hover:text-blue-500 transition-colors flex items-center gap-2">
            View all services <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🛢️</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Routine Maintenance</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Keep your engine healthy with our signature oil changes, fluid top-offs, and filter replacements.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🛑</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Brake & Suspension</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Stop safely and ride smoothly. We offer comprehensive brake pad replacements and suspension tuning.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">💻</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Engine Diagnostics</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Check engine light on? Our advanced computer diagnostics pinpoint the exact issue instantly.</p>
          </div>
        </div>
      </section>

      {/* 4. Trending Parts (E-commerce Teaser) */}
      <section className="max-w-7xl mx-auto w-full px-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white overflow-hidden relative">
          
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending in The Grid</h2>
              <p className="text-slate-400">Upgrade your ride with our top-selling parts.</p>
            </div>
            <Link to="/parts" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors">
              Shop All Parts
            </Link>
          </div>

          {/* Mini Parts Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors group">
              <img src="https://images.unsplash.com/photo-1635773054098-9eb06b6e41b4?w=400&q=80" alt="Motor Oil" className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-5">
                <h4 className="font-bold text-lg mb-1">Premium Synthetic Oil</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-black text-blue-400">$35.00</span>
                  <button className="text-sm font-bold text-white hover:text-blue-400 transition-colors">Add +</button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors group">
              <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" alt="Brake Pads" className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-5">
                <h4 className="font-bold text-lg mb-1">Ceramic Brake Pads</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-black text-blue-400">$55.50</span>
                  <button className="text-sm font-bold text-white hover:text-blue-400 transition-colors">Add +</button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors group">
              <img src="https://images.unsplash.com/photo-1580274455041-d6ba8f2abdf2?w=400&q=80" alt="Tires" className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-5">
                <h4 className="font-bold text-lg mb-1">All-Terrain Tires</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-black text-blue-400">$120.00</span>
                  <button className="text-sm font-bold text-white hover:text-blue-400 transition-colors">Add +</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;