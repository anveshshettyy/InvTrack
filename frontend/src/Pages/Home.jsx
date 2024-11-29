import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Poster1 from '../assets/images/invTrack_Poster1.png'
import Poster2 from '../assets/images/group.png'
import Poster3 from '../assets/images/inventory1.png'
import Poster4 from '../assets/images/admin.png'

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className='min-h-[100vh] w-full bg-zinc-100 p-12 '>
        <div className='mt-[20vh]'>
          <h1 className='text-[10vh] text-black font-regular leading-tight tracking-tight'>Effortlessly Manage and Optimize<br />Your Inventory.</h1>
        </div>
        <div className='h-[100vh] w-full bg-[#124468] mt-5 mb-20 '>
          <img className='h-full w-full object-fit' src={Poster1} alt="" />
        </div>
        <div className='mb-20'>
          <div>
            <h1 className='font-founders-grotesk text-[8vh] tracking-normal '>About Us</h1>
            <div className='h-[1px] w-full bg-black -mt-2 mb-5'></div>
          </div>
          <div className=' w-full flex justify-center items-center'>
            <p className='font-regular text-[5vh]' >InvTrack is driven by a commitment to revolutionize inventory management. Our platform combines advanced technology with user-friendly design to help industries effectively monitor their products and assets. Our goal is to simplify inventory tracking, enabling businesses to operate smoothly and focus on growth. At InvTrack, we aim to empower organizations with the tools they need to manage their inventories efficiently and confidently, ensuring success one product at a time.</p>
          </div>

        </div>
        <div>
  <div>
    <h1 className="font-founders-grotesk text-[8vh] text-center md:text-left">We Provide</h1>
    <div className="h-[1px] w-full bg-black -mt-2 mb-5"></div>
  </div>

  <div className="flex flex-col md:flex-row items-center justify-center mb-10">
    <div className="h-auto md:h-[50vh] w-full md:w-1/2 p-6 md:p-16">
      <p className="font-regular text-[2.5vh] md:text-[3vh] text-center md:text-left">
        Keep your inventory organized and up-to-date with our real-time tracking system. Our platform allows you to
        instantly add, update, or remove items, with quantities and values recalculated automatically. Each inventory
        change reflects immediately, providing a live snapshot of your stock levels, so you're always aware of what’s in
        stock and what needs replenishment.
      </p>
    </div>
    <div className="h-auto md:h-[50vh] w-full md:w-1/2 flex md:mt-[20px] items-center justify-center">
      <img className="h-full w-[80%] md:w-[60%] object-cover" src={Poster2} alt="" />
    </div>
  </div>

  <div className="flex flex-col md:flex-row items-center justify-center mb-10">
    <div className="h-auto md:h-[50vh] w-full md:w-1/2 flex items-center justify-center">
      <img className="h-full w-[80%] md:w-[60%] object-cover" src={Poster3} alt="" />
    </div>
    <div className="h-auto md:h-[50vh] w-full md:w-1/2 p-6 md:p-16">
      <p className="font-regular text-[2.5vh] md:text-[3vh] text-center md:text-left">
        Easily locate and organize products with our advanced category and search capabilities. Our intuitive category
        management lets you assign items to custom categories, making it simple to organize your inventory based on
        product type, department, or any other classification. With a responsive search bar, you can filter items by
        name or category, saving time and enhancing your workflow efficiency.
      </p>
    </div>
  </div>

  <div className="flex flex-col md:flex-row items-center justify-center mb-10">
    <div className="h-auto md:h-[50vh] w-full md:w-1/2 px-6 md:px-16 py-10 md:py-20">
      <p className="font-regular text-[2.5vh] md:text-[3vh] text-center md:text-left">
        Gain valuable insights into your business with our comprehensive dashboard. Visualize important metrics like
        total inventory value, item count, and usage trends, all at a glance. For administrators, the platform offers
        powerful user management tools to monitor activity, manage access, and maintain data accuracy, providing you
        with full control over your inventory management process.
      </p>
    </div>
    <div className="h-auto md:h-[50vh] w-full md:w-1/2 flex items-center justify-center">
      <img className="h-full w-[80%] md:w-[75%]  object-cover" src={Poster4} alt="" />
    </div>
  </div>
</div>


        <div className="mb-20">
          <h1 className="font-founders-grotesk text-[8vh]">Why Choose Us?</h1>
          <div className="h-[1px] w-full bg-black -mt-2 mb-5"></div>
          <ul className="list-disc pl-10 font-regular text-[3vh]">
            <li>Real-Time Data Sync</li>
            <li>Advanced Analytics</li>
            <li>Intuitive Design</li>
            <li>24/7 Customer Support</li>
          </ul>
        </div>

        <div className="mb-20">
          <div>
            <h1 className="font-founders-grotesk text-[8vh]">Testimonials</h1>
            <div className="h-[1px] w-full bg-black -mt-2 mb-5"></div>
          </div>
          <div className="space-y-8">
            <blockquote className="p-6 bg-white shadow-md rounded">
              <p className="font-regular text-[3vh]">"InvTrack has transformed our inventory system—it's seamless and reliable!"</p>
              <cite className="block text-right text-[2vh] text-gray-600">– User A, Business Owner</cite>
            </blockquote>
            <blockquote className="p-6 bg-white shadow-md rounded">
              <p className="font-regular text-[3vh]">"The real-time tracking saves us so much time and effort!"</p>
              <cite className="block text-right text-[2vh] text-gray-600">– User B, Operations Manager</cite>
            </blockquote>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-20">
          <h1 className="font-founders-grotesk text-[8vh]">FAQ</h1>
          <div className="h-[1px] w-full bg-black -mt-2 mb-5"></div>
          <div className="space-y-5">
            <details className="bg-white p-5 rounded shadow-md">
              <summary className="font-bold text-[3vh] cursor-pointer">What is InvTrack?</summary>
              <p className="mt-2 text-[2.5vh]">InvTrack is a user-friendly inventory management platform...</p>
            </details>
            <details className="bg-white p-5 rounded shadow-md">
              <summary className="font-bold text-[3vh] cursor-pointer">How secure is my data?</summary>
              <p className="mt-2 text-[2.5vh]">We prioritize data security with advanced encryption...</p>
            </details>
            <details className="bg-white p-5 rounded shadow-md">
              <summary className="font-bold text-[3vh] cursor-pointer">Can I use InvTrack on mobile?</summary>
              <p className="mt-2 text-[2.5vh]">Yes, InvTrack is optimized for both desktop and mobile use...</p>
            </details>
          </div>
          
        </div>
      </div>


      <Footer />
    </div>
  )
}

export default Home
