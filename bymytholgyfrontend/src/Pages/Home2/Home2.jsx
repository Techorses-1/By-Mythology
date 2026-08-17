import React from 'react'
import HomeHero from './HeroSection/Homehero'
import CollectionSection from './Collectionsection/Collectionsection'
import JourneySection from './JourneySection/JourneySection'
import FeatureBadges from './Featurebadges/Featurebadges'
import CraftedSection from './CraftedSection/CraftedSection'
import CraftsmanSection from './Craftsmansection/Craftsmansection'
import NewsletterSection from '../../Components/Newsletter/NewsletterSection'

const Home2 = () => {
  return (
    <>
    <HomeHero/>
    <CollectionSection/>
    <CraftedSection/>
    <CraftsmanSection/>
    <JourneySection/>
    <FeatureBadges/>
    <NewsletterSection/>
    </>
  )
}

export default Home2