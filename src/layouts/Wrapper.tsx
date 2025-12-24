 
  
import BackToTop from '../components/common/BackToTop'
import ScrollToTop from '../components/common/scroll-to-top'


export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollToTop />
      <BackToTop />
    </>
  )
}
