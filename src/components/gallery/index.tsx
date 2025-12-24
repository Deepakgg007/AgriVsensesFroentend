import FooterOne from '../../layouts/footers/FooterOne'
import HeaderTwo from '../../layouts/headers/HeaderTwo'
import Wrapper from '../../layouts/Wrapper'
import Breadcrumnd from '../common/Breadcrumnd'
import GalleryArea from './GalleryArea'

export default function Gallery() {
  return (
    <Wrapper>
      <HeaderTwo />
      <Breadcrumnd title="Gallery" subtitle="Gallery" />
      <GalleryArea />
      <FooterOne />
    </Wrapper>
  )
}
