import EasySteps from '@/components/EasySteps'
import EventCard from '@/components/EventCard'
import Hero from '@/components/Hero'

const Homepage = () => {
  return (
    <div>
      <Hero />
      <EventCard title="Upcoming Events You Can't Miss" limit={3} />
      <EasySteps />
    </div>
  )
}

export default Homepage