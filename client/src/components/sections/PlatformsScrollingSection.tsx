import { Play, Instagram, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';
import { VelocityScroll } from '../ui/scroll-based-velocity';

const PlatformsScrollingSection = () => {
  const platforms = [
    { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { name: 'TikTok', icon: Play, color: 'text-purple-500' },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { name: 'Twitter', icon: Twitter, color: 'text-blue-400' }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-emerald-800 to-green-900 bg-clip-text text-transparent">
              All Your Favorite Platforms
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get expert help for every social media platform you use
          </p>
        </div>

        {/* First Row - Icons */}
        <div className="relative flex w-full overflow-hidden py-2">
          <VelocityScroll 
            defaultVelocity={5}
            speedMultiplier={0.6}
            smoothness={0.8}
           
            numRows={1}
          >
            {platforms.map((platform) => (
              <span key={`icon-${platform.name}`} className="mx-8">
                <div className="rounded-full p-2 group-hover:bg-emerald-50 transition-colors inline-flex items-center justify-center">
                  <platform.icon className={`h-14 w-14  ${platform.color}`} />
                </div>
              </span>
            ))}
          </VelocityScroll>
        </div>

        {/* Second Row - Names */}
        <div className="relative flex w-full overflow-hidden ">
          <VelocityScroll 
            defaultVelocity={-5}
            speedMultiplier={0.6}
            smoothness={0.8}
            className="text-2xl md:text-3xl font-normal text-gray-800"
            numRows={1}
          >
            {platforms.map((platform) => (
              <span key={`name-${platform.name}`} className={`mx-8 text-black tracking-widest `}>
                {platform.name} 
              </span>
            ))}
          </VelocityScroll>
        </div>

        
      </div>
    </section>
  );
};

export default PlatformsScrollingSection;