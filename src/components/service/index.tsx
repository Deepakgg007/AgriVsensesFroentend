import Breadcrumnd from '../common/Breadcrumnd'
import ServiceArea from './ServiceArea'
import Wrapper from '../../layouts/Wrapper'
import HeaderTwo from '../../layouts/headers/HeaderTwo'
import FooterOne from '../../layouts/footers/FooterOne'

export default function Service() {
  return (
    <Wrapper>
      <HeaderTwo />
      <Breadcrumnd title="Services" subtitle="Services" />
      <ServiceArea />
      <FooterOne />
    </Wrapper>
  )
}
