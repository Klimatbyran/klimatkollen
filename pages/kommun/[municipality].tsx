import { useRouter } from 'next/router'
// import ShareButton from '../../components/ShareButton'

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  // const handleClick = () => {
  //   console.log('clicked')
  // }

  return (
    <>
      <p>Kommun: {municipality}</p>
      {/* <ShareButton handleClick={handleClick} /> */}
    </>
  )
}

export default Municipality
