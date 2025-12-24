import FooterOne from '../../layouts/footers/FooterOne'
import HeaderTwo from '../../layouts/headers/HeaderTwo'
import Wrapper from '../../layouts/Wrapper'
import Breadcrumnd from '../common/Breadcrumnd'
import GalleryDetailsArea from './GalleryDetailsArea'

export default function GalleryDetails() {
  return (
    <Wrapper>
    <HeaderTwo />
    <Breadcrumnd title="Gallery Details" subtitle="Gallery Details" />
    <GalleryDetailsArea />
    <FooterOne />
    </Wrapper>
  )
}
