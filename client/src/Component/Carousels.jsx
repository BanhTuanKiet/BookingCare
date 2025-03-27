import Carousel from 'react-bootstrap/Carousel'
import ExampleCarouselImage from './ExampleCarouselImage'

function UncontrolledExample({ services }) {
  const items = []

    for (let i = 0; i < services.length; i += 4) {
        items.push(
        <Carousel.Item key={i}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {services.slice(i, i + 4).map((service, index) => (
                <ExampleCarouselImage key={index} service={service} />
            ))}
            </div>
        </Carousel.Item>
        )
    }

  return <Carousel>{items}</Carousel>
}

export default UncontrolledExample
