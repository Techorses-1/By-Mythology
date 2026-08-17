import React from 'react'
import AboutHero from './AboutHero/AboutHero'
import SacredCraftSection from './SacredCraftSection/SacredCraftSection'
import OurStorySection from './Ourstorysection/Ourstorysection'
import CandleMakingSection from './CandleMakingSection/CandleMakingSection'
import SacredPromiseSection from './promisePoints/promisePoints'

const About = () => {
    return (
        <>
            <AboutHero />
            <SacredCraftSection />
            <div id="our-story">
                <OurStorySection />
            </div>
            <div id="making">
                <CandleMakingSection />
            </div>
            <div id="our-promise">
                <SacredPromiseSection />
            </div>
        </>
    )
}

export default About