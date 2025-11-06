import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Hero Section with Lighter Overlay */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with conditional rotation */}
        <div className="absolute inset-0">
          <Image
            src="/hero-image.jpg"
            alt="Hero background"
            fill
            className="object-cover md:rotate-0 -rotate-90" // Rotate 90deg on mobile, normal on desktop
            priority
          />
        </div>
        
        {/* Lighter overlay - reduced opacity */}
        <div className="absolute inset-0 bg-gray bg-opacity-100"></div>
        
        {/* Content */}
        <div className="container mx-auto px-6 text-center relative z-10 text-white">
          <h1 className="text-5xl font-bold mb-6 fade-in-delay-1">Welcome to MyApp</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto fade-in-delay-2">
            Discover amazing features that will transform your workflow and boost your productivity.
          </p>
          <button className="bg-transparent text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 fade-in-delay-3 border border-blue-600">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section with Light Background */}
      <section className="py-16 fade-in-delay-3 relative overflow-hidden">
  {/* Triangles in specific positions */}
    <div className="absolute inset-0 opacity-10"></div>
{[
    // Triangles
    { type: 'triangle', size: 80, top: '10%', left: '5%', rotation: 45 },
    { type: 'triangle', size: 80, top: '85%', left: '45%', rotation: 60 },
    { type: 'triangle', size: 80, top: '50%', right: '15%', rotation: 5 },
    
    // Lines
    { type: 'line', size: 400, top: '50%', right: '15%', rotation: 5 },
    { type: 'line', size: 400, bottom: '30%', left: '20%', rotation: 100 },
    
    // Circles
    { type: 'circle', size: 400, bottom: '60%', left: '70%', rotation: 0 },
    { type: 'circle', size: 400, top: '60%', left: '0%', rotation: 0 },
  ].map((element, index) => (
    <div 
      key={index}
      className="absolute"
      style={{
        width: `${element.size}px`,
        height: `${element.size}px`,
        top: element.top,
        left: element.left,
        right: element.right,
        bottom: element.bottom,
        transform: `rotate(${element.rotation}deg)`,
        backgroundImage: `url('${element.type}.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }}
    />
  ))}

        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 fade-in-delay-1">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 fade-in-delay-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Performance</h3>
              <p className="text-gray-600">
                Lightning-fast loading times and smooth user experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 fade-in-delay-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Safe</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 fade-in-delay-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive interface that anyone can master in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
{/* Image Gallery Section with Video Background */}
<section className="py-16 fade-in-delay-4 relative overflow-hidden">
  {/* Video Background */}
  <div className="absolute inset-0 z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    >
      <source src="bgbg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    {/* Dark overlay for better text readability */}
    <div className="absolute inset-0 bg-black/60"></div>
  </div>
  
  <div className="container mx-auto px-6 relative z-10">
    <h2 className="text-3xl font-bold text-center mb-12 text-white">See It In Action</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="fade-in-delay-1">
        <h3 className="text-2xl font-semibold mb-4 text-white">Beautiful Design</h3>
        <p className="text-gray-200 mb-6">
          Our platform combines stunning visuals with powerful functionality. 
          Experience the perfect blend of form and function.
        </p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-center text-gray-200">
            <span className="text-green-400 mr-2">✓</span>
            Responsive design for all devices
          </li>
          <li className="flex items-center text-gray-200">
            <span className="text-green-400 mr-2">✓</span>
            Modern and clean interface
          </li>
          <li className="flex items-center text-gray-200">
            <span className="text-green-400 mr-2">✓</span>
            Customizable themes and layouts
          </li>
        </ul>
        <a 
          href="https://youtube.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 fade-in-delay-2"
        >
          View Live Demo
        </a>
      </div>
      <div className="rounded-lg overflow-hidden fade-in-delay-3">
        <Image 
          src="/feature-screenshot.jpg"
          alt="App screenshot showing the interface"
          width={600}
          height={400}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  </div>
</section>

      {/* Testimonials with Background Image */}
      <section className="relative py-16 fade-in-delay-4">
        {/* Background Image */}
        <div 
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('blueue.png')" }}
/>
        <div className="container mx-auto px-6 relative z-10 text-black">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg shadow-md fade-in-delay-1">
              <p className="mb-4">
                "This app has completely transformed how I work. The interface is intuitive and the features are powerful!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                  <Image 
                    src="/user1.jpg" 
                    alt="Sarah Johnson"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-blue-400 text-sm">Product Manager</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg shadow-md fade-in-delay-2">
              <p className="mb-4">
                "I've tried many similar tools, but this one stands out for its simplicity and effectiveness."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                  <Image 
                    src="/user2.jpg" 
                    alt="Mike Chen"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Mike Chen</h4>
                  <p className="text-blue-400 text-sm">Developer</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg shadow-md fade-in-delay-3">
              <p className="mb-4">
                "The customer support is exceptional and the platform keeps getting better with each update."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                  <Image 
                    src="/user3.jpg" 
                    alt="Emily Davis"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Emily Davis</h4>
                  <p className="text-blue-400 text-sm">Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="relative py-16 fade-in-delay-4">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-image.jpg')" }}
        >
          {/* Very dark overlay */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-80"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10 text-white">
          <h2 className="text-3xl font-bold mb-6 fade-in-delay-1">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto fade-in-delay-2">
            Join thousands of satisfied users and experience the difference today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-delay-3">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
              Start Free Trial
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}