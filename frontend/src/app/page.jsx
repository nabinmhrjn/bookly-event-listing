import CategoryBrowse from '@/components/CategoryBrowse'
import EasySteps from '@/components/EasySteps'
import EventCard from '@/components/EventCard'
import FeaturedEvents from '@/components/FeaturedEvents'
import Hero from '@/components/Hero'

const Homepage = () => {
  return (
    <div>
      <Hero />
      {/* <EventCard title="Upcoming Events You Can't Miss" limit={3} /> */}
      {/* <EasySteps /> */}
      <FeaturedEvents />
      {/* <CategoryBrowse /> */}
    </div>
  )
}

export default Homepage