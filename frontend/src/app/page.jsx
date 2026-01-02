import CategoryBrowse from '@/components/CategoryBrowse'
import EasySteps from '@/components/EasySteps'
import EventCard from '@/components/EventCard'
import FeaturedEvents from '@/components/FeaturedEvents'
import Hero from '@/components/Hero'

const Homepage = () => {
  return (
    <div className='bg-secondary'>
      <Hero />
      <FeaturedEvents />
    </div>
  )
}

export default Homepage