import Breadcrumnd from '../common/Breadcrumnd'
import ContactHomeTwo from '../home/ContactHomeTwo'
import GoogleMap from './GoogleMap'
import ContactInfo from './ContactInfo'
import Wrapper from '../../layouts/Wrapper'
import HeaderTwo from '../../layouts/headers/HeaderTwo'
import FooterOne from '../../layouts/footers/FooterOne'

export default function Contact() {
  return (
    <Wrapper>
      <HeaderTwo />
      <Breadcrumnd title="Contact" subtitle="Contact" />
      <ContactHomeTwo />
      <GoogleMap />
      <ContactInfo />
      <FooterOne />
    </Wrapper>
  )
}
