import FooterOne from '../../layouts/footers/FooterOne'
import HeaderTwo from '../../layouts/headers/HeaderTwo'
import Wrapper from '../../layouts/Wrapper'
import Breadcrumnd from '../common/Breadcrumnd'
import ProductDetailsArea from './ProductDetailsArea'

export default function ProductDetails() {
  return (
    <Wrapper>
      <HeaderTwo />
      <Breadcrumnd title="Product Details" subtitle="Product Details" />
      <ProductDetailsArea />
      <FooterOne />
    </Wrapper>
  )
}
