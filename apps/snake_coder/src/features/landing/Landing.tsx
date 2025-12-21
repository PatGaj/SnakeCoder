import {
  CtaSection,
  FaqSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  LearningPathsSection,
} from './components'

import { Separator } from '@/components'

const Landing = () => {
  return (
    <main className="mx-auto w-full max-w-[1920px] px-6 py-10 md:px-12 md:py-14">
      <HeroSection />
      <Separator className="my-12 md:my-14" />
      <FeaturesSection />
      <Separator className="my-12 md:my-14" />
      <HowItWorksSection />
      <Separator className="my-12 md:my-14" />
      <LearningPathsSection />
      <Separator className="my-12 md:my-14" />
      <FaqSection />
      <Separator className="my-12 md:my-14" />
      <CtaSection />
    </main>
  )
}

export default Landing
