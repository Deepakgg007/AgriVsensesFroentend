import Breadcrumnd from '../common/Breadcrumnd'
import ProductListArea from './ProductListArea'
import Wrapper from '../../layouts/Wrapper'
import HeaderTwo from '../../layouts/headers/HeaderTwo'
import FooterOne from '../../layouts/footers/FooterOne'

export default function ProductList() {
  return (
    <Wrapper>
      <HeaderTwo />
      <Breadcrumnd title="Product List" subtitle="Product List" />
      <ProductListArea />
      <FooterOne />
    </Wrapper>
  )
}
