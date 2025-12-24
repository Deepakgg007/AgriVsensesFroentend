import Breadcrumnd from '../common/Breadcrumnd'
import AboutHomeTwo from '../home/AboutHomeTwo'
import ServiceHomeTwo from '../home/ServiceHomeTwo'
import TestimonialHomeTwo from '../home/TestimonialHomeTwo'
import HeaderTwo from '../../layouts/headers/HeaderTwo'
import FooterOne from '../../layouts/footers/FooterOne'
import Wrapper from '../../layouts/Wrapper'

export default function About() {
  return (
    <Wrapper>
      <HeaderTwo />
      <Breadcrumnd title="About Us" subtitle="About Us" />
      <AboutHomeTwo />
      <ServiceHomeTwo />
      <TestimonialHomeTwo />
      <FooterOne />
    </Wrapper>
  )
}
