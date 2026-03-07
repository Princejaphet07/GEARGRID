function Parts() {
  const motorParts = [
    { id: 1, name: "High-Performance Spark Plugs", price: "$24.99", image: "https://images.unsplash.com/photo-1530906358829-e84b2769270f?w=500&q=80", desc: "Set of 4 iridium spark plugs for maximum engine efficiency.", tag: "Best Seller" },
    { id: 2, name: "Premium Synthetic Motor Oil", price: "$35.00", image: "https://images.unsplash.com/photo-1635773054098-9eb06b6e41b4?w=500&q=80", desc: "5W-30 full synthetic oil. Keeps your engine running smooth.", tag: "Essential" },
    { id: 3, name: "Ceramic Brake Pads", price: "$55.50", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&q=80", desc: "Low-dust, noise-free stopping power for high-performance rides." },
    { id: 4, name: "All-Terrain Motor Tires", price: "$120.00", image: "https://images.unsplash.com/photo-1580274455041-d6ba8f2abdf2?w=500&q=80", desc: "Durable tread design for maximum grip on the road or dirt." },
    { id: 5, name: "Heavy Duty Car Battery", price: "$145.00", image: "https://images.unsplash.com/photo-1621008018318-7f551c900661?w=500&q=80", desc: "Reliable starting power even in extreme weather conditions." },
    { id: 6, name: "Coilover Suspension Kit", price: "$350.00", image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500&q=80", desc: "Adjustable ride height and damping for superior handling.", tag: "Pro Gear" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Friendly Header & Trust Banner */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">Find Your Perfect Part</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
            Whether you're doing a weekend oil change or a full engine rebuild, we've got the high-quality parts you need to get the job done right.
          </p>
          
          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-600 mb-10">
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">🚚 Free Shipping over $50</span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">🛡️ 30-Day Returns</span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">✔️ Expert Verified Parts</span>
          </div>

          {/* Category Pills (Visual UI) */}
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition hover:-translate-y-0.5">All Parts</button>
            <button className="bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 px-5 py-2 rounded-full text-sm font-medium transition hover:-translate-y-0.5">Engine</button>
            <button className="bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 px-5 py-2 rounded-full text-sm font-medium transition hover:-translate-y-0.5">Brakes</button>
            <button className="bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 px-5 py-2 rounded-full text-sm font-medium transition hover:-translate-y-0.5">Suspension</button>
          </div>
        </div>

        {/* Soft, Clean Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {motorParts.map((part) => (
            <div key={part.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden group">
              <div className="relative overflow-hidden">
                <img src={part.image} alt={part.name} className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {part.tag && (
                  <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {part.tag}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{part.name}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">{part.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-slate-800">{part.price}</span>
                  <button className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-2.5 px-5 rounded-xl transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Parts;