import FooterOne from '../../layouts/footers/FooterOne'
import HeaderTwo from '../../layouts/headers/HeaderTwo'
import Wrapper from '../../layouts/Wrapper'
import Breadcrumnd from '../common/Breadcrumnd'
import ServiceDetailsArea from './ServiceDetailsArea'

export default function ServiceDetails() {
  return (
    <Wrapper>
      <HeaderTwo />
      <Breadcrumnd title="Service Details" subtitle="Service Details" />
      <ServiceDetailsArea />
      <FooterOne />
    </Wrapper>
  )
}
